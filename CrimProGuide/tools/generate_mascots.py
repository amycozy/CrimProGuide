#!/usr/bin/env python3
"""
Generate mascot character sheets from assets/character-prompts.md.

Parses each character's prompt out of the Markdown file and calls an image API
once per character, saving a 2x3 pose sheet as assets/<name>.png.

No third-party packages required (stdlib only). Honors HTTPS_PROXY / HTTP_PROXY
from the environment automatically.

Backends
--------
  gemini     (default)  needs GEMINI_API_KEY        model env: GEMINI_IMAGE_MODEL   (gemini-2.5-flash-image)
  openai                needs OPENAI_API_KEY        model env: OPENAI_IMAGE_MODEL   (gpt-image-1)
  replicate            needs REPLICATE_API_TOKEN    model env: REPLICATE_MODEL      (black-forest-labs/flux-1.1-pro)

Get a FREE Gemini key (no billing) at https://aistudio.google.com/apikey — the
free tier includes image generation with gemini-2.5-flash-image ("Nano Banana").
Note: the consumer Gemini Advanced *subscription* has no API; this uses the free
AI Studio API key instead.

Usage
-----
  export GEMINI_API_KEY=AIza...
  python3 tools/generate_mascots.py                 # all characters, skip existing
  python3 tools/generate_mascots.py felipe jada     # just these
  python3 tools/generate_mascots.py --force         # overwrite existing
  python3 tools/generate_mascots.py --backend openai
  python3 tools/generate_mascots.py --dry-run       # show what would happen, no calls
  python3 tools/generate_mascots.py --list          # list parsed characters

Notes
-----
* One API call per character returns ONE image: the full six-pose grid. Slice it
  into <name>.png / <name>-confused.png / <name>-action.png afterwards (see
  character-prompts.md); grids aren't pixel-perfect so slicing is left manual.
* Behind the managed proxy, set CA_BUNDLE to your proxy CA if TLS verification
  fails (e.g. CA_BUNDLE=/root/.ccr/ca-bundle.crt).
"""

import argparse
import base64
import json
import os
import re
import ssl
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent          # .../CrimProGuide
PROMPTS_MD = BASE / "assets" / "character-prompts.md"
DEFAULT_OUT = BASE / "assets"


# ----------------------------------------------------------------------------
# Prompt parsing
# ----------------------------------------------------------------------------
def parse_prompts(md_path: Path):
    """Return (characters, negative_prompt).

    characters: list of {key, filename, prompt} in document order.
    A character is a '## ... `<name>.png`' heading followed by the next fenced
    code block. The negative prompt is the fence under '## Shared negative...'.
    """
    text = md_path.read_text(encoding="utf-8")
    lines = text.splitlines()

    characters = []
    negative = ""
    i = 0
    heading_re = re.compile(r"^##\s+(.*?`([A-Za-z0-9_.-]+\.png)`.*)$")

    def read_fence(start):
        """Read a ``` fenced block beginning at/after `start`. Returns (body, next_i)."""
        j = start
        while j < len(lines) and not lines[j].lstrip().startswith("```"):
            j += 1
        if j >= len(lines):
            return None, start
        j += 1  # past opening fence
        buf = []
        while j < len(lines) and not lines[j].lstrip().startswith("```"):
            buf.append(lines[j])
            j += 1
        return "\n".join(buf).strip(), j + 1

    while i < len(lines):
        line = lines[i]
        if line.startswith("## ") and "Shared negative prompt" in line:
            body, i = read_fence(i + 1)
            if body:
                negative = body
            continue
        m = heading_re.match(line)
        if m:
            filename = m.group(2)
            key = filename.rsplit(".", 1)[0].lower()
            body, i = read_fence(i + 1)
            if body:
                characters.append({"key": key, "filename": filename, "prompt": body})
            continue
        i += 1

    return characters, negative


# ----------------------------------------------------------------------------
# HTTP helper (stdlib, proxy-aware)
# ----------------------------------------------------------------------------
def _ssl_context():
    ca = os.environ.get("CA_BUNDLE") or os.environ.get("REQUESTS_CA_BUNDLE") or os.environ.get("SSL_CERT_FILE")
    if ca and Path(ca).exists():
        return ssl.create_default_context(cafile=ca)
    return ssl.create_default_context()


def http_json(method, url, headers, payload=None, timeout=600):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    ctx = _ssl_context()
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw.decode()) if raw else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        raise RuntimeError(f"HTTP {e.code} from {url}\n{body[:1000]}") from None


def http_bytes(url, timeout=600):
    req = urllib.request.Request(url, method="GET")
    with urllib.request.urlopen(req, timeout=timeout, context=_ssl_context()) as resp:
        return resp.read()


# ----------------------------------------------------------------------------
# Backends -> return raw PNG bytes
# ----------------------------------------------------------------------------
def gen_gemini(prompt: str) -> bytes:
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        raise SystemExit("GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey")
    model = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    headers = {"Content-Type": "application/json", "x-goog-api-key": key}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }
    _, body = http_json("POST", url, headers, payload)
    candidates = body.get("candidates") or []
    if not candidates:
        fb = body.get("promptFeedback") or {}
        raise RuntimeError(f"Gemini returned no candidates (blockReason={fb.get('blockReason')}).")
    parts = (candidates[0].get("content") or {}).get("parts") or []
    text_note = ""
    for part in parts:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline and inline.get("data"):
            return base64.b64decode(inline["data"])
        if part.get("text"):
            text_note = part["text"]
    raise RuntimeError(f"Gemini returned no image data. Model said: {text_note[:300]!r}")


def gen_openai(prompt: str) -> bytes:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        raise SystemExit("OPENAI_API_KEY is not set.")
    model = os.environ.get("OPENAI_IMAGE_MODEL", "gpt-image-1")
    size = os.environ.get("OPENAI_IMAGE_SIZE", "1024x1024")
    quality = os.environ.get("OPENAI_IMAGE_QUALITY", "high")
    payload = {"model": model, "prompt": prompt, "size": size, "n": 1}
    if quality:
        payload["quality"] = quality
    headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    _, body = http_json("POST", "https://api.openai.com/v1/images/generations", headers, payload)
    item = body["data"][0]
    if item.get("b64_json"):
        return base64.b64decode(item["b64_json"])
    if item.get("url"):
        return http_bytes(item["url"])
    raise RuntimeError("OpenAI response contained no image data.")


def gen_replicate(prompt: str) -> bytes:
    token = os.environ.get("REPLICATE_API_TOKEN")
    if not token:
        raise SystemExit("REPLICATE_API_TOKEN is not set.")
    model = os.environ.get("REPLICATE_MODEL", "black-forest-labs/flux-1.1-pro")
    url = f"https://api.replicate.com/v1/models/{model}/predictions"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Prefer": "wait",  # block until the prediction finishes
    }
    payload = {"input": {"prompt": prompt, "aspect_ratio": "1:1", "output_format": "png"}}
    _, body = http_json("POST", url, headers, payload)

    # If it didn't finish synchronously, poll the status URL.
    status = body.get("status")
    get_url = (body.get("urls") or {}).get("get")
    while status in ("starting", "processing") and get_url:
        time.sleep(2)
        _, body = http_json("GET", get_url, headers)
        status = body.get("status")
    if status != "succeeded":
        raise RuntimeError(f"Replicate prediction status={status}: {body.get('error')}")

    out = body.get("output")
    img_url = out[0] if isinstance(out, list) else out
    if not img_url:
        raise RuntimeError("Replicate succeeded but returned no output URL.")
    return http_bytes(img_url)


BACKENDS = {"gemini": gen_gemini, "openai": gen_openai, "replicate": gen_replicate}


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------
def main():
    ap = argparse.ArgumentParser(description="Generate mascot character sheets from character-prompts.md")
    ap.add_argument("characters", nargs="*", help="character keys to generate (default: all). e.g. felipe jada")
    ap.add_argument("--backend", default=os.environ.get("BACKEND", "gemini"), choices=list(BACKENDS))
    ap.add_argument("--out", default=str(DEFAULT_OUT), help="output directory (default: assets/)")
    ap.add_argument("--prompts", default=str(PROMPTS_MD), help="path to character-prompts.md")
    ap.add_argument("--force", action="store_true", help="overwrite existing files")
    ap.add_argument("--dry-run", action="store_true", help="print actions without calling the API")
    ap.add_argument("--list", action="store_true", help="list parsed characters and exit")
    args = ap.parse_args()

    md_path = Path(args.prompts)
    if not md_path.exists():
        raise SystemExit(f"Prompt file not found: {md_path}")

    characters, negative = parse_prompts(md_path)
    if not characters:
        raise SystemExit(f"No character prompts parsed from {md_path}")

    if args.list:
        for c in characters:
            print(f"{c['key']:10s} -> {c['filename']}")
        return

    wanted = {k.lower() for k in args.characters}
    selected = [c for c in characters if not wanted or c["key"] in wanted]
    if wanted:
        missing = wanted - {c["key"] for c in characters}
        if missing:
            print(f"Unknown character(s): {', '.join(sorted(missing))}", file=sys.stderr)

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    generate = BACKENDS[args.backend]

    ok, skipped, failed = 0, 0, 0
    for c in selected:
        dest = out_dir / c["filename"]
        if dest.exists() and not args.force:
            print(f"[skip] {c['filename']} already exists (use --force to overwrite)")
            skipped += 1
            continue

        prompt = c["prompt"]
        if negative and negative.lower() not in prompt.lower():
            prompt = f"{prompt}\n\n{negative}"

        if args.dry_run:
            print(f"[dry-run] {args.backend} -> {dest}  ({len(prompt)} chars)")
            ok += 1
            continue

        print(f"[gen] {c['key']} via {args.backend} ...", flush=True)
        try:
            png = generate(prompt)
            dest.write_bytes(png)
            print(f"       wrote {dest} ({len(png)//1024} KB)")
            ok += 1
        except Exception as e:  # noqa: BLE001
            print(f"       FAILED: {e}", file=sys.stderr)
            failed += 1

    print(f"\nDone. generated/planned={ok} skipped={skipped} failed={failed}")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()

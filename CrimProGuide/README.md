# Criminal Procedure Study Guide

A flowchart-based study guide to Criminal Procedure covering key Fourth, Fifth, and Sixth Amendment doctrines.

## Overview

This interactive guide provides a systematic approach to evaluating key doctrines in Criminal Procedure, with flowcharts and case analyses to help prepare for exams and understand the complex framework of constitutional criminal procedural rights.

## Structure

The guide uses the **Broadsheet** design system — newsprint set for the web:
near-black Source Serif 4 on paper white, with cyan (`#0088b0`) and magenta
(`#d6006c`) used sparingly as process spot colors. Hierarchy comes from the
serif scale and whitespace rather than boxes or dividers. Display numerals and
page headlines render as misregistered CMYK plates.

The guide is modularly designed with the following structure:

```
crimproguide/
├── index.html          # App shell: masthead, left-rail nav, main, right rail
├── print.html          # Legacy standalone printable version
├── css/
│   └── broadsheet.css   # Broadsheet design tokens + components + print styles
├── js/
│   └── main.js          # Taxonomy, routing, plate header, TOC, case briefs, PDF
└── sections/            # 19 content fragments (loaded dynamically)
    ├── overview.html
    ├── fourth-amendment-applicability.html
    ├── search-seizure.html
    └── … (see js/main.js GROUPS for the full 7-group / 19-topic taxonomy)
```

### Layout

- **Masthead** — brand title with CMYK dots, thick/thin rules, dateline, a
  topic search field, and the **Export PDF** button.
- **Left rail** — the taxonomy: 7 collapsible groups over 19 topics. The rail
  is single-accent — group labels are neutral and cyan appears only on the
  active topic.
- **Main** — a per-topic plate numeral, kicker, CMYK headline, the doctrinal
  copy, decision flowcharts (Mermaid), and collapsible **key-case** briefs
  (rule shown; facts & reasoning on disclosure).
- **Right rail** — an auto-generated *On this page* table of contents with
  scroll-spy, plus the per-cluster mascot "guide."

The cyan/magenta split is a **content** signal (plate numerals, in-page
two-track rules) — never a left-rail signal.

### Legacy styling

`css/styles.css`, `css/footer.css`, and `css/print.css` are retained only for
the standalone `print.html`; the main guide is styled entirely by
`css/broadsheet.css`.

## How to Use

1. Open `index.html` in a web browser
2. Use the left-rail navigation to move between the 19 topics
3. Open a key-case brief to reveal its facts and reasoning
4. Click **Export PDF** to print or save the current topic (case briefs are
   expanded automatically before printing)

## Features

- Broadsheet design system (Source Serif 4, CMYK plate headlines, spot color)
- Dynamic content loading for improved performance
- Data-driven taxonomy, per-page table of contents with scroll-spy
- Collapsible case briefs for landmark Supreme Court decisions
- Interactive flowcharts using Mermaid.js to visualize decision paths
- One-click PDF export with dedicated print styles
- Responsive design for different screen sizes

## Content Sections

The guide covers these major topics in Criminal Procedure:

- **Fourth Amendment: Search & Seizure** - What constitutes a search, reasonable expectation of privacy, etc.
- **Warrant Requirements** - Probable cause, particularity, neutral magistrate, etc.
- **Warrant Exceptions** - Consent, exigent circumstances, automobile exception, plain view, etc.
- **Terry Stops** - Stop and frisk doctrine, reasonable suspicion standard
- **Exclusionary Rule** - Fruit of the poisonous tree, exceptions, standing, etc.
- **Interrogations & Confessions** - Miranda rights, voluntariness, etc.
- **Right to Counsel** - Sixth Amendment, Massiah doctrine, ineffective assistance

## Study Tips

- Use the flowcharts to understand the analytical framework for each doctrine
- Pay special attention to the key cases and their reasoning
- Print or save a PDF version before exams for quick reference
- Test your understanding by applying the flowcharts to hypothetical fact patterns

import http.server
import socketserver
import webbrowser
import os
import sys
import time
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = "CrimProGuide"  # Directory containing the guide
OPENER_MESSAGE = """
=========================================================
       CRIMINAL PROCEDURE GUIDE SERVER
=========================================================
Server running at: http://localhost:8000
Your browser should open automatically.

If not, please open your browser and go to:
http://localhost:8000

To stop the server, press Ctrl+C or close this window.
=========================================================
"""

def find_directory():
    """Find the CrimProGuide directory relative to the script location"""
    script_dir = Path(os.path.dirname(os.path.abspath(__file__)))
    
    # Check if running from the server directory (CrimProGuideServer)
    parent_dir = script_dir.parent
    if (parent_dir / DIRECTORY).exists():
        return str(parent_dir / DIRECTORY)
    
    # Check if running from the script's directory
    if (script_dir / DIRECTORY).exists():
        return str(script_dir / DIRECTORY)
    
    # Check if the script is in the CrimProGuide directory
    if script_dir.name == DIRECTORY:
        return str(script_dir)
        
    # Check if running from a parent directory
    if (Path.cwd() / DIRECTORY).exists():
        return str(Path.cwd() / DIRECTORY)
        
    # Fallback to the current directory
    print(f"Warning: Could not find '{DIRECTORY}' directory. Using current directory.")
    return os.getcwd()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Set the server directory to the CrimProGuide directory
        self.directory = find_directory()
        super().__init__(*args, **kwargs)
    
    def log_message(self, format, *args):
        # Suppress server logs to keep the console clean
        return

def open_browser():
    """Open the browser after a short delay to ensure server is running"""
    time.sleep(1)
    webbrowser.open(f'http://localhost:{PORT}')
    
if __name__ == "__main__":
    # Ensure we're using the correct directory
    guide_dir = find_directory()
    print(f"Serving files from: {guide_dir}")
    os.chdir(guide_dir)
    
    # Set up the server
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(OPENER_MESSAGE)
            
            # Open browser in a separate thread
            import threading
            threading.Thread(target=open_browser, daemon=True).start()
            
            # Run the server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\nServer stopped. Thank you for using the Criminal Procedure Guide!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98 or e.errno == 10048:  # Address already in use
            print(f"\nError: Port {PORT} is already in use. The server may already be running.")
            print(f"Please try accessing http://localhost:{PORT} in your browser, or close other applications using this port.")
            time.sleep(5)
        else:
            print(f"\nError starting server: {e}")
            time.sleep(5)

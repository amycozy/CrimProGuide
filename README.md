# Criminal Procedure Guide - Local Server Instructions

This README explains how to run the Criminal Procedure Guide using the included local server.

## Quick Start

1. Double-click the `Launch_CrimPro_Guide.bat` file
2. A browser window should open automatically to display the guide
3. When finished, close the command prompt window to stop the server

## What This Does

The launcher starts a small web server on your computer that:
- Runs on port 8000
- Serves the Criminal Procedure Guide files
- Automatically opens your default web browser
- Allows the guide to load all sections correctly

## Troubleshooting

### Browser doesn't open automatically
If your browser doesn't open automatically, manually go to:
```
http://localhost:8000
```

### "Port already in use" error
If you see this error, either:
- A previous instance of the server is still running (close any command prompt windows)
- Another application is using port 8000
  - Try closing other applications
  - Or modify the PORT variable in server.py to use a different port (e.g., 8080)

### Python not found
If you see "Python not found":
1. Download and install Python from [python.org](https://www.python.org/downloads/)
2. During installation, check the box "Add Python to PATH"
3. Restart your computer
4. Try launching again

### Can't find the CrimProGuide folder
If the server can't find the CrimProGuide folder:
1. Ensure the server.py and batch file are in the same directory as the CrimProGuide folder
2. The folder name must be exactly "CrimProGuide" (case-sensitive)

## For Advanced Users

- The server runs using Python's built-in HTTP server
- The server.py file can be modified if needed
- To run manually: open a command prompt and type `python server.py`

## Questions or Problems?

If you encounter any issues that aren't addressed by the troubleshooting steps above, please contact your course administrator for assistance.

# Criminal Procedure Study Guide Server

This is a Jekyll-based web application that serves a Criminal Procedure Study Guide with interactive flowcharts and case analyses.

## Structure

The guide is organized with the following structure:

```
CrimProGuideServer/
├── _config.yml               # Jekyll configuration
├── _layouts/                 # Jekyll layout templates
│   ├── default.html          # Main layout template
│   └── section.html          # Section-specific layout
├── CrimProGuide/             # Main content directory
│   ├── index.html            # Main entry point
│   ├── print.html            # Printable version
│   ├── css/                  # Styling
│   ├── js/                   # JavaScript
│   └── sections/             # Content sections (Fourth Amendment, etc.)
├── Printouts/                # PDF versions of guides
└── server.py                 # Simple Python HTTP server
```

## Features

- Interactive flowcharts for learning Criminal Procedure concepts
- Dynamic content loading with JavaScript
- PDF export capability
- Responsive design
- Jekyll integration for automatic "last updated" date

## Running Locally

### Using the Python Server (No Jekyll Features)

If you don't have Jekyll installed, you can use the included Python server:

1. Run `Launch_CrimPro_Guide.bat` or execute `python server.py`
2. Open your browser to http://localhost:8000

This method will serve the static files without Jekyll processing, so the "last updated" date won't be dynamic.

### Using Jekyll (Full Features)

To use all features including the dynamic "last updated" date:

1. Install Ruby and Jekyll if you haven't already:
   - Download Ruby from https://rubyinstaller.org/
   - Run `gem install jekyll bundler`

2. Install dependencies:
   ```
   bundle install
   ```

3. Run the Jekyll server:
   ```
   bundle exec jekyll serve
   ```

4. Open your browser to http://localhost:4000

## Deployment

This site can be deployed to GitHub Pages:

1. Create a repository
2. Push this code to the repository
3. Enable GitHub Pages in the repository settings

## License

Educational use only. Not for redistribution.

## Contact

For questions or assistance: contact.amyc@pm.me

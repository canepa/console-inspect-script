# Broswer Console Inspect Script

A lightweight JavaScript tool for inspecting and exploring global variables and functions in web pages.

## Overview

DOM Variables Analyzer is a diagnostic tool that helps developers inspect and analyze variables and functions available in the global scope of a web page. It creates a floating window overlay that allows interactive exploration of the JavaScript environment.

## Features

- **Variables Tab**: Lists all global variables with their types and values
  - Interactive filtering by name, type, and value
  - Detailed inspection of complex objects
  - JSON visualization for objects
  - Object tree exploration

- **Functions Tab**: Lists all global functions with their signatures
  - Filter by name, type (native/custom), and parameters
  - View complete function signatures
  - Inspect function implementations

- **Advanced Visualization**:
  - Expandable object trees for deep object inspection
  - JSON formatting for structured data
  - Console integration for further debugging

## Usage

### Method 1: As a Bookmarklet

1. Create a new bookmark in your browser
2. Set the name to "DOM Variables Analyzer"
3. Copy the minified code below and paste it as the URL:

```
javascript:(function(){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/canepa/console-inspect-script@main/console-inspect-script.js';document.body.appendChild(s);})();
```


4. Click the bookmark on any webpage to activate the analyzer

### Method 2: Direct Inclusion

Add this script tag to your HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/YOUR-USERNAME/dom-variables-analyzer@main/dom-variables-analyzer.js"></script>
```

Or include it locally:

```html
<script src="path/to/dom-variables-analyzer.js"></script>
```

### Method 3: DevTools Console

Copy the entire content of the script and paste it in your browser's DevTools console, then press Enter.

## How It Works

The analyzer:
1. Creates a floating UI panel on the page
2. Scans the global `window` object for variables and functions
3. Intelligently categorizes and displays them with type information
4. Provides interactive filters and inspection tools
5. Allows deep exploration of complex objects and function signatures

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## License

GPL

## Author

Alessandro Canepa

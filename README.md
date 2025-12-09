# MDCONVERT

Convert markdown files to HTML or PDF with professional templates. Everything runs in your browser - no server needed.

## What it does

Drop in a `.md` file and get a nicely formatted document. Pick from 7 templates (academic papers, technical reports, letters, homework, etc.), tweak some settings, and export to HTML or PDF.

Images get embedded automatically so your exports are self-contained. Works with YAML frontmatter for metadata, syntax highlighting for code, mermaid diagrams, and auto-generates a table of contents.

## How to use it

1. Open `index.html` in your browser
2. Drag in a markdown file
3. Pick a template
4. Hit convert
5. Download HTML or PDF

That's it.

## YAML frontmatter example

```yaml
---
title: Document Title
author: Your Name
date: 2025-12-09
version: 1.0.0
---
```

Different templates use different metadata fields. The metadata editor shows you what's available for each template.

## Templates

- **Academic** - Research papers with EB Garamond font
- **ISO Compliant** - Meets ISO/IEC/IEEE 29148 standards
- **Project** - Modern docs for software projects
- **Homework** - School assignments
- **Letter** - Formal correspondence
- **Technical** - Engineering reports with IBM Plex fonts
- **Minimal** - Clean and simple

## Features

- Drag and drop upload
- Live preview
- File reference detection (prompts you to upload missing images)
- Metadata editor for documents without frontmatter
- Dark mode
- Collapsible guide panel with syntax examples
- Everything stays in your browser

## Tech stack

Built with markdown-it, js-yaml, Prism.js, html2pdf.js, and Mermaid. All loaded from CDNs.

Works in any modern browser (Chrome, Firefox, Safari, Edge).

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

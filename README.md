# 📄 Markdown Document Converter

A powerful, client-side markdown to HTML/PDF converter with multiple professional templates and ISO 29148 compliance.

## ✨ Features

- **Multiple Templates**: Choose from 6 professional document templates
  - ISO/IEC/IEEE 29148 Standard (regulatory compliance)
  - Project Documentation (modern tech docs)
  - Academic/Homework (education-friendly)
  - Letter Format (formal correspondence)
  - Technical Report (research & engineering)
  - Minimal/Clean (simple & elegant)

- **Advanced Markdown Support**
  - YAML frontmatter for metadata
  - Automatic Table of Contents generation
  - Syntax highlighting for code blocks
  - Tables, blockquotes, lists
  - Images with size control
  - Mermaid diagrams support

- **Export Options**
  - Download as HTML (self-contained)
  - Generate PDF (print-ready)
  - Direct print preview

- **User-Friendly Interface**
  - Drag & drop file upload
  - Live preview
  - Responsive design
  - Dark mode support
  - Customizable settings

## 🚀 Getting Started

### Installation

1. Download all files to a directory
2. Open `index.html` in a modern web browser
3. No server or build process required!

### Usage

1. **Upload Markdown File**
   - Drag & drop your `.md` file onto the upload area
   - Or click "Browse Files" to select a file

2. **Configure Settings**
   - Choose document type
   - Adjust image size
   - Toggle Table of Contents
   - Enable/disable syntax highlighting

3. **Convert & Export**
   - Click "Convert & Preview" to see live preview
   - Download as HTML or PDF
   - Print directly from browser

## 📝 Markdown Format

### YAML Frontmatter

Add metadata at the beginning of your markdown file:

```yaml
---
title: My Document Title
author: Your Name
version: 1.0.0
created: 2025-12-09
description: Document description
keywords: markdown, documentation
status: Draft

# ISO-specific (for ISO template)
document_type: StRS
project_id: PRJ-2025-001
classification: Internal

# Academic-specific (for homework template)
course: CS 101
instructor: Dr. Smith
institution: University Name

# Letter-specific (for letter template)
sender_name: John Doe
sender_address: 123 Main St
recipient_name: Jane Smith
salutation: Dear Jane,
closing: Best regards,
---
```

### Markdown Content

Write your content using standard markdown syntax:

```markdown
# Main Heading

## Section Heading

This is a paragraph with **bold** and *italic* text.

### Code Example

```python
def hello_world():
    print("Hello, World!")
```

### Lists

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2

### Tables

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |

### Images

![Alt text](image.png)

### Blockquotes

> This is a quote
```

## 🎨 Templates

### ISO/IEC/IEEE 29148 Standard
- Professional header with document metadata
- Table of Contents sidebar
- Regulatory compliance formatting
- Version history support
- Approval section

### Project Documentation
- Modern gradient header
- Clean navigation
- Developer-friendly styling
- Code-focused design

### Academic/Homework
- Traditional academic format
- Center-aligned header
- Serif font for readability
- Print-optimized layout

### Letter Format
- Formal business letter style
- Sender/recipient information
- Professional spacing
- Single column layout

### Technical Report
- Cover page design
- Professional gradient themes
- Technical content focus
- Multi-section support

### Minimal/Clean
- GitHub-style markdown
- Minimalist design
- Maximum readability
- No sidebar distraction

## 🛠️ Technical Details

### Dependencies (CDN-loaded)

- **markdown-it** v13.0.2 - Markdown parser
- **js-yaml** v4.1.0 - YAML frontmatter parser
- **Prism.js** v1.29.0 - Syntax highlighting
- **html2pdf.js** v0.10.1 - PDF generation
- **Mermaid** v10+ - Diagram rendering

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### File Structure

```
e:\CS60\
├── index.html              # Main application page
├── styles.css              # Application styling
├── app.js                  # Main application logic
├── converter.js            # Markdown conversion engine
├── templates.js            # Document templates
├── markdown-it-anchor.js   # Heading anchors plugin
├── markdown-it-toc.js      # Table of contents plugin
├── README.md               # This file
└── sample.md               # Sample markdown file
```

## 💡 Tips & Best Practices

1. **Image Optimization**: Optimize images before embedding for better performance
2. **Metadata Completeness**: Fill all relevant frontmatter fields for best results
3. **Template Selection**: Choose template based on your document's purpose
4. **Browser Testing**: Test PDF export in your target browser
5. **File Organization**: Keep images in relative paths for portability

## 🔧 Customization

### Adding New Templates

Edit `templates.js` and add a new template object:

```javascript
'custom-template': {
    name: 'Custom Template',
    generateHTML: function(content, metadata, toc) {
        // Your custom HTML template
        return `<!DOCTYPE html>...`;
    }
}
```

### Modifying Styles

Edit `styles.css` to customize the application interface or preview styling.

## 📄 License

This project is free to use for personal and commercial purposes.

## 🤝 Contributing

Feel free to fork, modify, and enhance this converter for your needs!

## 📞 Support

For issues or questions, please check the code comments or create an issue.

---

**Version**: 1.0.0  
**Last Updated**: December 9, 2025  
**Developed with**: JavaScript, markdown-it, html2pdf.js

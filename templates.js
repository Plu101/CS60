// Document templates for different types
const templates = {
    'iso-compliant': {
        name: 'ISO/IEC/IEEE 29148 Standard',
        generateHTML: function(content, metadata, toc) {
            return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base target="_parent">
    <meta name="author" content="${metadata.author || 'Unknown Author'}">
    <meta name="description" content="${metadata.description || ''}">
    <meta name="keywords" content="${metadata.keywords || ''}">
    <meta name="created" content="${metadata.created || new Date().toISOString().split('T')[0]}">
    <meta name="last-modified" content="${metadata.modified || new Date().toISOString().split('T')[0]}">
    <meta name="version" content="${metadata.version || '1.0.0'}">
    <title>${metadata.title || 'Untitled Document'}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <style>
        .math-block { margin: 1.5rem 0; overflow-x: auto; }
        
        /* Academic Color Scheme */
        :root {
            --primary-color: #1e3a5f;
            --secondary-color: #4a5f7a;
            --accent-color: #8b2635;
            --bg-color: #fdfdfb;
            --text-color: #1a1a2e;
            --border-color: #d4d1c7;
            --sidebar-bg: #f7f6f2;
            --code-bg: #f9f8f5;
            --header-bg: #ebe9e3;
        }
        
        /* Progress Bar */
        .read-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            z-index: 10000;
            transition: width 0.1s ease-out;
        }
        
        /* Print Button */
        .print-button {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .print-button:hover {
            background: var(--accent-color);
            transform: scale(1.1);
        }
        
        .print-button svg {
            width: 24px;
            height: 24px;
        }
        
        @media print {
            .print-button {
                display: none;
            }
            .read-progress-bar {
                display: none;
            }
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.8;
            color: var(--text-color);
            background-color: var(--bg-color);
        }
        
        /* Document Header - Foldable Metadata */
        .document-header {
            background: var(--header-bg);
            border-bottom: 2px solid var(--border-color);
            margin-bottom: 2rem;
        }
        
        .document-header-toggle {
            width: 100%;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 1.25rem 2rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.15rem;
            font-weight: 600;
            transition: background 0.2s;
        }
        
        .document-header-toggle:hover {
            background: var(--secondary-color);
        }
        
        .document-header-toggle .chevron {
            transition: transform 0.3s ease;
        }
        
        .document-header.collapsed .chevron {
            transform: rotate(-90deg);
        }
        
        .document-header-content {
            padding: 1.5rem 2rem;
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }
        
        .document-header.collapsed .document-header-content {
            max-height: 0;
            padding: 0 2rem;
        }
        
        .document-header table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .document-header th {
            text-align: left;
            padding: 0.75rem 1rem;
            background: var(--primary-color);
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .document-header td {
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-color);
        }
        
        .document-header td:first-child {
            font-weight: 600;
            width: 180px;
            background: var(--sidebar-bg);
        }
        
        .main-container {
            display: grid;
            grid-template-columns: 300px 1fr;
            max-width: 1400px;
            margin: 0 auto;
            gap: 2rem;
        }
        
        .sidebar {
            padding: 1rem;
            background: var(--sidebar-bg);
            border-right: 1px solid var(--border-color);
            position: sticky;
            top: 0;
            height: fit-content;
            max-height: 100vh;
            overflow-y: auto;
        }
        
        .table-of-contents h2 {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
            font-weight: 600;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 0.5rem;
        }
        
        .table-of-contents ul {
            list-style: none;
            padding-left: 0;
        }
        
        .table-of-contents li.has-children {
            margin: 0.5rem 0;
        }
        
        .table-of-contents .toc-toggle {
            cursor: pointer;
            user-select: none;
            display: inline-block;
            width: 1em;
            transition: transform 0.2s;
            font-size: 0.8em;
        }
        
        .table-of-contents .toc-children {
            padding-left: 1.2rem;
            margin-top: 0.3rem;
        }
        
        .table-of-contents .toc-children.collapsed {
            display: none;
        }
        
        .table-of-contents .toc-children ul {
            padding-left: 0.5rem;
        }
        
        .table-of-contents li {
            margin: 0.5rem 0;
        }
        
        .table-of-contents a {
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .table-of-contents a:hover {
            color: var(--secondary-color);
            text-decoration: underline;
        }
        
        .content {
            padding: 2rem;
            max-width: 900px;
        }
        
        h1 {
            font-size: 2.5rem;
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
            padding-bottom: 0.5rem;
            margin-bottom: 2rem;
        }
        
        h2 {
            font-size: 2rem;
            color: var(--primary-color);
            margin: 2rem 0 1rem 0;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 0.3rem;
        }
        
        h3 {
            font-size: 1.5rem;
            color: var(--primary-color);
            margin: 1.5rem 0 1rem 0;
        }
        
        p {
            text-align: justify;
            margin: 1rem 0;
            line-height: 1.8;
        }
        
        img, svg {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 1.5rem auto;
            border-radius: 4px;
        }
        
        svg {
            background: #fff;
            border: 1px solid #ddd;
        }
        
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        li {
            margin: 0.5rem 0;
        }
        
        pre {
            background: var(--code-bg);
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        code {
            font-family: 'Consolas', 'Monaco', monospace;
            background: var(--code-bg);
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.9em;
        }
        
        pre code {
            background: none;
            padding: 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }
        
        th, td {
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            text-align: left;
        }
        
        th {
            background: var(--sidebar-bg);
            font-weight: 600;
        }
        
        blockquote {
            border-left: 4px solid var(--secondary-color);
            padding-left: 1rem;
            margin: 1rem 0;
            color: var(--text-color);
            font-style: italic;
        }
        
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        li {
            margin: 0.5rem 0;
        }
        
        .iso-footer {
            margin-top: 3rem;
            padding: 1rem;
            background: var(--sidebar-bg);
            text-align: center;
            font-size: 0.9rem;
            color: var(--text-color);
            border-top: 1px solid var(--border-color);
        }
        
        @media print {
            .sidebar {
                display: none;
            }
            .main-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Read Progress Bar -->
    <div class="read-progress-bar" id="readProgressBar"></div>
    
    <!-- Print Button -->
    <button class="print-button" onclick="window.print()" title="Print Document">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <path d="M6 14h12v8H6z"/>
        </svg>
    </button>
    
    <!-- Document Header - Foldable -->
    <div class="document-header" id="documentHeader">
        <button class="document-header-toggle" onclick="toggleMetadata()">
            <span>Document Metadata</span>
            <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
        <div class="document-header-content">
            <table>
                <tr>
                    <th colspan="2">${metadata.title || 'Untitled Document'}</th>
                </tr>
                <tr>
                    <td><strong>Document Type:</strong></td>
                    <td>${metadata.document_type || metadata.iso_doc_type || 'StRS'}</td>
                </tr>
                <tr>
                    <td><strong>Author:</strong></td>
                    <td>${metadata.author || 'Unknown Author'}</td>
                </tr>
                <tr>
                    <td><strong>Version:</strong></td>
                    <td>${metadata.version || '1.0.0'}</td>
                </tr>
                <tr>
                    <td><strong>Date:</strong></td>
                    <td>${metadata.created || new Date().toISOString().split('T')[0]}</td>
                </tr>
                <tr>
                    <td><strong>Status:</strong></td>
                    <td>${metadata.status || 'Draft'}</td>
                </tr>
                ${metadata.project_id ? `<tr><td><strong>Project ID:</strong></td><td>${metadata.project_id}</td></tr>` : ''}
                ${metadata.classification ? `<tr><td><strong>Classification:</strong></td><td>${metadata.classification}</td></tr>` : ''}
            </table>
        </div>
    </div>
    
    <div class="main-container">
        <aside class="sidebar">
            ${toc}
        </aside>
        <main class="content">
            ${content}
        </main>
    </div>
    
    <footer class="iso-footer">
        ISO/IEC/IEEE 29148:2018 Compliant Document | Generated on ${new Date().toLocaleDateString()}
    </footer>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js"></script>
    <script>
        Prism.highlightAll();
        
        // Toggle metadata header
        function toggleMetadata() {
            const header = document.getElementById('documentHeader');
            header.classList.toggle('collapsed');
        }
        
        // Read progress bar
        function updateProgressBar() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('readProgressBar').style.width = scrolled + '%';
        }
        
        window.addEventListener('scroll', updateProgressBar);
        
        // Make TOC items collapsible
        document.addEventListener('DOMContentLoaded', function() {
            const tocToggles = document.querySelectorAll('.toc-toggle');
            tocToggles.forEach(function(toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetId = this.getAttribute('data-target');
                    const targetDiv = document.getElementById(targetId);
                    if (targetDiv) {
                        targetDiv.classList.toggle('collapsed');
                        this.textContent = targetDiv.classList.contains('collapsed') ? '▶' : '▼';
                    }
                });
            });
        });
    </script>
</body>
</html>`;
        }
    },
    
    'project': {
        name: 'Project Documentation',
        generateHTML: function(content, metadata, toc) {
            return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base target="_parent">
    <title>${metadata.title || 'Project Documentation'}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <style>
        .math-block { margin: 1.5rem 0; overflow-x: auto; }
        :root {
            --primary: #1e3a5f;
            --primary-dark: #4a5f7a;
            --accent: #8b2635;
            --bg: #fdfdfb;
            --text: #1a1a2e;
            --border: #d4d1c7;
            --sidebar-bg: #f7f6f2;
        }
        
        /* Progress Bar */
        .read-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            z-index: 10000;
            transition: width 0.1s ease-out;
        }
        
        /* Print Button */
        .print-button {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .print-button:hover {
            background: var(--accent);
            transform: scale(1.1);
        }
        
        .print-button svg {
            width: 24px;
            height: 24px;
        }
        
        @media print {
            .print-button { display: none; }
            .read-progress-bar { display: none; }
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: var(--text);
            background: var(--bg);
        }
        
        /* Foldable Header */
        .project-header {
            border-bottom: 2px solid var(--border);
            margin-bottom: 2rem;
        }
        
        .project-header-toggle {
            width: 100%;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            border: none;
            padding: 1.5rem 2rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.2rem;
            font-weight: 600;
            transition: background 0.2s;
        }
        
        .project-header-toggle:hover {
            opacity: 0.9;
        }
        
        .project-header-toggle .chevron {
            transition: transform 0.3s ease;
        }
        
        .project-header.collapsed .chevron {
            transform: rotate(-90deg);
        }
        
        .project-header-content {
            background: var(--sidebar-bg);
            padding: 2rem;
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }
        
        .project-header.collapsed .project-header-content {
            max-height: 0;
            padding: 0 2rem;
        }
        
        .project-header-content h1 {
            font-size: 2.2rem;
            margin-bottom: 1rem;
            font-weight: 600;
            letter-spacing: 0.01em;
            color: var(--text);
        }
        
        .project-meta {
            display: flex;
            gap: 2rem;
            font-size: 0.95rem;
            color: #5f6368;
        }
        
        .container {
            display: grid;
            grid-template-columns: 280px 1fr;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .sidebar {
            background: var(--sidebar-bg);
            padding: 2rem 1.5rem;
            border-right: 1px solid var(--border);
            position: sticky;
            top: 0;
            height: fit-content;
            max-height: 100vh;
            overflow-y: auto;
        }
        
        .table-of-contents h2 {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: var(--primary);
            font-weight: 600;
            border-bottom: 2px solid var(--border);
            padding-bottom: 0.5rem;
        }
        
        .table-of-contents ul {
            list-style: none;
            padding: 0;
        }
        
        .table-of-contents li {
            margin: 0.5rem 0;
        }
        
        .table-of-contents li.has-children {
            margin: 0.5rem 0;
        }
        
        .table-of-contents .toc-toggle {
            cursor: pointer;
            user-select: none;
            display: inline-block;
            width: 1em;
            transition: transform 0.2s;
            font-size: 0.8em;
        }
        
        .table-of-contents .toc-children {
            padding-left: 1.2rem;
            margin-top: 0.3rem;
        }
        
        .table-of-contents .toc-children.collapsed {
            display: none;
        }
        
        .table-of-contents .toc-children ul {
            padding-left: 0.5rem;
        }
        
        .table-of-contents a {
            color: var(--text);
            text-decoration: none;
            font-size: 0.9rem;
            transition: color 0.2s;
        }
        
        .table-of-contents a:hover {
            color: var(--primary);
        }
        
        .content {
            padding: 3rem;
            max-width: 900px;
        }
        
        h1, h2, h3, h4 { color: var(--text); margin: 2rem 0 1rem; }
        h1 { font-size: 2.5rem; }
        h2 { font-size: 2rem; border-bottom: 2px solid var(--primary); padding-bottom: 0.5rem; }
        h3 { font-size: 1.5rem; }
        
        p { margin: 1rem 0; }
        
        img, svg {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 2rem auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        svg {
            background: #fff;
            border: 1px solid #ddd;
        }
        
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        li {
            margin: 0.5rem 0;
        }
        
        pre {
            background: var(--sidebar-bg);
            border: 1px solid var(--border);
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
        }
        
        code {
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.9em;
            background: var(--sidebar-bg);
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
        }
        
        pre code {
            background: none;
            padding: 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            border: 1px solid var(--border);
        }
        
        th, td {
            padding: 0.75rem;
            border: 1px solid var(--border);
        }
        
        th {
            background: var(--primary);
            color: white;
            font-weight: 600;
        }
        
        blockquote {
            border-left: 4px solid var(--accent);
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #5f6368;
            background: var(--sidebar-bg);
            padding: 1rem 1rem 1rem 1.5rem;
            border-radius: 4px;
        }
        
        ul, ol { margin: 1rem 0; padding-left: 2rem; }
        li { margin: 0.5rem 0; }
        
        @media print {
            .sidebar { display: none; }
            .container { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <!-- Read Progress Bar -->
    <div class="read-progress-bar" id="readProgressBar"></div>
    
    <!-- Print Button -->
    <button class="print-button" onclick="window.print()" title="Print Document">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <path d="M6 14h12v8H6z"/>
        </svg>
    </button>
    
    <header class="project-header" id="projectHeader">
        <button class="project-header-toggle" onclick="toggleMetadata()">
            <span>Project Information</span>
            <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
        <div class="project-header-content">
            <h1>${metadata.title || 'Project Documentation'}</h1>
            <div class="project-meta">
                <span><strong>Author:</strong> ${metadata.author || 'Unknown Author'}</span>
                <span><strong>Date:</strong> ${metadata.created || new Date().toISOString().split('T')[0]}</span>
                <span><strong>Version:</strong> v${metadata.version || '1.0.0'}</span>
            </div>
        </div>
    </header>
    
    <div class="container">
        <aside class="sidebar">${toc}</aside>
        <main class="content">${content}</main>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script>
        Prism.highlightAll();
        
        // Toggle metadata header
        function toggleMetadata() {
            const header = document.getElementById('projectHeader');
            header.classList.toggle('collapsed');
        }
        
        // Read progress bar
        function updateProgressBar() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('readProgressBar').style.width = scrolled + '%';
        }
        
        window.addEventListener('scroll', updateProgressBar);
        
        document.addEventListener('DOMContentLoaded', function() {
            const tocToggles = document.querySelectorAll('.toc-toggle');
            tocToggles.forEach(function(toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetId = this.getAttribute('data-target');
                    const targetDiv = document.getElementById(targetId);
                    if (targetDiv) {
                        targetDiv.classList.toggle('collapsed');
                        this.textContent = targetDiv.classList.contains('collapsed') ? '▶' : '▼';
                    }
                });
            });
        });
    </script>
</body>
</html>`;
        }
    },
    
    'homework': {
        name: 'Academic/Homework',
        generateHTML: function(content, metadata, toc) {
            return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base target="_parent">
    <title>${metadata.title || 'Academic Assignment'}</title>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
    <style>
        .math-block { margin: 1.5rem 0; overflow-x: auto; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* Progress Bar */
        .read-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #1e3a5f, #8b2635);
            z-index: 10000;
            transition: width 0.1s ease-out;
        }
        
        /* Print Button */
        .print-button {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #1e3a5f;
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .print-button:hover {
            background: #8b2635;
            transform: scale(1.1);
        }
        
        .print-button svg {
            width: 24px;
            height: 24px;
        }
        
        @media print {
            .print-button { display: none; }
            .read-progress-bar { display: none; }
        }
        
        body {
            font-family: 'EB Garamond', Georgia, 'Times New Roman', serif;
            line-height: 1.9;
            color: #2b2a27;
            background: #fffdf9;
            max-width: 800px;
            margin: 0 auto;
            padding: 3rem 2rem;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            hyphens: auto;
        }
        
        .header {
            margin-bottom: 3rem;
            border: 1px solid #d4d1c7;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .header-toggle {
            width: 100%;
            background: #1e3a5f;
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'EB Garamond', serif;
            font-size: 1.1rem;
            font-weight: 600;
            transition: background 0.2s;
        }
        
        .header-toggle:hover {
            background: #4a5f7a;
        }
        
        .header-toggle .chevron {
            transition: transform 0.3s ease;
        }
        
        .header.collapsed .chevron {
            transform: rotate(-90deg);
        }
        
        .header-content {
            background: #f7f6f2;
            padding: 2rem;
            text-align: center;
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }
        
        .header.collapsed .header-content {
            max-height: 0;
            padding: 0 2rem;
        }
        
        .header-content h1 {
            font-size: 2.2rem;
            margin-bottom: 1rem;
            color: #1e262d;
            letter-spacing: 0.02em;
            font-variant: small-caps;
            border-bottom: 2px solid #d4d1c7;
            padding-bottom: 0.5rem;
        }
        
        .header-info {
            font-size: 1rem;
            color: #6b6257;
            line-height: 1.6;
        }
        
        .header-info div {
            margin: 0.3rem 0;
        }
        
        h1, h2, h3, h4 {
            color: #1e262d;
            margin: 2rem 0 1rem;
        }
        
        h2 {
            font-size: 1.5rem;
            border-bottom: 1px solid #e5dbc8;
            padding-bottom: 0.5rem;
        }
        
        h3 {
            font-size: 1.25rem;
        }
        
        p {
            text-align: justify;
            margin: 1rem 0;
            hanging-punctuation: first;
        }
        
        img, svg {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 2rem auto;
        }
        
        svg {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        li {
            margin: 0.5rem 0;
        }
        
        pre {
            background: #f6f2e9;
            border: 1px solid #e5dbc8;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        code {
            font-family: 'Crimson Text', 'EB Garamond', serif;
            font-size: 0.9em;
            background: #f6f2e9;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
        }
        
        pre code {
            background: none;
            padding: 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }
        
        th, td {
            padding: 0.75rem;
            border: 1px solid #e5dbc8;
            text-align: left;
        }
        
        th {
            background: #fffdf9;
            font-weight: 600;
        }
        
        blockquote {
            border-left: 4px solid #8b2635;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #5a5247;
        }
        
        ul, ol {
            margin: 1rem 0;
            padding-left: 3rem;
        }
        
        li {
            margin: 0.5rem 0;
        }
        
        .footer {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 1px solid #e5dbc8;
            text-align: center;
            font-size: 0.9rem;
            color: #6b6257;
        }
        
        @media print {
            body {
                max-width: 100%;
                padding: 1in;
            }
        }
    </style>
</head>
<body>
    <!-- Read Progress Bar -->
    <div class="read-progress-bar" id="readProgressBar"></div>
    
    <!-- Print Button -->
    <button class="print-button" onclick="window.print()" title="Print Document">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <path d="M6 14h12v8H6z"/>
        </svg>
    </button>
    
    <div class="header" id="headerSection">
        <button class="header-toggle" onclick="toggleMetadata()">
            <span>Assignment Information</span>
            <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
        <div class="header-content">
            <h1>${metadata.title || 'Academic Assignment'}</h1>
            <div class="header-info">
                <div><strong>Student:</strong> ${metadata.author || metadata.student || 'Unknown'}</div>
                ${metadata.course ? `<div><strong>Course:</strong> ${metadata.course}</div>` : ''}
                ${metadata.instructor ? `<div><strong>Instructor:</strong> ${metadata.instructor}</div>` : ''}
                ${metadata.institution ? `<div><strong>Institution:</strong> ${metadata.institution}</div>` : ''}
                <div><strong>Date:</strong> ${metadata.created || new Date().toISOString().split('T')[0]}</div>
            </div>
        </div>
    </div>
    
    <main>
        ${content}
    </main>
    
    <div class="footer">
        ${metadata.author || 'Student Name'} | ${new Date().getFullYear()}
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script>
        Prism.highlightAll();
        
        // Toggle metadata header
        function toggleMetadata() {
            const header = document.getElementById('headerSection');
            header.classList.toggle('collapsed');
        }
        
        // Read progress bar
        function updateProgressBar() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('readProgressBar').style.width = scrolled + '%';
        }
        
        window.addEventListener('scroll', updateProgressBar);
    </script>
</body>
</html>`;
        }
    },

    'academic-classic': {
        name: 'Academic Classic (Cambridge)',
        generateHTML: function(content, metadata, toc) {
            return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base target="_parent">
    <title>${metadata.title || 'Academic Paper'}</title>
    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
    <style>
        .math-block { margin: 1.5rem 0; overflow-x: auto; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* Progress Bar */
        .read-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #1e3a5f, #8b2635);
            z-index: 10000;
            transition: width 0.1s ease-out;
        }
        
        /* Print Button */
        .print-button {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #1e3a5f;
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .print-button:hover {
            background: #8b2635;
            transform: scale(1.1);
        }
        
        .print-button svg {
            width: 24px;
            height: 24px;
        }
        
        @media print {
            .print-button { display: none; }
            .read-progress-bar { display: none; }
        }
        
        body {
            font-family: 'EB Garamond', Georgia, 'Times New Roman', serif;
            color: #2b2a27;
            background: #fffdf9;
            max-width: 760px;
            margin: 0 auto;
            padding: 3rem 2rem;
            line-height: 1.85;
            text-rendering: optimizeLegibility;
            hyphens: auto;
        }
        
        /* Foldable Metadata Header */
        header.title {
            margin-bottom: 2.5rem;
            border: 1px solid #d4d1c7;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .metadata-toggle {
            width: 100%;
            background: #1e3a5f;
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'EB Garamond', serif;
            font-size: 1.1rem;
            font-weight: 600;
            transition: background 0.2s;
        }
        
        .metadata-toggle:hover {
            background: #4a5f7a;
        }
        
        .metadata-toggle .chevron {
            transition: transform 0.3s ease;
        }
        
        header.title.collapsed .chevron {
            transform: rotate(-90deg);
        }
        
        .metadata-content {
            background: #f7f6f2;
            padding: 1.5rem;
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }
        
        header.title.collapsed .metadata-content {
            max-height: 0;
            padding: 0 1.5rem;
        }
        
        .metadata-content h1 {
            font-size: 2.2rem;
            letter-spacing: .01em;
            color: #1e262d;
            font-weight: 600;
            margin-bottom: .75rem;
            line-height: 1.2;
            border-bottom: 2px solid #d4d1c7;
            padding-bottom: 0.5rem;
        }
        
        .metadata-content .meta {
            color: #6b6257;
            font-size: 0.95rem;
            line-height: 1.6;
            padding-top: 0.75rem;
        }
        
        .contents { margin: 1rem 0 2rem; }
        .contents .table-of-contents {
            background: #fffdf9; border: 1px solid #d4d1c7; border-radius: 6px; padding: 1.25rem;
        }
        .contents .table-of-contents h2 { 
            font-size: 1.15rem; 
            color: #1e3a5f; 
            letter-spacing: .06em; 
            font-variant: small-caps; 
            margin-bottom: .5rem;
            font-weight: 600;
            border-bottom: 2px solid #d4d1c7;
            padding-bottom: 0.5rem;
        }
        .contents .table-of-contents ul { list-style: none; padding-left: 0; }
        .contents .table-of-contents li { margin: .4rem 0; }
        .contents .table-of-contents li.has-children { margin: 0.5rem 0; }
        .contents .table-of-contents .toc-toggle { cursor: pointer; user-select: none; display: inline-block; width: 1em; transition: transform 0.2s; font-size: 0.8em; }
        .contents .table-of-contents .toc-children { padding-left: 1.2rem; margin-top: 0.3rem; }
        .contents .table-of-contents .toc-children.collapsed { display: none; }
        .contents .table-of-contents .toc-children ul { padding-left: 0.5rem; }
        .contents .table-of-contents a { color: #5a5247; text-decoration: none; }
        .contents .table-of-contents a:hover { text-decoration: underline; color: #1e3a5f; }
        main.content { margin-top: 1rem; }
        h1, h2, h3, h4 { color: #1e262d; margin: 2rem 0 1rem; font-weight: 600; }
        h2 { font-size: 1.5rem; border-bottom: 1px solid #d4d1c7; padding-bottom: .5rem; margin-top: 2.5rem; }
        h3 { font-size: 1.25rem; margin-top: 2rem; }
        h4 { font-size: 1.1rem; }
        p { text-align: justify; margin: 1rem 0; line-height: 1.9; }
        p:first-of-type { margin-top: 0; }
        ul, ol { margin: 1rem 0; padding-left: 2rem; }
        li { margin: 0.5rem 0; }
        blockquote { border-left: 4px solid #8b2635; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #5a5247; }
        img, svg { max-width: ${metadata.image_size || '80%'}; height: auto; display: block; margin: 1.5rem auto; border: 1px solid #d4d1c7; border-radius: 4px; }
        svg { background: #fff; border: 1px solid #ddd; }
        pre { background: #f6f2e9; border: 1px solid #d4d1c7; padding: 1rem; border-radius: 4px; overflow-x: auto; margin: 1rem 0; }
        code { font-family: 'Crimson Text', 'EB Garamond', serif; background: #f6f2e9; padding: .2rem .4rem; border-radius: 3px; }
        table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
        th, td { padding: .75rem; border: 1px solid #d4d1c7; text-align: left; }
        th { background: #fffdf9; font-weight: 600; }
        footer.foot { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #d4d1c7; text-align: center; color: #6b6257; font-size: .95rem; }
        @media print { body { max-width: 100%; padding: 1in; } .contents { page-break-after: always; } }
    </style>
</head>
<body>
    <!-- Read Progress Bar -->
    <div class="read-progress-bar" id="readProgressBar"></div>
    
    <!-- Print Button -->
    <button class="print-button" onclick="window.print()" title="Print Document">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <path d="M6 14h12v8H6z"/>
        </svg>
    </button>
    
    <header class="title" id="metadataHeader">
        <button class="metadata-toggle" onclick="toggleMetadata()">
            <span>Document Information</span>
            <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
        <div class="metadata-content">
            <h1>${metadata.title || 'Academic Paper'}</h1>
            <div class="meta">
                <div><strong>Author:</strong> ${metadata.author || 'Author Name'}</div>
                <div><strong>Institution:</strong> ${metadata.institution || 'N/A'}</div>
                <div><strong>Date:</strong> ${metadata.created || new Date().toISOString().split('T')[0]}</div>
                <div><strong>Version:</strong> ${metadata.version || '1.0.0'}</div>
            </div>
        </div>
    </header>
    ${toc ? `<section class="contents">${toc}</section>` : ''}
    <main class="content">${content}</main>
    <footer class="foot">Prepared by ${metadata.author || 'Author'}</footer>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script>
        Prism.highlightAll();
        
        // Toggle metadata
        function toggleMetadata() {
            const header = document.getElementById('metadataHeader');
            header.classList.toggle('collapsed');
        }
        
        // Read progress bar
        function updateProgressBar() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('readProgressBar').style.width = scrolled + '%';
        }
        
        window.addEventListener('scroll', updateProgressBar);
        
        document.addEventListener('DOMContentLoaded', function() {            
            const tocToggles = document.querySelectorAll('.toc-toggle');
            tocToggles.forEach(function(toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetId = this.getAttribute('data-target');
                    const targetDiv = document.getElementById(targetId);
                    if (targetDiv) {
                        targetDiv.classList.toggle('collapsed');
                        this.textContent = targetDiv.classList.contains('collapsed') ? '▶' : '▼';
                    }
                });
            });
        });
    </script>
</body>
</html>`;
        }
    },
    
    'letter': {
        name: 'Letter Format',
        generateHTML: function(content, metadata, toc) {
            return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base target="_parent">
    <title>${metadata.title || 'Letter'}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <style>
        .math-block { margin: 1.5rem 0; overflow-x: auto; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            line-height: 1.6;
            color: #000000;
            background: #ffffff;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
        }
        
        .letterhead {
            text-align: right;
            margin-bottom: 2rem;
        }
        
        .sender-info {
            font-size: 0.95rem;
            line-height: 1.4;
        }
        
        .date {
            margin: 2rem 0;
            text-align: left;
        }
        
        .recipient-info {
            margin-bottom: 2rem;
        }
        
        .salutation {
            margin-bottom: 1.5rem;
        }
        
        .body {
            text-align: justify;
        }
        
        .body p {
            margin: 1rem 0;
            text-indent: 0;
        }
        
        .closing {
            margin-top: 2rem;
        }
        
        .signature {
            margin-top: 3rem;
        }
        
        h1, h2, h3 {
            color: #000000;
            margin: 1.5rem 0 1rem;
        }
        
        img, svg {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 1rem auto;
        }
        
        svg {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        li {
            margin: 0.5rem 0;
        }
        
        @page {
            size: letter;
            margin: 1in;
        }
        
        @media print {
            body {
                padding: 0;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="letterhead">
        <div class="sender-info">
            ${metadata.sender_name ? `<div><strong>${metadata.sender_name}</strong></div>` : ''}
            ${metadata.sender_address ? `<div>${metadata.sender_address}</div>` : ''}
            ${metadata.sender_email ? `<div>${metadata.sender_email}</div>` : ''}
            ${metadata.sender_phone ? `<div>${metadata.sender_phone}</div>` : ''}
        </div>
    </div>
    
    <div class="date">
        ${metadata.date || metadata.created || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
    
    ${metadata.recipient_name || metadata.recipient_address ? `
    <div class="recipient-info">
        ${metadata.recipient_name ? `<div>${metadata.recipient_name}</div>` : ''}
        ${metadata.recipient_address ? `<div>${metadata.recipient_address}</div>` : ''}
    </div>
    ` : ''}
    
    ${metadata.salutation ? `<div class="salutation">${metadata.salutation}</div>` : '<div class="salutation">Dear Sir/Madam,</div>'}
    
    <div class="body">
        ${content}
    </div>
    
    <div class="closing">
        ${metadata.closing || 'Sincerely,'}
    </div>
    
    <div class="signature">
        ${metadata.sender_name || metadata.author || ''}
    </div>
</body>
</html>`;
        }
    },
    
    'technical': {
        name: 'Technical Report',
        generateHTML: function(content, metadata, toc) {
            return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base target="_parent">
    <title>${metadata.title || 'Technical Report'}</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
    <style>
        .math-block { margin: 1.5rem 0; overflow-x: auto; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* Progress Bar */
        .read-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #1e3a5f, #8b2635);
            z-index: 10000;
            transition: width 0.1s ease-out;
        }
        
        /* Print Button */
        .print-button {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #1e3a5f;
            color: white;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .print-button:hover {
            background: #8b2635;
            transform: scale(1.1);
        }
        
        .print-button svg {
            width: 24px;
            height: 24px;
        }
        
        @media print {
            .print-button { display: none; }
            .read-progress-bar { display: none; }
        }
        
        body {
            font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.75;
            color: #1a1a2e;
            background: #fdfdfb;
            max-width: 820px;
            margin: 0 auto;
            padding: 3rem 2.5rem;
            text-rendering: optimizeLegibility;
        }
        
        header.title {
            margin-bottom: 2.5rem;
            border: 1px solid #d4d1c7;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .title-toggle {
            width: 100%;
            background: #1e3a5f;
            color: white;
            border: none;
            padding: 1rem 1.5rem;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'IBM Plex Sans', sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            transition: background 0.2s;
        }
        
        .title-toggle:hover {
            background: #4a5f7a;
        }
        
        .title-toggle .chevron {
            transition: transform 0.3s ease;
        }
        
        header.title.collapsed .chevron {
            transform: rotate(-90deg);
        }
        
        .title-content {
            background: #f7f6f2;
            padding: 1.5rem;
            text-align: center;
            max-height: 1000px;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }
        
        header.title.collapsed .title-content {
            max-height: 0;
            padding: 0 1.5rem;
        }
        
        .title-content h1 {
            font-size: 2rem;
            color: #0f172a;
            margin-bottom: 0.75rem;
            font-weight: 700;
            line-height: 1.2;
            border-bottom: 2px solid #d4d1c7;
            padding-bottom: 0.5rem;
        }
        
        .title-content .meta {
            color: #5f6368;
            font-size: 0.95rem;
            line-height: 1.6;
        }
        
        .contents { margin: 1rem 0 2rem; }
        .contents .table-of-contents {
            background: #f7f6f2;
            border: 1px solid #d4d1c7;
            border-radius: 8px;
            padding: 1.25rem;
        }
        .contents .table-of-contents h2 {
            font-size: 1rem;
            color: #1e3a5f;
            letter-spacing: .05em;
            text-transform: uppercase;
            margin-bottom: .5rem;
            font-weight: 600;
            border-bottom: 2px solid #d4d1c7;
            padding-bottom: 0.5rem;
        }
        .contents .table-of-contents ul {
            list-style: none;
            padding-left: 0;
        }
        .contents .table-of-contents li {
            margin: .4rem 0;
        }
        .contents .table-of-contents li.has-children {
            margin: 0.5rem 0;
        }
        .contents .table-of-contents .toc-toggle {
            cursor: pointer;
            user-select: none;
            display: inline-block;
            width: 1em;
            transition: transform 0.2s;
            font-size: 0.8em;
        }
        .contents .table-of-contents .toc-children {
            padding-left: 1.2rem;
            margin-top: 0.3rem;
        }
        .contents .table-of-contents .toc-children.collapsed {
            display: none;
        }
        .contents .table-of-contents .toc-children ul {
            padding-left: 0.5rem;
        }
        .contents .table-of-contents a {
            color: #475569;
            text-decoration: none;
            font-size: 0.9rem;
        }
        .contents .table-of-contents a:hover {
            text-decoration: underline;
            color: #3b82f6;
        }
        
        main.content { margin-top: 1rem; }
        
        h1, h2, h3, h4 {
            color: #0f172a;
            margin: 2.5rem 0 1rem;
            font-weight: 600;
        }
        
        h2 {
            font-size: 1.625rem;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 0.5rem;
            margin-top: 2.5rem;
        }
        
        h3 {
            font-size: 1.25rem;
            margin-top: 2rem;
        }
        
        h4 {
            font-size: 1.05rem;
        }
        
        p {
            margin: 1rem 0;
            line-height: 1.85;
            color: #334155;
        }
        
        ul, ol {
            margin: 1rem 0;
            padding-left: 1.75rem;
            color: #334155;
        }
        
        li {
            margin: 0.4rem 0;
        }
        
        blockquote {
            border-left: 3px solid #8b2635;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #5f6368;
            background: #f7f6f2;
            padding: 1rem 1rem 1rem 1.5rem;
            border-radius: 4px;
        }
        
        img, svg {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 2rem auto;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
        }
        
        svg {
            background: #fff;
            border: 1px solid #ddd;
        }
        
        pre {
            background: #f8fafc;
            padding: 1.25rem;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1.5rem 0;
            border: 1px solid #e2e8f0;
        }
        
        code {
            font-family: 'IBM Plex Mono', 'Courier New', monospace;
            font-size: 0.9em;
        }
        
        pre code {
            background: transparent;
            padding: 0;
            border-radius: 0;
        }
        
        :not(pre) > code {
            background: #f1f5f9;
            padding: .2rem .4rem;
            border-radius: 3px;
            color: #dc2626;
            font-size: 0.875em;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-size: 0.95rem;
        }
        
        th, td {
            padding: 0.75rem;
            text-align: left;
            border: 1px solid #e2e8f0;
        }
        
        th {
            background: #f8fafc;
            font-weight: 600;
            color: #0f172a;
        }
        
        tr:nth-child(even) {
            background: #f8fafc;
        }
        
        footer.foot {
            margin-top: 3rem;
            padding-top: 1rem;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: .9rem;
        }
        
        @media print {
            body { max-width: 100%; padding: 1in; }
            .contents { page-break-after: always; }
        }
    </style>
</head>
<body>
    <header class="title">
        <h1>${metadata.title || 'Technical Report'}</h1>
        <div class="meta">
            <div>${metadata.author || 'Author Name'}</div>
            ${metadata.organization ? `<div>${metadata.organization}</div>` : ''}
            <div>${metadata.created || new Date().toISOString().split('T')[0]} • v${metadata.version || '1.0.0'}</div>
        </div>
    </header>
    ${toc ? `<section class="contents">${toc}</section>` : ''}
    <main class="content">${content}</main>
    <footer class="foot">Technical documentation by ${metadata.author || 'Author'}</footer>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script>
        Prism.highlightAll();
        document.addEventListener('DOMContentLoaded', function() {
            const tocHeaders = document.querySelectorAll('.table-of-contents h2');
            tocHeaders.forEach(function(header) {
                header.addEventListener('click', function() {
                    const toc = this.closest('.table-of-contents');
                    if (toc) toc.classList.toggle('collapsed');
                });
            });
            
            const tocToggles = document.querySelectorAll('.toc-toggle');
            tocToggles.forEach(function(toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const targetId = this.getAttribute('data-target');
                    const targetDiv = document.getElementById(targetId);
                    if (targetDiv) {
                        targetDiv.classList.toggle('collapsed');
                        this.textContent = targetDiv.classList.contains('collapsed') ? '▶' : '▼';
                    }
                });
            });
        });
    </script>
</body>
</html>`;
        }
    },
    
    'minimal': {
        name: 'Minimal/Clean',
        generateHTML: function(content, metadata, toc) {
            return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base target="_parent">
    <title>${metadata.title || 'Document'}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
    <style>
        .math-block { margin: 1.5rem 0; overflow-x: auto; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: #24292e;
            background: #ffffff;
            max-width: 800px;
            margin: 0 auto;
            padding: 4rem 2rem;
        }
        
        h1, h2, h3, h4 {
            color: #24292e;
            margin: 2rem 0 1rem;
            font-weight: 600;
        }
        
        h1 {
            font-size: 2.5rem;
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3rem;
        }
        
        h2 {
            font-size: 2rem;
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3rem;
        }
        
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }
        
        p { margin: 1rem 0; }
        
        img, svg {
            max-width: ${metadata.image_size || '100%'};
            height: auto;
            display: block;
            margin: 1.5rem auto;
        }
        
        svg {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        ul, ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        li {
            margin: 0.5rem 0;
        }
        
        pre {
            background: #f6f8fa;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        code {
            font-family: 'SF Mono', 'Consolas', monospace;
            font-size: 0.9em;
            background: #f6f8fa;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
        }
        
        pre code {
            background: none;
            padding: 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }
        
        th, td {
            padding: 0.75rem;
            border: 1px solid #dfe2e5;
            text-align: left;
        }
        
        th {
            background: #f6f8fa;
            font-weight: 600;
        }
        
        blockquote {
            border-left: 4px solid #dfe2e5;
            padding-left: 1rem;
            margin: 1.5rem 0;
            color: #6a737d;
        }
        
        ul, ol { margin: 1rem 0; padding-left: 2rem; }
        li { margin: 0.25rem 0; }
        
        a {
            color: #0366d6;
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    ${content}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script>Prism.highlightAll();</script>
</body>
</html>`;
        }
    }
};

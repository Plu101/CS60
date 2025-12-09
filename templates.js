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
    <meta name="author" content="${metadata.author || 'Unknown Author'}">
    <meta name="description" content="${metadata.description || ''}">
    <meta name="keywords" content="${metadata.keywords || ''}">
    <meta name="created" content="${metadata.created || new Date().toISOString().split('T')[0]}">
    <meta name="last-modified" content="${metadata.modified || new Date().toISOString().split('T')[0]}">
    <meta name="version" content="${metadata.version || '1.0.0'}">
    <title>${metadata.title || 'Untitled Document'}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #1976d2;
            --bg-color: #ffffff;
            --text-color: #333333;
            --border-color: #e0e0e0;
            --sidebar-bg: #f8f9fa;
            --code-bg: #f5f5f5;
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
        
        .document-header {
            background: var(--sidebar-bg);
            border-bottom: 2px solid var(--primary-color);
            padding: 2rem;
            margin-bottom: 2rem;
        }
        
        .document-header table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .document-header th {
            text-align: left;
            padding: 0.5rem;
            background: var(--primary-color);
            color: white;
            font-weight: 600;
        }
        
        .document-header td {
            padding: 0.5rem;
            border: 1px solid var(--border-color);
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
        }
        
        .table-of-contents ul {
            list-style: none;
            padding-left: 0;
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
        
        img {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 1.5rem auto;
            border-radius: 4px;
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
    <div class="document-header">
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
    <script>Prism.highlightAll();</script>
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
    <title>${metadata.title || 'Project Documentation'}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <style>
        :root {
            --primary: #0ea5e9;
            --primary-dark: #0284c7;
            --bg: #ffffff;
            --text: #1e293b;
            --border: #e2e8f0;
            --sidebar-bg: #f8fafc;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: var(--text);
            background: var(--bg);
        }
        
        .project-header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }
        
        .project-header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }
        
        .project-meta {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
            font-size: 0.95rem;
            opacity: 0.95;
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
        }
        
        .table-of-contents ul {
            list-style: none;
            padding: 0;
        }
        
        .table-of-contents li {
            margin: 0.5rem 0;
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
        
        img {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 2rem auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        pre {
            background: #1e293b;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
        }
        
        code {
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.9em;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }
        
        th, td {
            padding: 0.75rem;
            border: 1px solid var(--border);
        }
        
        th {
            background: var(--sidebar-bg);
            font-weight: 600;
        }
        
        blockquote {
            border-left: 4px solid var(--primary);
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #64748b;
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
    <header class="project-header">
        <h1>${metadata.title || 'Project Documentation'}</h1>
        <div class="project-meta">
            <span>📝 ${metadata.author || 'Unknown Author'}</span>
            <span>📅 ${metadata.created || new Date().toISOString().split('T')[0]}</span>
            <span>🔖 v${metadata.version || '1.0.0'}</span>
        </div>
    </header>
    
    <div class="container">
        <aside class="sidebar">${toc}</aside>
        <main class="content">${content}</main>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script>Prism.highlightAll();</script>
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
    <title>${metadata.title || 'Academic Assignment'}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.9;
            color: #2d3748;
            background: #ffffff;
            max-width: 800px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .header h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #1a202c;
        }
        
        .header-info {
            font-size: 1rem;
            color: #4a5568;
            line-height: 1.6;
        }
        
        .header-info div {
            margin: 0.3rem 0;
        }
        
        h1, h2, h3, h4 {
            color: #1a202c;
            margin: 2rem 0 1rem;
        }
        
        h2 {
            font-size: 1.5rem;
            border-bottom: 1px solid #cbd5e0;
            padding-bottom: 0.5rem;
        }
        
        h3 {
            font-size: 1.25rem;
        }
        
        p {
            text-align: justify;
            margin: 1rem 0;
            text-indent: 2rem;
        }
        
        img {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 2rem auto;
        }
        
        pre {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        code {
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            background: #f7fafc;
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
            border: 1px solid #cbd5e0;
            text-align: left;
        }
        
        th {
            background: #f7fafc;
            font-weight: 600;
        }
        
        blockquote {
            border-left: 4px solid #4299e1;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #4a5568;
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
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 0.9rem;
            color: #718096;
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
    <div class="header">
        <h1>${metadata.title || 'Academic Assignment'}</h1>
        <div class="header-info">
            <div><strong>Student:</strong> ${metadata.author || metadata.student || 'Unknown'}</div>
            ${metadata.course ? `<div><strong>Course:</strong> ${metadata.course}</div>` : ''}
            ${metadata.instructor ? `<div><strong>Instructor:</strong> ${metadata.instructor}</div>` : ''}
            ${metadata.institution ? `<div><strong>Institution:</strong> ${metadata.institution}</div>` : ''}
            <div><strong>Date:</strong> ${metadata.created || new Date().toISOString().split('T')[0]}</div>
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
    <script>Prism.highlightAll();</script>
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
    <title>${metadata.title || 'Letter'}</title>
    <style>
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
        
        img {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 1rem auto;
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
    <title>${metadata.title || 'Technical Report'}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css" rel="stylesheet" />
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, sans-serif;
            line-height: 1.7;
            color: #1a1a1a;
            background: #ffffff;
        }
        
        .cover-page {
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 2rem;
        }
        
        .cover-page h1 {
            font-size: 3rem;
            margin-bottom: 2rem;
        }
        
        .cover-metadata {
            font-size: 1.2rem;
            margin: 0.5rem 0;
        }
        
        .main-container {
            display: grid;
            grid-template-columns: 280px 1fr;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .sidebar {
            background: #f5f5f5;
            padding: 2rem 1rem;
            border-right: 1px solid #ddd;
            position: sticky;
            top: 0;
            height: fit-content;
            max-height: 100vh;
            overflow-y: auto;
        }
        
        .table-of-contents h2 {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: #667eea;
        }
        
        .table-of-contents ul {
            list-style: none;
            padding: 0;
        }
        
        .table-of-contents li {
            margin: 0.5rem 0;
        }
        
        .table-of-contents a {
            color: #333;
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .table-of-contents a:hover {
            color: #667eea;
        }
        
        .content {
            padding: 3rem;
            max-width: 900px;
        }
        
        h1, h2, h3 {
            color: #1a1a1a;
            margin: 2rem 0 1rem;
        }
        
        h1 {
            font-size: 2.5rem;
            border-bottom: 3px solid #667eea;
            padding-bottom: 0.5rem;
        }
        
        h2 {
            font-size: 2rem;
            color: #667eea;
        }
        
        h3 {
            font-size: 1.5rem;
        }
        
        p {
            margin: 1rem 0;
        }
        
        img {
            max-width: ${metadata.image_size || '80%'};
            height: auto;
            display: block;
            margin: 2rem auto;
            border-radius: 4px;
        }
        
        pre {
            background: #282c34;
            padding: 1.5rem;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1.5rem 0;
        }
        
        code {
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.9em;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }
        
        th, td {
            padding: 0.75rem;
            border: 1px solid #ddd;
        }
        
        th {
            background: #f5f5f5;
            font-weight: 600;
        }
        
        blockquote {
            border-left: 4px solid #667eea;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #555;
        }
        
        ul, ol { margin: 1rem 0; padding-left: 2rem; }
        li { margin: 0.5rem 0; }
        
        @media print {
            .cover-page { page-break-after: always; }
            .sidebar { display: none; }
            .main-container { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="cover-page">
        <h1>${metadata.title || 'Technical Report'}</h1>
        <div class="cover-metadata">
            <div>${metadata.author || 'Author Name'}</div>
            ${metadata.organization ? `<div>${metadata.organization}</div>` : ''}
            <div>${metadata.created || new Date().toISOString().split('T')[0]}</div>
            <div>Version ${metadata.version || '1.0.0'}</div>
        </div>
    </div>
    
    <div class="main-container">
        <aside class="sidebar">${toc}</aside>
        <main class="content">${content}</main>
    </div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script>Prism.highlightAll();</script>
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
    <title>${metadata.title || 'Document'}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
    <style>
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
        
        img {
            max-width: ${metadata.image_size || '100%'};
            height: auto;
            display: block;
            margin: 1.5rem auto;
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

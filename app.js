// Main application logic
let currentMarkdownText = '';
let currentFileName = '';

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupDragAndDrop();
    initializeMermaid();
    setupModernUI();
});

function initializeApp() {
    console.log('Markdown Document Converter initialized');
    updateTemplate();
}

function setupEventListeners() {
    const fileInput = document.getElementById('fileInput');
    const documentType = document.getElementById('documentType');
    const imageSize = document.getElementById('imageSize');
    const imageSizeValue = document.getElementById('imageSizeValue');
    const showToc = document.getElementById('showToc');
    const isoDocType = document.getElementById('isoDocType');
    
    fileInput.addEventListener('change', handleFileSelect);
    imageSize.addEventListener('input', function() {
        imageSizeValue.textContent = this.value + '%';
    });
    
    showToc.addEventListener('change', function() {
        if (currentMarkdownText) {
            convertMarkdown();
        }
    });
    
    if (isoDocType) {
        isoDocType.addEventListener('change', function() {
            if (currentMarkdownText && documentType.value === 'iso-compliant') {
                convertMarkdown();
            }
        });
    }
    
    // Setup template card selection
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            templateCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            documentType.value = this.dataset.template;
            updateTemplate();
        });
    });
    
    // Set default selected card
    const defaultCard = document.querySelector('.template-card[data-template="academic-classic"]');
    if (defaultCard) {
        defaultCard.classList.add('selected');
    }
}

function setupDragAndDrop() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    
    // Click to upload
    uploadZone.addEventListener('click', function(e) {
        if (!e.target.closest('.btn-remove')) {
            fileInput.click();
        }
    });
    
    // Drag and drop
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadZone.classList.add('drag-over');
    });
    
    uploadZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadZone.classList.remove('drag-over');
    });
    
    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
                handleFile(file);
            } else {
                alert('Please upload a Markdown file (.md or .markdown)');
            }
        }
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

let uploadedFiles = {};

function handleFile(file) {
    currentFileName = file.name;
    const reader = new FileReader();
    
    reader.onload = function(e) {
        currentMarkdownText = e.target.result;
        displayFileInfo(file.name);
        enableButtons();
        
        // Detect file references
        detectFileReferences(currentMarkdownText);
        
        // Populate metadata form
        const documentType = document.getElementById('documentType').value;
        populateMetadataForm(documentType);
        
        convertMarkdown();
    };
    
    reader.onerror = function() {
        alert('Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
}

function displayFileInfo(fileName) {
    const fileInfo = document.getElementById('fileInfo');
    const fileNameElement = document.getElementById('fileName');
    
    fileNameElement.textContent = fileName;
    fileInfo.style.display = 'flex';
}

function clearFile() {
    currentMarkdownText = '';
    currentFileName = '';
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('fileInput').value = '';
    document.getElementById('previewContent').innerHTML = `
        <div class="placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h3>No document loaded</h3>
            <p>Upload a markdown file to see the preview</p>
        </div>
    `;
    disableButtons();
}

function enableButtons() {
    document.getElementById('convertBtn').disabled = false;
    document.getElementById('downloadHtmlBtn').disabled = false;
    document.getElementById('downloadPdfBtn').disabled = false;
    document.getElementById('printBtn').disabled = false;
}

function disableButtons() {
    document.getElementById('convertBtn').disabled = true;
    document.getElementById('downloadHtmlBtn').disabled = true;
    document.getElementById('downloadPdfBtn').disabled = true;
    document.getElementById('printBtn').disabled = true;
}

function updateTemplate() {
    const documentType = document.getElementById('documentType').value;
    const isoSettings = document.getElementById('isoSettings');
    
    if (documentType === 'iso-compliant') {
        isoSettings.style.display = 'block';
    } else {
        isoSettings.style.display = 'none';
    }
    
    if (currentMarkdownText) {
        convertMarkdown();
    }
}

function convertMarkdown() {
    if (!currentMarkdownText) {
        alert('Please upload a markdown file first');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        try {
            const documentType = document.getElementById('documentType').value;
            const imageSize = document.getElementById('imageSize').value;
            const showToc = document.getElementById('showToc').checked;
            const isoDocType = document.getElementById('isoDocType') ? document.getElementById('isoDocType').value : 'StRS';
            
            const options = {
                documentType: documentType,
                imageSize: imageSize + '%',
                showToc: showToc,
                isoDocType: isoDocType
            };
            
            // Count embedded images
            const dataUrlImages = (currentMarkdownText.match(/!\[([^\]]*)\]\(data:image/g) || []).length;
            if (dataUrlImages > 0) {
                console.log(`Converting with ${dataUrlImages} embedded image(s)`);
            }
            
            const result = converter.convert(currentMarkdownText, options);

            // Render full template inside an iframe so the preview matches export exactly
            const htmlContent = converter.getConvertedHTML();
            const iframe = document.createElement('iframe');
            iframe.setAttribute('title', 'Document Preview');
            iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox');
            iframe.srcdoc = htmlContent;

            const preview = document.getElementById('previewContent');
            preview.innerHTML = '';
            preview.appendChild(iframe);
            
            hideLoading();
            console.log('Conversion successful');
            
        } catch (error) {
            hideLoading();
            console.error('Conversion error:', error);
            alert('Error converting markdown: ' + error.message);
        }
    }, 100);
}

function downloadHTML() {
    if (!converter.getConvertedHTML()) {
        alert('Please convert the markdown first');
        return;
    }
    
    const htmlContent = converter.getConvertedHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName.replace(/\.md$/, '') + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function downloadPDF() {
    if (!converter.getConvertedHTML()) {
        alert('Please convert the markdown first');
        return;
    }
    
    try {
        const htmlContent = converter.getConvertedHTML();

        // Use an offscreen iframe so template <head> styles/scripts apply
        const pdfFrame = document.createElement('iframe');
        pdfFrame.style.position = 'absolute';
        pdfFrame.style.left = '-10000px';
        pdfFrame.style.top = '0';
        pdfFrame.style.width = '210mm';
        pdfFrame.style.height = '297mm';
        pdfFrame.setAttribute('sandbox', 'allow-same-origin allow-scripts');
        document.body.appendChild(pdfFrame);

        await new Promise((resolve, reject) => {
            pdfFrame.onload = resolve;
            pdfFrame.onerror = reject;
            pdfFrame.srcdoc = htmlContent;
        });

        const opt = {
            margin: [10, 10, 10, 10],
            filename: currentFileName.replace(/\.md$/, '') + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        await html2pdf().set(opt).from(pdfFrame.contentDocument.documentElement).save();

        document.body.removeChild(pdfFrame);
        
    } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF: ' + error.message);
    }
}

function printPreview() {
    if (!converter.getConvertedHTML()) {
        alert('Please convert the markdown first');
        return;
    }
    
    const htmlContent = converter.getConvertedHTML();
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = function() { printWindow.print(); };
}

function toggleFullscreen() {
    const previewContent = document.getElementById('previewContent');
    previewContent.classList.toggle('fullscreen');
}

function initializeMermaid() {
    if (window.mermaid) {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
        });
    }
}

function setupModernUI() {
    // Guide button
    const guideBtn = document.getElementById('guideBtn');
    if (guideBtn) {
        guideBtn.addEventListener('click', toggleGuide);
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            html.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
            localStorage.setItem('theme', currentTheme === 'dark' ? 'light' : 'dark');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }
    
    // Template selection with new UI
    const templateItems = document.querySelectorAll('.template-item');
    templateItems.forEach(item => {
        item.addEventListener('click', function() {
            templateItems.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('documentType').value = this.dataset.template;
            updateTemplate();
        });
    });
    
    // Set default selected
    const defaultItem = document.querySelector('.template-item[data-template="academic-classic"]');
    if (defaultItem) {
        defaultItem.classList.add('selected');
    }
    
    // Section toggles  
    document.querySelectorAll('.section-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
    
    // Animation on scroll
    const animateElements = document.querySelectorAll('.animate-in');
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(el => observer.observe(el));
    }
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('collapsed');
    }
}

function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function toggleGuide() {
    const guidePanel = document.getElementById('guidePanel');
    guidePanel.classList.toggle('open');
}

function populateMetadataForm(templateType) {
    const metadataForm = document.getElementById('metadataForm');
    
    // Define fields based on template
    const fieldsByTemplate = {
        'academic-classic': [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'author', label: 'Author', type: 'text', required: true },
            { name: 'institution', label: 'Institution', type: 'text', required: false },
            { name: 'created', label: 'Date', type: 'date', required: false },
            { name: 'version', label: 'Version', type: 'text', required: false }
        ],
        'technical': [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'author', label: 'Author', type: 'text', required: true },
            { name: 'organization', label: 'Organization', type: 'text', required: false },
            { name: 'created', label: 'Date', type: 'date', required: false },
            { name: 'version', label: 'Version', type: 'text', required: false }
        ],
        'letter': [
            { name: 'sender_name', label: 'Sender Name', type: 'text', required: true },
            { name: 'sender_address', label: 'Sender Address', type: 'text', required: false },
            { name: 'recipient_name', label: 'Recipient Name', type: 'text', required: true },
            { name: 'recipient_address', label: 'Recipient Address', type: 'text', required: false },
            { name: 'date', label: 'Date', type: 'date', required: false }
        ],
        'default': [
            { name: 'title', label: 'Title', type: 'text', required: true },
            { name: 'author', label: 'Author', type: 'text', required: true },
            { name: 'date', label: 'Date', type: 'date', required: false },
            { name: 'version', label: 'Version', type: 'text', required: false }
        ]
    };
    
    const fields = fieldsByTemplate[templateType] || fieldsByTemplate['default'];
    
    metadataForm.innerHTML = fields.map(field => `
        <div class="form-group">
            <label for="meta_${field.name}">${field.label}${field.required ? ' *' : ''}</label>
            <input type="${field.type}" id="meta_${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
        </div>
    `).join('');
}

function applyMetadata() {
    const form = document.getElementById('metadataForm');
    const inputs = form.querySelectorAll('input');
    const metadata = {};
    
    inputs.forEach(input => {
        if (input.value) {
            metadata[input.name] = input.value;
        }
    });
    
    // Generate YAML frontmatter
    const yamlLines = ['---'];
    for (const [key, value] of Object.entries(metadata)) {
        yamlLines.push(`${key}: ${value}`);
    }
    yamlLines.push('---', '');
    
    // Prepend to markdown
    currentMarkdownText = yamlLines.join('\n') + currentMarkdownText;
    
    convertMarkdown();
}

function detectFileReferences(markdownText) {
    // Detect image references
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const references = [];
    let match;
    
    while ((match = imageRegex.exec(markdownText)) !== null) {
        const path = match[2];
        // Check if it's a relative path (not http/https/data:)
        if (!path.startsWith('http://') && !path.startsWith('https://') && !path.startsWith('data:')) {
            references.push({ type: 'image', path: path, alt: match[1] });
        }
    }
    
    if (references.length > 0) {
        showFileReferencesPanel(references);
    } else {
        // Check if we already have embedded images
        const embeddedImages = (markdownText.match(/!\[([^\]]*)\]\(data:image/g) || []).length;
        if (embeddedImages > 0) {
            console.log(`Document has ${embeddedImages} embedded image(s)`);
        }
    }
}

function showFileReferencesPanel(references) {
    const panel = document.getElementById('fileRefsPanel');
    const refsList = document.getElementById('refsList');
    
    refsList.innerHTML = references.map(ref => `
        <div class="ref-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>${ref.path}</span>
        </div>
    `).join('');
    
    panel.style.display = 'block';
    
    // Setup file upload handler
    const refFileInput = document.getElementById('refFileInput');
    refFileInput.onchange = function(e) {
        handleReferenceFiles(e.target.files, references);
    };
}

function closeFileRefs() {
    document.getElementById('fileRefsPanel').style.display = 'none';
}

function handleReferenceFiles(files, references) {
    let filesProcessed = 0;
    const totalFiles = files.length;
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            uploadedFiles[file.name] = dataUrl;
            
            // Replace references in markdown with data URLs
            references.forEach(ref => {
                const fileName = ref.path.split('/').pop().split('?')[0]; // Remove query strings
                const fileNameLower = file.name.toLowerCase();
                const refFileNameLower = fileName.toLowerCase();
                
                if (fileNameLower === refFileNameLower) {
                    // Escape special regex characters in the path
                    const escapedPath = ref.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`!\\[([^\\]]*)\\]\\(${escapedPath}\\)`, 'g');
                    currentMarkdownText = currentMarkdownText.replace(regex, `![$1](${dataUrl})`);
                    
                    console.log(`Embedded image: ${file.name}`);
                }
            });
            
            filesProcessed++;
            
            // Update preview after all files are processed
            if (filesProcessed === totalFiles) {
                convertMarkdown();
                console.log(`Successfully embedded ${filesProcessed} image(s)`);
            }
        };
        reader.readAsDataURL(file);
    });
    
    closeFileRefs();
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Main application logic
let currentMarkdownText = '';
let currentFileName = '';

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupDragAndDrop();
    initializeMermaid();
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
    documentType.addEventListener('change', updateTemplate);
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
}

function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
        
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
    
    uploadArea.addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    currentFileName = file.name;
    const reader = new FileReader();
    
    reader.onload = function(e) {
        currentMarkdownText = e.target.result;
        displayFileInfo(file.name);
        enableButtons();
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
    
    try {
        const documentType = document.getElementById('documentType').value;
        const imageSize = document.getElementById('imageSize').value;
        const showToc = document.getElementById('showToc').checked;
        const isoDocType = document.getElementById('isoDocType').value;
        
        const options = {
            documentType: documentType,
            imageSize: imageSize + '%',
            showToc: showToc,
            isoDocType: isoDocType
        };
        
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
        
        console.log('Conversion successful');
        
    } catch (error) {
        console.error('Conversion error:', error);
        alert('Error converting markdown: ' + error.message);
    }
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

        await html2pdf().set(opt).from(pdfFrame.contentDocument.body).save();

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

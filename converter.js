// Core markdown converter logic
// Simple, safe HTML escape for fallback highlighting
function escapeHtml(s) {
    return (s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

class MarkdownConverter {
    constructor() {
        this.md = null;
        this.currentMetadata = {};
        this.currentContent = '';
        this.convertedHTML = '';
        this.initializeMarkdown();
    }
    
    initializeMarkdown() {
        this.md = window.markdownit({
            html: true,
            linkify: true,
            typographer: true,
            breaks: false,
            highlight: function (str, lang) {
                if (lang && window.Prism && window.Prism.languages[lang]) {
                    try {
                        return '<pre class="language-' + lang + '"><code class="language-' + lang + '">' +
                               window.Prism.highlight(str, window.Prism.languages[lang], lang) +
                               '</code></pre>';
                    } catch (e) {
                        console.error('Prism highlighting error:', e);
                    }
                }
                return '<pre class="language-' + (lang || 'text') + '"><code>' + 
                       escapeHtml(str) +
                       '</code></pre>';
            }
        });
        
        // Add math inline rule
        this.md.inline.ruler.before('escape', 'math_inline', function(state, silent) {
            if (state.src[state.pos] !== '$') return false;
            
            const start = state.pos + 1;
            let pos = start;
            
            // Find closing $
            while (pos < state.src.length && state.src[pos] !== '$') {
                if (state.src[pos] === '\\') pos++; // Skip escaped characters
                pos++;
            }
            
            if (pos >= state.src.length) return false;
            if (pos === start) return false; // Empty math
            
            const content = state.src.slice(start, pos);
            
            if (!silent) {
                const token = state.push('math_inline', 'math', 0);
                token.content = content;
                token.markup = '$';
            }
            
            state.pos = pos + 1;
            return true;
        });
        
        // Add math block rule
        this.md.block.ruler.before('fence', 'math_block', function(state, startLine, endLine, silent) {
            let pos = state.bMarks[startLine] + state.tShift[startLine];
            let max = state.eMarks[startLine];
            
            if (pos + 2 > max) return false;
            if (state.src.slice(pos, pos + 2) !== '$$') return false;
            
            pos += 2;
            let firstLine = state.src.slice(pos, max).trim();
            
            // Check if it's a single-line math block
            if (firstLine.endsWith('$$')) {
                const content = firstLine.slice(0, -2).trim();
                if (!silent) {
                    const token = state.push('math_block', 'math', 0);
                    token.content = content;
                    token.block = true;
                    token.markup = '$$';
                }
                state.line = startLine + 1;
                return true;
            }
            
            // Multi-line math block
            let nextLine = startLine;
            const contentLines = [firstLine];
            
            // Find closing $$
            for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
                pos = state.bMarks[nextLine] + state.tShift[nextLine];
                max = state.eMarks[nextLine];
                const line = state.src.slice(pos, max).trim();
                
                if (line === '$$') {
                    break;
                }
                
                contentLines.push(state.src.slice(pos, max));
            }
            
            if (nextLine >= endLine) return false; // No closing found
            
            const content = contentLines.join('\n').trim();
            
            if (!silent) {
                const token = state.push('math_block', 'math', 0);
                token.content = content;
                token.block = true;
                token.markup = '$$';
            }
            
            state.line = nextLine + 1;
            return true;
        });
        
        // Render inline math
        this.md.renderer.rules.math_inline = function(tokens, idx) {
            try {
                return window.katex.renderToString(tokens[idx].content, {
                    throwOnError: false,
                    displayMode: false
                });
            } catch (e) {
                return '<span style="color: red;">Math Error: ' + escapeHtml(e.message) + '</span>';
            }
        };
        
        // Render block math
        this.md.renderer.rules.math_block = function(tokens, idx) {
            try {
                return '<div class="math-block">' + window.katex.renderToString(tokens[idx].content, {
                    throwOnError: false,
                    displayMode: true
                }) + '</div>';
            } catch (e) {
                return '<div style="color: red;">Math Error: ' + escapeHtml(e.message) + '</div>';
            }
        };
        
        markdownItAnchor.install(this.md);
        markdownItToc.install(this.md);
    }
    
    extractFrontmatter(content) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (match) {
            try {
                const metadata = jsyaml.load(match[1]);
                const markdownContent = match[2];
                return { metadata, content: markdownContent };
            } catch (e) {
                console.error('YAML parsing error:', e);
                return { metadata: {}, content: content };
            }
        }
        
        return { metadata: {}, content: content };
    }
    
    processImages(content, imageSize) {
        const imageSizePercent = imageSize || '80%';
        return content;
    }
    
    convert(markdownText, options = {}) {
        const { metadata, content } = this.extractFrontmatter(markdownText);
        
        this.currentMetadata = {
            ...metadata,
            image_size: options.imageSize || metadata.image_size || '80%'
        };
        
        if (options.isoDocType && options.documentType === 'iso-compliant') {
            this.currentMetadata.document_type = options.isoDocType;
            this.currentMetadata.iso_doc_type = options.isoDocType;
        }
        
        this.currentContent = this.processImages(content, this.currentMetadata.image_size);
        
        const env = { headings: [] };
        const htmlContent = this.md.render(this.currentContent, env);
        
        const toc = options.showToc ? generateTOC(env.headings) : '';
        
        const templateType = options.documentType || 'iso-compliant';
        const template = templates[templateType];
        
        if (!template) {
            throw new Error(`Template '${templateType}' not found`);
        }
        
        this.convertedHTML = template.generateHTML(htmlContent, this.currentMetadata, toc);
        
        return {
            html: this.convertedHTML,
            metadata: this.currentMetadata,
            preview: this.generatePreview(htmlContent, toc, templateType)
        };
    }
    
    generatePreview(content, toc, templateType) {
        const metadata = this.currentMetadata;
        
        let previewHTML = '<div class="preview-document">';
        
        if (templateType === 'iso-compliant') {
            previewHTML += `
                <div class="preview-header">
                    <h1>${metadata.title || 'Untitled Document'}</h1>
                    <div class="preview-meta">
                        <span><strong>Type:</strong> ${metadata.document_type || 'StRS'}</span>
                        <span><strong>Author:</strong> ${metadata.author || 'Unknown'}</span>
                        <span><strong>Version:</strong> ${metadata.version || '1.0.0'}</span>
                        <span><strong>Date:</strong> ${metadata.created || new Date().toISOString().split('T')[0]}</span>
                    </div>
                </div>
            `;
        } else if (templateType === 'project') {
            previewHTML += `
                <div class="preview-header project-style">
                    <h1>${metadata.title || 'Project Documentation'}</h1>
                    <div class="preview-meta">
                        <span>📝 ${metadata.author || 'Unknown'}</span>
                        <span>📅 ${metadata.created || new Date().toISOString().split('T')[0]}</span>
                        <span>🔖 v${metadata.version || '1.0.0'}</span>
                    </div>
                </div>
            `;
        } else if (templateType === 'homework') {
            previewHTML += `
                <div class="preview-header academic-style">
                    <h1>${metadata.title || 'Academic Assignment'}</h1>
                    <div class="preview-meta">
                        <div><strong>Student:</strong> ${metadata.author || metadata.student || 'Unknown'}</div>
                        ${metadata.course ? `<div><strong>Course:</strong> ${metadata.course}</div>` : ''}
                        ${metadata.instructor ? `<div><strong>Instructor:</strong> ${metadata.instructor}</div>` : ''}
                    </div>
                </div>
            `;
        } else if (templateType === 'letter') {
            previewHTML += `
                <div class="preview-header letter-style">
                    <div class="letterhead">
                        ${metadata.sender_name ? `<div><strong>${metadata.sender_name}</strong></div>` : ''}
                        ${metadata.sender_address ? `<div>${metadata.sender_address}</div>` : ''}
                    </div>
                    <div class="letter-date">${metadata.date || metadata.created || new Date().toLocaleDateString()}</div>
                </div>
            `;
        }
        
        if (toc && templateType !== 'letter' && templateType !== 'minimal') {
            previewHTML += `
                <div class="preview-layout">
                    <aside class="preview-toc">${toc}</aside>
                    <div class="preview-content">${content}</div>
                </div>
            `;
        } else {
            previewHTML += `<div class="preview-content">${content}</div>`;
        }
        
        previewHTML += '</div>';
        
        return previewHTML;
    }
    
    getConvertedHTML() {
        return this.convertedHTML;
    }
    
    getMetadata() {
        return this.currentMetadata;
    }
}

const converter = new MarkdownConverter();

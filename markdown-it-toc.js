// Markdown-it TOC plugin (simplified)
window.markdownItToc = {
    install: function(md) {
        md.core.ruler.push('toc', function(state) {
            const tokens = state.tokens;
            let tocTokens = [];
            let headings = [];
            
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].type === 'heading_open') {
                    const level = parseInt(tokens[i].tag.substring(1));
                    const content = tokens[i + 1].content;
                    const id = content.toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                    
                    headings.push({
                        level: level,
                        content: content,
                        id: id
                    });
                }
            }
            
            state.env.headings = headings;
        });
    }
};

function generateTOC(headings) {
    if (!headings || headings.length === 0) return '';
    
    let toc = '<nav class="table-of-contents"><h2>Table of Contents</h2><ul>';
    let currentLevel = 0;
    
    headings.forEach(heading => {
        if (heading.level > currentLevel) {
            for (let i = currentLevel; i < heading.level; i++) {
                toc += '<ul>';
            }
        } else if (heading.level < currentLevel) {
            for (let i = heading.level; i < currentLevel; i++) {
                toc += '</ul>';
            }
        }
        
        toc += `<li><a href="#${heading.id}">${heading.content}</a></li>`;
        currentLevel = heading.level;
    });
    
    for (let i = 0; i < currentLevel; i++) {
        toc += '</ul>';
    }
    
    toc += '</nav>';
    return toc;
}

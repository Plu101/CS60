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
    
    let toc = '<nav class="table-of-contents"><h2>Table of Contents</h2>';
    
    function buildNestedTOC(items, startIndex, parentLevel) {
        let html = '<ul>';
        let i = startIndex;
        
        while (i < items.length) {
            const item = items[i];
            
            if (item.level < parentLevel) {
                break;
            }
            
            if (item.level === parentLevel) {
                let hasChildren = (i + 1 < items.length && items[i + 1].level > item.level);
                
                if (hasChildren) {
                    html += `<li class="has-children"><span class="toc-toggle" data-target="toc-item-${i}">▶</span> <a href="#${item.id}">${item.content}</a>`;
                    const childResult = buildNestedTOC(items, i + 1, item.level + 1);
                    html += `<div class="toc-children collapsed" id="toc-item-${i}">${childResult.html}</div></li>`;
                    i = childResult.nextIndex;
                } else {
                    html += `<li><a href="#${item.id}">${item.content}</a></li>`;
                    i++;
                }
            } else {
                break;
            }
        }
        
        html += '</ul>';
        return { html: html, nextIndex: i };
    }
    
    const result = buildNestedTOC(headings, 0, headings[0]?.level || 1);
    toc += result.html + '</nav>';
    return toc;
}

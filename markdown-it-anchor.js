// Markdown-it anchor plugin (simplified)
window.markdownItAnchor = {
    install: function(md) {
        const originalRender = md.renderer.rules.heading_open;
        md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
            const token = tokens[idx];
            const nextToken = tokens[idx + 1];
            
            if (nextToken && nextToken.type === 'inline') {
                const content = nextToken.content;
                const id = content.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
                
                token.attrSet('id', id);
            }
            
            return originalRender ? originalRender(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);
        };
    }
};

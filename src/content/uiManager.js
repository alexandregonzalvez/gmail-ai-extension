class UIManager {
    constructor() {
        this.styles = {
            container: {
                padding: '10px',
                margin: '10px 0',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dadce0',
                borderRadius: '4px',
                fontSize: '14px'
            },
            header: {
                color: '#666',
                marginBottom: '8px',
                fontWeight: '500'
            },
            content: {
                lineHeight: '1.4'
            }
        };
    }

    async displayAnalysis(emailElement, analysis) {
        const container = this.createAnalysisContainer(analysis);
        const emailContent = emailElement.querySelector(CONFIG.UI.EMAIL_CONTENT_SELECTOR);
        
        if (emailContent && emailContent.parentNode) {
            emailContent.parentNode.insertBefore(container, emailContent.nextSibling);
            this.animateEntry(container);
        }
    }

    createAnalysisContainer(analysis) {
        const container = document.createElement('div');
        Object.assign(container.style, this.styles.container);
        
        const header = document.createElement('div');
        Object.assign(header.style, this.styles.header);
        header.textContent = 'AI Analysis';
        
        const content = document.createElement('div');
        Object.assign(content.style, this.styles.content);
        content.textContent = analysis.choices[0].message.content;
        
        container.appendChild(header);
        container.appendChild(content);
        return container;
    }

    animateEntry(element) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease-in-out';
        
        requestAnimationFrame(() => {
            element.style.opacity = '1';
        });
    }
}

console.log('Main script loading...');

// Assurez-vous que `gmailAIAssistant` est défini dès le départ
if (!window.gmailAIAssistant) {
    window.gmailAIAssistant = {
        processor: null, // Pour l'instance EmailProcessor
        test: {}, // Namespace pour les fonctions de test
    };
}

// Écouter les événements `newEmail` pour traiter les e-mails
document.addEventListener('newEmail', async (e) => {
    console.log('New email detected');
    const emailElement = e.detail.emailElement;

    if (!window.gmailAIAssistant.processor) {
        console.error('EmailProcessor is not initialized.');
        return;
    }

    if (emailElement) {
        try {
            console.log('Processing new email element...');
            await window.gmailAIAssistant.processor.processEmail(
                emailElement,
                emailElement.getAttribute('data-legacy-message-id')
            );
        } catch (error) {
            console.error('Error processing email:', error);
        }
    }
});

// Fonctions de test intégrées dans `gmailAIAssistant.test`
window.gmailAIAssistant.test = {
    insertTestEmail() {
        console.log('Attempting to insert test email...');
        const testEmail = document.createElement('div');
        testEmail.className = 'zA zE';
        testEmail.innerHTML = `
            <div class="a3s aiL">
                <p>Test Email Content</p>
                <p>Injected on ${new Date().toISOString()}</p>
            </div>
        `;
        const container = document.querySelector('.AO');
        if (!container) {
            console.error('Email container not found. Test email not inserted.');
            return;
        }
        container.appendChild(testEmail);
        console.log('Test email inserted successfully.');
    },

    checkSetup() {
        console.log('Checking setup...');
        console.log({
            processorInitialized: !!window.gmailAIAssistant.processor,
            gmailReady: !!document.querySelector('.zA'),
        });
    },
};

// Initialisation du `EmailProcessor`
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded');
    try {
        const EmailProcessor = (await import('./emailProcessor.js')).EmailProcessor;
        const processor = new EmailProcessor();

        // Initialisez le processeur
        await processor.initialize();
        console.log('Processor initialized successfully.');

        // Exposez l'instance globalement
        window.gmailAIAssistant.processor = processor;
    } catch (error) {
        console.error('Error initializing EmailProcessor:', error);
    }
});

console.log('Main script loaded.');

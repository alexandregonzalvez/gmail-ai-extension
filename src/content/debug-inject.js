// Expose the `testGmailAI` function globally
window.testGmailAI = function () {
    console.log('Triggering test email injection...');
    document.dispatchEvent(new CustomEvent('debugCommand', {
        detail: { command: 'injectTestEmail' }
    }));
};

console.log('Debug script loading...');

// Inject `debug-inject.js` into the Gmail page
const injectScript = document.createElement('script');
injectScript.src = chrome.runtime.getURL('src/content/debug-inject.js');
injectScript.onload = () => {
    console.log('debug-inject.js loaded');
};
(document.head || document.documentElement).appendChild(injectScript);

// Listen for debug commands sent via events
document.addEventListener('debugCommand', (e) => {
    if (e.detail.command === 'injectTestEmail') {
        console.log('Debug command received: injectTestEmail');
        injectTestEmail();
    }
});

// Inject a test email into the Gmail interface
function injectTestEmail() {
    console.log('Attempting to inject test email...');
    const container = document.querySelector('.AO'); // Gmail's email container
    if (!container) {
        console.error('Email container (.AO) not found');
        return;
    }

    const emailDiv = document.createElement('div');
    emailDiv.className = 'zA zE'; // Classes for unread emails in Gmail
    emailDiv.setAttribute('data-legacy-message-id', 'test-' + Date.now());
    emailDiv.innerHTML = `
        <div class="a3s aiL">
            <p>Test Email Content</p>
            <p>Injected on ${new Date().toISOString()}</p>
        </div>
    `;

    // Insert test email at the top of the container
    container.insertBefore(emailDiv, container.firstChild);
    console.log('Test email injected successfully.');

    // Dispatch an event to notify listeners (e.g., MutationObserver)
    const event = new CustomEvent('newEmail', { detail: { emailElement: emailDiv } });
    document.dispatchEvent(event);
    console.log('Custom event "newEmail" dispatched.');
}

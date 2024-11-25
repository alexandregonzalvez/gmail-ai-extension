import CONFIG from '../utils/constants.js';
import { Logger } from '../utils/logger.js';
import { APIService } from '../utils/api.js';
import { SpamDetector } from './spamDetector.js';
import { UIManager } from './uiManager.js';

export class EmailProcessor {
    constructor() {
        this.apiService = new APIService();
        this.spamDetector = new SpamDetector();
        this.uiManager = new UIManager();
        this.processedEmails = new Set();
    }

    async initialize() {
        Logger.debug('Initializing EmailProcessor...');
        await this.apiService.initialize();
        this.setupObserver();
        Logger.debug('EmailProcessor initialized successfully.');
        // Expose the processor globally for debugging
        window.gmailAIAssistant.processor = this;
    }

    setupObserver() {
        Logger.debug('Setting up MutationObserver...');
        const observer = new MutationObserver((mutations) => {
            Logger.debug('MutationObserver triggered.', mutations);
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    Logger.debug('New nodes detected. Checking for emails...');
                    this.checkForNewEmails();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        Logger.debug('MutationObserver is now observing Gmail DOM.');
    }

    async checkForNewEmails() {
        Logger.debug('Checking for new unread emails...');
        const unreadEmails = document.querySelectorAll(CONFIG.UI.UNREAD_EMAIL_SELECTOR);
        Logger.debug(`Found ${unreadEmails.length} unread email(s).`);

        for (const email of unreadEmails) {
            const emailId = email.getAttribute('data-legacy-message-id');
            if (!emailId) {
                Logger.error('Email does not have a valid data-legacy-message-id.');
                continue;
            }

            if (!this.processedEmails.has(emailId) && !email.hasAttribute(CONFIG.UI.PROCESSED_ATTRIBUTE)) {
                Logger.debug(`Processing email with ID: ${emailId}`);
                await this.processEmail(email, emailId);
            } else {
                Logger.debug(`Email with ID: ${emailId} has already been processed.`);
            }
        }
    }

    async processEmail(emailElement, emailId) {
        try {
            Logger.debug(`Extracting content for email ID: ${emailId}`);
            const emailContent = await this.extractEmailContent(emailElement);
            if (!emailContent) {
                Logger.error(`No content found for email ID: ${emailId}`);
                return;
            }

            Logger.debug(`Analyzing email content for email ID: ${emailId}`);
            if (await this.spamDetector.isSpam(emailContent)) {
                Logger.debug(`Email ID: ${emailId} detected as spam.`);
                return;
            }

            const analysis = await this.apiService.sendToOpenAI(emailContent);
            Logger.debug(`Analysis result for email ID: ${emailId}`, analysis);

            await this.uiManager.displayAnalysis(emailElement, analysis);

            this.processedEmails.add(emailId);
            emailElement.setAttribute(CONFIG.UI.PROCESSED_ATTRIBUTE, 'true');
            Logger.debug(`Email ID: ${emailId} processed successfully.`);
        } catch (error) {
            Logger.error(`Error processing email ID: ${emailId}`, error);
        }
    }

    async extractEmailContent(emailElement) {
        try {
            await this.waitForEmailContent(emailElement);
            const contentElement = emailElement.querySelector(CONFIG.UI.EMAIL_CONTENT_SELECTOR);
            if (!contentElement) {
                Logger.error('Email content element not found.');
                return null;
            }
            Logger.debug('Email content successfully extracted.');
            return contentElement.innerText.trim();
        } catch (error) {
            Logger.error('Error extracting email content.', error);
            return null;
        }
    }

    waitForEmailContent(emailElement) {
        return new Promise((resolve) => {
            const checkContent = () => {
                const content = emailElement.querySelector(CONFIG.UI.EMAIL_CONTENT_SELECTOR);
                if (content) {
                    resolve();
                } else {
                    setTimeout(checkContent, 100);
                }
            };
            checkContent();
        });
    }
}

// Initialize and expose EmailProcessor globally
Logger.debug('Creating EmailProcessor instance...');
const emailProcessor = new EmailProcessor();
emailProcessor.initialize().catch((error) => {
    Logger.error('Failed to initialize EmailProcessor.', error);
});

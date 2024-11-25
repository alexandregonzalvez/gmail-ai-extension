const CONFIG = {
    API: {
        OPENAI_URL: 'https://api.openai.com/v1/chat/completions',
        DEFAULT_MODEL: 'gpt-3.5-turbo',
        MAX_TOKENS: 150
    },
    UI: {
        UNREAD_EMAIL_SELECTOR: '.zA.zE',
        EMAIL_CONTENT_SELECTOR: '.a3s.aiL',
        PROCESSED_ATTRIBUTE: 'data-ai-processed'
    },
    STORAGE_KEYS: {
        API_KEY: 'apiKey',
        SETTINGS: 'settings',
        DEBUG_MODE: 'ENABLE_DEBUG_MODE'
    }
};

export default CONFIG;

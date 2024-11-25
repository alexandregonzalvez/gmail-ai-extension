class APIService {
    constructor() {
        this.apiKey = null;
    }

    async initialize() {
        const result = await chrome.storage.sync.get([CONFIG.STORAGE_KEYS.API_KEY]);
        this.apiKey = result[CONFIG.STORAGE_KEYS.API_KEY];
    }

    async sendToOpenAI(content) {
        try {
            const response = await fetch(CONFIG.API.OPENAI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.API.DEFAULT_MODEL,
                    messages: [{
                        role: 'system',
                        content: 'You are an email analysis assistant. Provide a brief summary and identify any important action items or deadlines.'
                    }, {
                        role: 'user',
                        content: content
                    }],
                    max_tokens: CONFIG.API.MAX_TOKENS
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            Logger.error('API Error:', error);
            throw error;
        }
    }
}
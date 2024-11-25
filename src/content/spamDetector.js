class SpamDetector {
    constructor() {
        this.spamPatterns = {
            newsletter: /unsubscribe|newsletter|subscription|marketing/i,
            promotional: /discount|sale|offer|%\s*off|limited time/i,
            bulk: /bulk|mass email|sent to multiple recipients/i,
            suspicious: /urgent|winner|lottery|inheritance|prince/i
        };
        
        this.whitelist = new Set([
            /* Domains ou emails à ne jamais marquer comme spam */
        ]);
    }

    async isSpam(content) {
        const sender = this.extractSender(content);
        if (this.whitelist.has(sender)) {
            return false;
        }

        let spamScore = 0;
        for (const [type, pattern] of Object.entries(this.spamPatterns)) {
            if (pattern.test(content)) {
                spamScore += 1;
            }
        }

        if (this.hasExcessiveCapitalization(content)) spamScore += 1;
        if (this.hasMultipleExclamationMarks(content)) spamScore += 1;
        if (this.hasSuspiciousLinks(content)) spamScore += 2;

        return spamScore >= 3;
    }

    extractSender(content) {
        const fromMatch = content.match(/From:\s*([^\n]+)/);
        return fromMatch ? fromMatch[1].trim() : '';
    }

    hasExcessiveCapitalization(content) {
        const words = content.split(/\s+/);
        const uppercaseWords = words.filter(word => 
            word.length > 3 && word === word.toUpperCase()
        );
        return uppercaseWords.length / words.length > 0.3;
    }

    hasMultipleExclamationMarks(content) {
        return /!!+/.test(content);
    }

    hasSuspiciousLinks(content) {
        const suspiciousLinkPatterns = [
            /bit\.ly/i,
            /tinyurl/i,
            /\.(ru|cn|tk|top)(\W|$)/i
        ];
        return suspiciousLinkPatterns.some(pattern => pattern.test(content));
    }
}
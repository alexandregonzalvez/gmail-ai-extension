import CONFIG from './constants.js';
import { StorageService } from './storage.js';

export class Logger {
    static async debug(message, ...args) {
        // Fetch the debug flag from Chrome storage
        const debugFlag = await StorageService.get(CONFIG.STORAGE_KEYS.DEBUG_MODE);
        const isDebugMode = debugFlag ?? false; // Default to false if undefined

        if (isDebugMode) {
            console.debug(`[Gmail AI Assistant] ${message}`, ...args);
        }
    }

    static error(message, error) {
        console.error(`[Gmail AI Assistant] Error: ${message}`, error);
    }
}

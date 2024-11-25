import { StorageService } from '../utils/storage.js';
import { Logger } from '../utils/logger.js';

class BackgroundService {
  constructor() {
    this.initialize();
  }

  async initialize() {
    try {
      this.setupMessageListeners();
      this.setupInstallHandler();
      Logger.debug('Background service initialized');
    } catch (error) {
      Logger.error('Failed to initialize background service', error);
    }
  }

  setupMessageListeners() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.type) {
        case 'UPDATE_STATS':
          this.updateStats(request.data);
          break;
        case 'GET_SETTINGS':
          this.getSettings().then(sendResponse);
          return true;
        default:
          Logger.debug('Unknown message type:', request.type);
      }
    });
  }

  setupInstallHandler() {
    chrome.runtime.onInstalled.addListener(async (details) => {
      if (details.reason === 'install') {
        await this.initializeDefaultSettings();
      }
    });
  }

  async initializeDefaultSettings() {
    const defaultSettings = {
      autoProcess: true,
      skipSpam: true,
      processedCount: 0,
      skippedCount: 0
    };

    await StorageService.set('settings', defaultSettings);
    Logger.debug('Default settings initialized');
  }

  async updateStats(data) {
    try {
      const currentStats = await StorageService.get('stats') || {
        processedCount: 0,
        skippedCount: 0
      };

      const updatedStats = {
        processedCount: currentStats.processedCount + (data.processed || 0),
        skippedCount: currentStats.skippedCount + (data.skipped || 0)
      };

      await StorageService.set('stats', updatedStats);
      Logger.debug('Stats updated:', updatedStats);
    } catch (error) {
      Logger.error('Failed to update stats', error);
    }
  }

  async getSettings() {
    try {
      return await StorageService.get('settings');
    } catch (error) {
      Logger.error('Failed to get settings', error);
      return null;
    }
  }
}

// Initialize background service
new BackgroundService();
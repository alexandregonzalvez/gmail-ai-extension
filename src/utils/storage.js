export class StorageService {
    static async get(key) {
      const result = await chrome.storage.sync.get([key]);
      return result[key];
    }
  
    static async set(key, value) {
      await chrome.storage.sync.set({ [key]: value });
    }
  
    static async remove(key) {
      await chrome.storage.sync.remove([key]);
    }
  }
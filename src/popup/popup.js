document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('api-key');
  const saveButton = document.getElementById('save');
  const resetButton = document.getElementById('reset');
  const autoProcess = document.getElementById('auto-process');
  const skipSpam = document.getElementById('skip-spam');

  // Charger les paramètres existants
  chrome.storage.sync.get(['apiKey', 'settings'], function(result) {
      if (result.apiKey) {
          apiKeyInput.value = result.apiKey;
      }
      if (result.settings) {
          autoProcess.checked = result.settings.autoProcess ?? true;
          skipSpam.checked = result.settings.skipSpam ?? true;
      }
  });

  // Gestionnaire de sauvegarde
  saveButton.addEventListener('click', function() {
      const settings = {
          autoProcess: autoProcess.checked,
          skipSpam: skipSpam.checked
      };

      chrome.storage.sync.set({
          apiKey: apiKeyInput.value,
          settings: settings
      }, function() {
          showMessage('Settings saved successfully');
      });
  });

  // Gestionnaire de réinitialisation
  resetButton.addEventListener('click', function() {
      chrome.storage.sync.set({
          processedCount: 0,
          skippedCount: 0
      }, function() {
          showMessage('Stats reset successfully');
          updateStats();
      });
  });

  function showMessage(text) {
      const message = document.createElement('div');
      message.className = 'message success';
      message.textContent = text;
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
  }

  function updateStats() {
      chrome.storage.sync.get(['processedCount', 'skippedCount'], function(result) {
          document.getElementById('processed-count').textContent = result.processedCount || 0;
          document.getElementById('skipped-count').textContent = result.skippedCount || 0;
      });
  }

  // Mettre à jour les statistiques au chargement
  updateStats();
});
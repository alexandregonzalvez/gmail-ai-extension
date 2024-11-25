# Gmail AI Assistant

A Chrome extension that automatically processes Gmail emails using AI for analysis and classification.

## Features
- Automatic email processing
- Spam detection
- AI-powered email analysis
- Custom UI integration with Gmail

## Setup
1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your API keys
3. Load the extension in Chrome Developer Mode

## Development
- `src/background/` - Background scripts
- `src/content/` - Content scripts for Gmail integration
- `src/popup/` - Extension popup UI
- `src/utils/` - Shared utilities and API handlers

## Testing
Load the extension in Chrome:
1. Go to `chrome://extensions/`
2. Enable Developer Mode
3. Click "Load unpacked"
4. Select the extension directory

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.
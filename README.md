<div align="center">
  <img src="./images/icon512.png" alt="Zack Logo" width="128"/>
</div>

# Zack
One-click Chrome extension to send and log web pages to Slack. Easily keep a browsable, chronological history of important links right in your Slack channels.

## Development

### Quick Start
1. **Validate the extension**: `node validate-extension.js` (completes in ~50ms)
2. **Load in Chrome**: Open `chrome://extensions/`, enable "Developer mode", click "Load unpacked", select this directory
3. **Test functionality**: Click extension icon or press `Alt+Shift+Z`, configure Slack webhook in options

### Manual Testing Required
This extension has no automated tests. Always manually validate changes by:
- Reloading extension in `chrome://extensions/`
- Testing all three message formats (markdown, simple, URL-only) 
- Verifying Slack messages are sent correctly
- Checking browser console for JavaScript errors

See `.github/copilot-instructions.md` for complete development guidelines.

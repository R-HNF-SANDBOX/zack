# Zack Chrome Extension
Zack is a Chrome extension (Manifest V3) that enables one-click sending of web pages to Slack. It stores configuration in Chrome extension storage and sends formatted messages to Slack via webhook URLs.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- **CRITICAL**: This is a Chrome extension - there is NO build process, NO tests, NO CI/CD pipeline
- Validate the extension before development:
  - `node validate-extension.js` -- completes in ~50ms. Sets exit code 0 on success, 1 on failure.
- Load the extension in Chrome:
  - Open Chrome and navigate to `chrome://extensions/`
  - Enable "Developer mode" toggle (top right)
  - Click "Load unpacked" button  
  - Select the repository root directory
  - **NEVER CANCEL**: Extension loading takes 1-3 seconds. Wait for completion.
- Test the extension functionality:
  - Click the extension icon in Chrome toolbar OR press `Alt+Shift+Z`
  - Configure Slack webhook URL in options page (right-click extension → "Options")
  - **VALIDATION SCENARIO**: Always test by saving a webpage to Slack after making changes

## Validation
- **MANUAL VALIDATION REQUIREMENT**: After making changes, you MUST test actual functionality by:
  1. Reloading the extension in `chrome://extensions/` (click reload button next to the extension)
  2. Opening the options page and verifying the UI works correctly
  3. Setting a test Slack webhook URL (or using existing configuration)
  4. Testing the send-to-Slack functionality by clicking the extension icon or using `Alt+Shift+Z`
  5. Verifying the Slack message is formatted correctly and sent successfully
- **NEVER SKIP VALIDATION**: Simply reloading the extension is NOT sufficient - you must exercise real user workflows
- Check browser console for any JavaScript errors (`F12` → Console tab)
- Always test all three logging formats: markdown, simple, and URL-only

## Common tasks
The following are commands and file locations for frequently accessed areas. Reference them instead of searching to save time.

### Repository root
```
ls -a /home/runner/work/zack/zack
.
..
.git
.gitignore
.github/
LICENSE
README.md
background/
images/
manifest.json
options/
validate-extension.js
```

### Key files and their purposes
- `manifest.json` - Chrome extension manifest (defines permissions, entry points, metadata)
- `background/background.js` - Service worker that handles extension button clicks and keyboard shortcuts
- `options/options.html` - Options page UI with Bootstrap styling
- `options/options.js` - Options page logic (saves/loads Slack webhook URL and formatting preferences)
- `images/icon*.png` - Extension icons (16px, 48px, 128px)
- `validate-extension.js` - Validation script to check extension readiness

### Extension architecture
```
Zack Extension Architecture:
├── manifest.json (defines extension metadata and permissions)
├── background/ (service worker)
│   └── background.js (main extension logic, handles clicks and shortcuts)
├── options/ (configuration UI)
│   ├── options.html (settings page with Bootstrap UI)
│   ├── options.js (saves webhook URL and preferences to chrome.storage)
│   ├── bootstrap.min.css (UI framework)
│   └── bootstrap.bundle.min.js (UI framework)
└── images/ (extension icons for different sizes)
```

### Core functionality
- **Sending to Slack**: Extension captures current tab URL and title, formats according to user preference, sends to configured webhook
- **Storage**: Uses `chrome.storage.local` to persist webhook URL, description, and formatting type
- **Notifications**: Shows Chrome notifications on success/failure
- **Keyboard shortcut**: `Alt+Shift+Z` triggers the send action
- **Formatting options**: 
  - Markdown: `<URL|Title>` 
  - Simple: `Title\nURL`
  - URL-only: `URL`

### Making changes
1. Edit files directly (no build process required)
2. Run `node validate-extension.js` to check for basic issues
3. Reload extension in Chrome: go to `chrome://extensions/` and click the reload button
4. **CRITICAL**: Test actual functionality - send a page to Slack to verify changes work
5. Check browser console for JavaScript errors

### Debugging
- Open `chrome://extensions/` and click "service worker" link next to Zack extension to debug background script
- Right-click extension icon → "Inspect popup" (though this extension has no popup)
- Right-click extension icon → "Options" to open configuration page
- Use `F12` on options page to debug options UI
- Check Chrome notifications for extension feedback

### File contents reference
Use these snippets to understand the codebase without repeatedly viewing files:

#### manifest.json key properties
```json
{
  "manifest_version": 3,
  "name": "Zack",
  "version": "1.0",
  "permissions": ["activeTab", "storage", "notifications"],
  "host_permissions": ["<all_urls>"],
  "background": {"service_worker": "background/background.js"},
  "options_ui": {"page": "options/options.html", "open_in_tab": true},
  "commands": {
    "_execute_action": {
      "suggested_key": {"default": "Alt+Shift+Z"},
      "description": "Zack - Send current page to Slack"
    }
  }
}
```

#### Main extension logic flow
1. User clicks extension icon or presses `Alt+Shift+Z`
2. `background.js` triggers `zack()` function
3. Retrieves settings from `chrome.storage.local`
4. Gets current tab URL and title via `chrome.tabs.query`
5. Formats message according to user preference
6. Sends POST request to Slack webhook URL
7. Shows success/failure notification

### Dependencies
- **Bootstrap 5.3.0**: UI framework for options page (included as minified files)
- **Chrome Extensions API**: For storage, tabs, notifications, commands
- **No external build tools**: Pure vanilla JavaScript/HTML/CSS

### Limitations
- **No automated testing**: All testing must be done manually in Chrome
- **No linting**: Code style is not automatically enforced
- **No TypeScript**: Uses vanilla JavaScript only
- **Chrome only**: Extension is specific to Chrome/Chromium browsers
- **No build optimization**: Files are served as-is to Chrome
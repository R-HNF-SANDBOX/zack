// Import webhook providers
importScripts('webhook-providers.js');

function makeNotification(title) {
    const showingSeconds = 5;
    chrome.notifications.create(
        {
            type: 'basic',
            iconUrl: '../images/icon512-with-space-white-bg.png',
            title,
            message: `This notification will close automatically after ${showingSeconds} seconds.`,
            priority: 1,
            requireInteraction: false
        },
        (notificationId) => {
            if (chrome.runtime.lastError) {
                return;
            } else {
                setTimeout(() => {
                    chrome.notifications.clear(notificationId);
                }, showingSeconds * 1000);
            }
        }
    );
}

function zack() {
    chrome.storage.local.get(['webhookUrl', 'webhookType', 'loggingFormatType', 'slackWebhookUrl'], async (data) => {
        // Support legacy Slack-only configuration
        const webhookUrl = data.webhookUrl || data.slackWebhookUrl;
        const webhookType = data.webhookType || 'slack'; // Default to slack for backward compatibility
        const loggingFormatType = data.loggingFormatType || 'markdown';

        if (webhookUrl) {
            try {
                chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                    const activeTab = tabs[0];
                    if (activeTab && activeTab.url) {
                        try {
                            const provider = window.WebhookProviders.createWebhookProvider(webhookType, webhookUrl);
                            const payload = provider.formatPayload(activeTab.title, activeTab.url, loggingFormatType);
                            const response = await provider.sendMessage(payload);

                            if (response.ok) {
                                makeNotification('Saved the current page');
                            } else {
                                makeNotification('Webhook request failed');
                            }
                        } catch (providerError) {
                            makeNotification(`Error: ${providerError.message}`);
                        }
                    } else {
                        makeNotification('No active tab found');
                    }
                });
            } catch (error) {
                makeNotification('Error: Zack failed');
            }
        } else {
            makeNotification('No webhook url set');
            return;
        }
    });
}

chrome.action.onClicked.addListener(() => {
    zack();
});

chrome.commands.onCommand.addListener((command) => {
    if (command === '_execute_action') {
        zack();
    }
});

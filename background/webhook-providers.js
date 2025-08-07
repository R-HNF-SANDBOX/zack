/**
 * Base class for webhook providers
 * Defines the interface that all webhook providers must implement
 */
class WebhookProvider {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    /**
     * Formats the message payload for the specific webhook provider
     * @param {string} title - Page title
     * @param {string} url - Page URL
     * @param {string} formatType - Format type (markdown, simple, url-only)
     * @returns {Object} Formatted payload for webhook
     */
    formatPayload(title, url, formatType) {
        throw new Error('formatPayload must be implemented by subclass');
    }

    /**
     * Sends the message to the webhook
     * @param {Object} payload - Formatted payload
     * @returns {Promise<Response>} Fetch response
     */
    async sendMessage(payload) {
        return await fetch(this.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
    }
}

/**
 * Slack webhook provider
 */
class SlackProvider extends WebhookProvider {
    formatPayload(title, url, formatType) {
        let text = '';
        if (formatType === 'markdown') {
            text = `<${url}|${title}>`;
        } else if (formatType === 'simple') {
            text = `${title}\n${url}`;
        } else if (formatType === 'url-only') {
            text = `${url}`;
        }

        return {
            text,
            unfurl_links: true,
        };
    }
}

/**
 * Discord webhook provider
 */
class DiscordProvider extends WebhookProvider {
    formatPayload(title, url, formatType) {
        let content = '';
        if (formatType === 'markdown') {
            content = `[${title}](${url})`;
        } else if (formatType === 'simple') {
            content = `${title}\n${url}`;
        } else if (formatType === 'url-only') {
            content = `${url}`;
        }

        return {
            content,
        };
    }
}

/**
 * Factory function to create the appropriate webhook provider
 * @param {string} providerType - Type of provider (slack, discord)
 * @param {string} webhookUrl - Webhook URL
 * @returns {WebhookProvider} Provider instance
 */
function createWebhookProvider(providerType, webhookUrl) {
    switch (providerType) {
        case 'slack':
            return new SlackProvider(webhookUrl);
        case 'discord':
            return new DiscordProvider(webhookUrl);
        default:
            throw new Error(`Unknown provider type: ${providerType}`);
    }
}

// Export for use in background.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WebhookProvider, SlackProvider, DiscordProvider, createWebhookProvider };
}
// In service worker context, make functions available globally
if (typeof self !== 'undefined' && typeof importScripts !== 'undefined') {
    self.WebhookProvider = WebhookProvider;
    self.SlackProvider = SlackProvider;
    self.DiscordProvider = DiscordProvider;
    self.createWebhookProvider = createWebhookProvider;
}
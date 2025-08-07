document.addEventListener('DOMContentLoaded', () => {
    const webhookTypeElement = document.getElementById('webhook-type');
    const webhookUrlElement = document.getElementById('webhook-url');
    const shortDescriptionElement = document.getElementById('short-desc');
    const loggingFormatTypeElement = document.getElementById('logging-format-type');
    const saveButtonElement = document.getElementById('save-btn');
    const notificationElement = document.getElementById('notification');

    // Load existing settings with backward compatibility
    chrome.storage.local.get(['webhookType', 'webhookUrl', 'slackWebhookUrl', 'shortDescription', 'loggingFormatType'], (data) => {
        // Handle backward compatibility for existing Slack configurations
        if (data.slackWebhookUrl && !data.webhookUrl) {
            // Migrate legacy Slack configuration
            webhookTypeElement.value = 'slack';
            webhookUrlElement.value = data.slackWebhookUrl;
        } else {
            // Use new configuration format
            if (data.webhookType) {
                webhookTypeElement.value = data.webhookType;
            }
            if (data.webhookUrl) {
                webhookUrlElement.value = data.webhookUrl;
            }
        }

        if (data.shortDescription) {
            shortDescriptionElement.value = data.shortDescription;
        }
        if (data.loggingFormatType) {
            loggingFormatTypeElement.value = data.loggingFormatType;
        }
        document.body.classList.add('loaded');
    });

    // Update placeholder text based on webhook type
    webhookTypeElement.addEventListener('change', () => {
        const webhookType = webhookTypeElement.value;
        if (webhookType === 'slack') {
            webhookUrlElement.placeholder = 'https://hooks.slack.com/services/...';
        } else if (webhookType === 'discord') {
            webhookUrlElement.placeholder = 'https://discord.com/api/webhooks/...';
        }
    });

    saveButtonElement.addEventListener('click', async () => {
        const webhookTypeValue = webhookTypeElement.value.trim();
        const webhookUrlValue = webhookUrlElement.value.trim();
        const shortDescriptionValue = shortDescriptionElement.value.trim();
        const loggingFormatTypeValue = loggingFormatTypeElement.value.trim();

        try {
            new URL(webhookUrlValue);
        } catch (error) {
            notificationElement.textContent = 'Invalid webhook url';
            notificationElement.style.color = 'red';
            console.error('Error: Invalid webhook url');
            return;
        }

        try {
            // Save with new format and maintain legacy key for backward compatibility
            const storageData = {
                webhookType: webhookTypeValue,
                webhookUrl: webhookUrlValue,
                shortDescription: shortDescriptionValue,
                loggingFormatType: loggingFormatTypeValue
            };

            // For backward compatibility with existing Slack setups
            if (webhookTypeValue === 'slack') {
                storageData.slackWebhookUrl = webhookUrlValue;
            }

            await chrome.storage.local.set(storageData);
            notificationElement.textContent = 'Saved!';
            notificationElement.style.color = 'green';
            setTimeout(() => {
                notificationElement.textContent = '';
            }, 2000);
        } catch (error) {
            notificationElement.textContent = 'Error';
            notificationElement.style.color = 'red';
            console.error('Error: Saving the settings failed');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    function log(message, isError = false) {
        console.log(message);
        const logElement = document.getElementById('log');
        if (logElement) {
            const p = document.createElement('p');
            p.textContent = message;
            if (isError) p.style.color = 'red';
            logElement.appendChild(p);
        }
    }

    function createNotification(title, message) {
        log(`Attempting to create notification: ${title} - ${message}`);
        
        chrome.notifications.create({
            type: 'basic',
            iconUrl: chrome.runtime.getURL('icons/icon128.png'),
            title: title,
            message: message,
            priority: 2
        }, function(notificationId) {
            if (chrome.runtime.lastError) {
                log(`Notification creation failed: ${chrome.runtime.lastError.message}`, true);
            } else {
                log(`Notification created successfully with ID: ${notificationId}`);
            }
        });
    }

    // Function to show a message after clearing data
    function showClearedMessage(clearedItems) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('cleared-message');
        messageContainer.textContent = `Cleared: ${clearedItems.join(', ')}`;
        
        // Remove buttons and show the message
        document.getElementById('clearSelectedBtn').classList.add('hidden');
        document.getElementById('clearAllBtn').classList.add('hidden');
        document.querySelector('.container').appendChild(messageContainer);
    }

    function addClearedAnimation(inputId, delay) {
        const checkbox = document.getElementById(inputId);
        if (!checkbox) {
            log(`Checkbox with ID ${inputId} not found`, true);
            return;
        }

        const container = checkbox.closest('.checkbox-container');
        if (!container) {
            log(`No checkbox-container found for ${inputId}`, true);
            return;
        }

        const tickMark = container.querySelector('.tick');
        if (!tickMark) {
            log(`Tick mark not found for ${inputId}`, true);
            return;
        }

        setTimeout(() => {
            container.classList.add('cleared');
        }, delay); // Delay for tick mark animation
    }

    document.getElementById('clearSelectedBtn').addEventListener('click', function() {
        log("Clear Selected button clicked");

        const clearCache = document.getElementById('clearCache').checked;
        const clearCookies = document.getElementById('clearCookies').checked;
        const clearHistory = document.getElementById('clearHistory').checked;

        log(`Selected options: Cache: ${clearCache}, Cookies: ${clearCookies}, History: ${clearHistory}`);

        let dataToClear = {};
        let clearedItems = [];
        let delay = 0;

        if (clearCache) {
            dataToClear.cache = true;
            clearedItems.push('Cache');
            addClearedAnimation('clearCache', delay);
            delay += 500; // Add 500ms delay between animations
        }
        if (clearCookies) {
            dataToClear.cookies = true;
            clearedItems.push('Cookies');
            addClearedAnimation('clearCookies', delay);
            delay += 500;
        }
        if (clearHistory) {
            dataToClear.history = true;
            clearedItems.push('History');
            addClearedAnimation('clearHistory', delay);
            delay += 500;
        }

        if (Object.keys(dataToClear).length === 0) {
            log("No data selected, showing notification");
            createNotification('No Data Selected', 'Please select at least one option to clear.');
            return;
        }

        chrome.browsingData.remove({
            "since": 0
        }, dataToClear, function() {
            if (chrome.runtime.lastError) {
                log(`Error clearing data: ${chrome.runtime.lastError.message}`, true);
                createNotification('Error', 'Failed to clear data. Please try again.');
            } else {
                log(`Data cleared: ${JSON.stringify(dataToClear)}`);
                createNotification('Success', 'Selected data cleared successfully!');
                
                // Show the message of what was cleared
                setTimeout(() => {
                    showClearedMessage(clearedItems);
                }, delay + 500); // Show message after all animations are done
            }
        });
    });

    document.getElementById('clearAllBtn').addEventListener('click', function() {
        log("Clear All button clicked");

        const clearCache = document.getElementById('clearCache');
        const clearCookies = document.getElementById('clearCookies');
        const clearHistory = document.getElementById('clearHistory');

        clearCache.checked = true;
        clearCookies.checked = true;
        clearHistory.checked = true;

        let clearedItems = ['Cache', 'Cookies', 'History'];
        let delay = 0;

        chrome.browsingData.remove({
            "since": 0
        }, {
            cache: true,
            cookies: true,
            history: true
        }, function() {
            if (chrome.runtime.lastError) {
                log(`Error clearing data: ${chrome.runtime.lastError.message}`, true);
                createNotification('Error', 'Failed to clear data. Please try again.');
            } else {
                addClearedAnimation('clearCache', delay);
                delay += 500;
                addClearedAnimation('clearCookies', delay);
                delay += 500;
                addClearedAnimation('clearHistory', delay);

                log('Data cleared: {"cache":true,"cookies":true,"history":true}');
                createNotification('Success', 'All data cleared successfully!');
                
                // Show the message for "Clear All"
                setTimeout(() => {
                    showClearedMessage(clearedItems);
                }, delay + 500);
            }
        });
    });
});

// Function to log messages both to console and to the popup
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

// Function to create notifications with enhanced error logging
function createNotification(title, message) {
    log(`Attempting to create notification: ${title} - ${message}`);
    
    chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icons/icon128.png'),  // Ensure the correct icon path
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

// Function to update data usage with simulated values
function getEstimatedDataUsage() {
    const cacheUsage = Math.floor(Math.random() * 500); // Simulated cache size
    const cookiesUsage = Math.floor(Math.random() * 50); // Simulated cookies size
    const historyUsage = Math.floor(Math.random() * 100); // Simulated history size

    document.getElementById('cacheUsage').textContent = cacheUsage;
    document.getElementById('cookiesUsage').textContent = cookiesUsage;
    document.getElementById('historyUsage').textContent = historyUsage;
}

// Update data usage when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    getEstimatedDataUsage();
});

// Time range logic and clear selected button click handler remains the same


document.addEventListener('DOMContentLoaded', function() {
    log("DOM fully loaded");

    // Test notification on popup open
    createNotification('Test', 'This is a test notification on popup open');

    document.getElementById('clearSelectedBtn').addEventListener('click', function() {
        log("Clear Selected button clicked");
        
        const clearCache = document.getElementById('clearCache').checked;
        const clearCookies = document.getElementById('clearCookies').checked;
        const clearHistory = document.getElementById('clearHistory').checked;

        log(`Selected options: Cache: ${clearCache}, Cookies: ${clearCookies}, History: ${clearHistory}`);

        // Collect the selected options
        let dataToClear = {};
        if (clearCache) dataToClear.cache = true;
        if (clearCookies) dataToClear.cookies = true;
        if (clearHistory) dataToClear.history = true;

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
            }
        });
    });

    // Clear all when "Clear All" button is clicked
    document.getElementById('clearAllBtn').addEventListener('click', function() {
        log("Clear All button clicked");
        
        document.getElementById('clearCache').checked = true;
        document.getElementById('clearCookies').checked = true;
        document.getElementById('clearHistory').checked = true;

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
                log('Data cleared: {"cache":true,"cookies":true,"history":true}');
                createNotification('Success', 'All data cleared successfully!');
            }
        });
    });
});

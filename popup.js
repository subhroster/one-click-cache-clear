document.getElementById('clearSelectedBtn').addEventListener('click', function() {
    const clearCache = document.getElementById('clearCache').checked;
    const clearCookies = document.getElementById('clearCookies').checked;
    const clearHistory = document.getElementById('clearHistory').checked;
    
    // Collect the selected options
    let dataToClear = {};
    
    if (clearCache) {
      dataToClear.cache = true;
    }
    if (clearCookies) {
      dataToClear.cookies = true;
    }
    if (clearHistory) {
      dataToClear.history = true;
    }
  
    if (Object.keys(dataToClear).length === 0) {
      alert('Please select at least one option to clear.');
      return;
    }
  
    // Clear selected data
    chrome.browsingData.remove({
      "since": 0 // Clear data from the beginning
    }, dataToClear, function() {
      console.log('Selected data cleared:', dataToClear);
      alert('Selected data cleared!');
    });
  });
  
  // Clear all when "Clear All" button is clicked
  document.getElementById('clearAllBtn').addEventListener('click', function() {
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
      console.log('All data cleared');
      alert('All data cleared!');
    });
  });
  
document.getElementById("getTabUrl").addEventListener("click", function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTab = tabs[0];
        var url = activeTab.url;

        const leetCodeChallengePattern = /\/problems\//;

        if (leetCodeChallengePattern.test(url)) {
            alert("Đây là liên kết chi tiết của một thử thách trên LeetCode.");
        }
    });
});
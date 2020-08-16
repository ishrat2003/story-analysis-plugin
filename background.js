var rule1 = {
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'www.bbc.co.uk', schemes: ['https'] },
        css: ["div[class='story-body']"]
      })
    ],
    actions: [ new chrome.declarativeContent.ShowPageAction() ]
  };


chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ color: '#3aa757' }, function () {
        console.log("The color is green.");
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([rule1]);
    });
});
var analysisUrl = "http://127.0.0.1:3500";

var rule1 = {
  conditions: [
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { hostEquals: 'www.bbc.co.uk', schemes: ['https'] } //,
      //css: ["div[class='story-body']"]
    })
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()]
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ color: '#3aa757' }, function () {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([rule1]);
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type == "storyFetchBackgroundLc") readLc(request.options.message, request.tabId);
  sendResponse();
});

function saveStoryInput(storyInput, key, value, tabId){
  storyInput[tabId][key] = value;
  chrome.storage.local.set({
    'storyInput': storyInput
  });
}

function readLc(storyInput, tabId) {
  $.ajax(analysisUrl + "/lc", {
    data: JSON.stringify(storyInput[tabId]),
    method: "POST",
    contentType: "application/json"
  }).done(function (data) {
    saveStoryInput(storyInput, 'lc', data, tabId);
    var lcData = data;
    lcData['title'] = storyInput['title'];
    lcData['topics'][0]['name'] = '←' + lcData['topics'][0]['name'];
    chrome.runtime.sendMessage({
      type: "storyPopupUpdateLc",
      tabId: tabId, 
      options: {
        message: data
      }
    });
  });
}


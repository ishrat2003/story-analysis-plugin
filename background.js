var analysisUrl = "https://247dtw4y0i.execute-api.eu-west-1.amazonaws.com/Production/story-analysis"

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
  var title = storyInput[tabId]['title'];

  $.ajax(analysisUrl + "/lc", {
    data: JSON.stringify(storyInput[tabId]),
    method: "POST",
    contentType: "application/json"
  }).done(function (data) {
    saveStoryInput(storyInput, 'lc', data, tabId);
    var lcData = data;
    console.log(lcData);
    lcData['title'] = title;
    lcData['concepts']['story_words'][0]['pure_word'] = '←' + lcData['concepts']['story_words'][0]['pure_word'];
    chrome.runtime.sendMessage({
      type: "storyPopupUpdateLc",
      tabId: tabId, 
      options: {
        message: lcData
      }
    });
  });
}


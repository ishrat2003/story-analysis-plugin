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
  if (request.type == "storyFetch") readLc(request.options.message, sender['id']);
  sendResponse();
});

function saveStoryInput(storyInput, key, value){
  storyInput[key] = value;
  chrome.storage.local.set({
    'storyInput': storyInput
  });
}

function readLc(storyInput, browserId) {
  saveStoryInput(storyInput, 'browserId', browserId);
  
  $.ajax(analysisUrl + "/lc", {
    data: JSON.stringify(storyInput),
    method: "POST",
    contentType: "application/json"
  }).done(function (data) {
    console.log(data);
    saveStoryInput(storyInput, 'lc', data);
    var options = data;
    options['title'] = storyInput['title'];
    chrome.runtime.sendMessage({type: "storyUpdateLc", options: options});
  });
}


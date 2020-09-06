# story-survey

From back ground script

Checking local storage
chrome.storage.local.get(function(result){console.log(result)})

Clearing local storage
chrome.storage.local.remove(["content", "storyInput_text", "storyInput"]);
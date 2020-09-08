chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "storyPopupUpdateLc") updateLc(request.options.message, request.tabId);
    sendResponse();
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    
    chrome.storage.local.get(function(result){
        var reload = true;
        if(result['storyInput'][tabs[0].id]['lc']){
            lcResponse = result['storyInput'][tabs[0].id]['lc'];
            lcResponse['title'] = result['storyInput'][tabs[0].id]['title'];
            lcResponse['topics'][0]['name'] = '←' + lcResponse['topics'][0]['name'];
            updateLc(lcResponse, tabs[0].id);
            //reload = false;
        }
        if (reload) {
            chrome.tabs.sendMessage(tabs[0].id, {type: "storyContentLoadText", tabId: tabs[0].id});
        }
    });
});

function updateLc(lcResponse, tabId) {
    $('#lcTitle').html('<h2 class="lcMainTitle">' + lcResponse['title'] + '</h2>');
    $('#lcLoading').hide();
    $('#lcVizualization').html('');
    console.log(lcResponse);
    displayLc(lcResponse['topics'], 'count');
    $('#storySurVerForm').show();

    chrome.tabs.executeScript(null, { file: "js/jquery-3.5.1.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "vizualization/popup-to-content.js" });
    });
}


//let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function (data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
// });

// chrome.tabs.executeScript(null, { file: "js/jquery-3.5.1.min.js" }, function() {
//     chrome.tabs.executeScript(null, { file: "vizualization/page.js" });
// });

// changeColor.onclick = function (element) {
//     let color = element.target.value;
//     console.log('Pop-up');
    
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         console.log(tabs[0]);
//         chrome.tabs.executeScript(tabs[0].id, {
//             file: 'injected-content.js'
//         });
//     });
// };

$(function(){
    // console.log('--- injected ---');
    // var content = $("div.story-body").text();
    // $('#lcStoryLoading').text(content);
    // do your business here
  });
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "storyUpdateLc") updateLc(request.options, sender['id']);
    sendResponse();
});

function updateLc(lcResponse, browserId) {
    $('#lcTitle').html('<h2 class="lcMainTitle">' + lcResponse['title'] + '</h2>');
    $('#lcLoading').hide();
    $('#lcVizualization').html('');
    var data = [
        {name: '← Finland222', size: 58, color: 'proper_noun'},
        {name: 'Finland1', size: 8, color: 'noun'},
        {name: 'Finland2', size: 28, color: 'verb'}
    ];
    displayLc(data);
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
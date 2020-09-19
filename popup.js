chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "storyPopupUpdateLc") updateLc(request.options.message);
    sendResponse();
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {    
    $( "#container" ).data( "tabid", tabs[0].id);
});

function load(tabId){
    loadHide();

    chrome.storage.local.get(function(result){
        if(result['storyInput'][tabId] && result['storyInput'][tabId]['lc']){
            console.log('loading existing data', result['storyInput'][tabId]);
            var lcResponse = result['storyInput'][tabId]['lc'];
            lcResponse['title'] = result['storyInput'][tabId]['title'];
            lcResponse['topics'][0]['name'] = '←' + lcResponse['topics'][0]['name'];
            updateLc(lcResponse, tabId);
        } else {
            console.log('reloading');
            reload(tabId);
        }
    });
}

function reload(tabId){
    loadHide();
    chrome.tabs.sendMessage(tabId, {type: "storyContentLoadText", tabId: tabId});
}

function loadHide(){
    $('#reloadButton').hide();
    $('#lcLoading').show();
    $('#lcVizualization').html('');
    $('#storySurveyForm').hide();
    $('#lcTitle').hide();
    $('#lcRaw').hide();
}

function updateLc(lcResponse) {
    $('#lcTitle').html('<h2 class="lcMainTitle">' + lcResponse['title'] + '</h2>');
    showRaw(lcResponse['raw']);
    $('#lcLoading').hide();
    $('#lcVizualization').html('');
    displayLc(lcResponse['topics'], 'count');
    $('#lcTitle').show();
    $('#storySurveyForm').show();
    $('#reloadButton').show();
    $('#lcRaw').show();

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
    $('#container').load('html/header.html');

    $('#tabs').load('html/tabs.html', function(){
        var tabId = $( "#container" ).data( "tabid");
        $('#lcTab').load('html/tabs/lc.html', function(){
            load(tabId);
            $('#showLcRaw').on('click', function(){
                $( "#lcRaw" ).toggle();
            });
        });
        $('#relativeTab').load('html/tabs/relative.html');
        $('#gcTab').load('html/tabs/gc.html');
        $('#aboutTab').load('html/tabs/about.html');
        $('#reloadButton').on('click', function(){
            console.log('clicked');
            reload(tabId);
        });
        $('#local').show();
        $('.tablinks').on('click', function(){
            $('.tabcontent').hide();
            var divId = '#' + $(this).data('divid');
            $(divId).show();
        });
    });
    
});

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
        if(result['storyInput'] && result['storyInput'][tabId] && result['storyInput'][tabId]['lc']){
            console.log('loading existing data', result['storyInput'][tabId]);
            var lcResponse = result['storyInput'][tabId]['lc'];
            lcResponse['title'] = result['storyInput'][tabId]['title'];
            lcResponse['concepts']['story_words'][0]['pure_word'] = '←' + lcResponse['concepts']['story_words'][0]['pure_word'];
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
    showRaw(lcResponse);
    $('#lcLoading').hide();
    $('#lcVizualization').html('');
    displayLc(lcResponse['concepts']['story_words'], 'position_weight_forward');
    $('#lcTitle').show();
    $('#storySurveyForm').show();
    $('#reloadButton').show();
    $('#lcRaw').show();

    if (lcResponse['concepts']['graph']) {
        displayKnowledgeGraph(lcResponse['concepts']['graph']['links'], lcResponse['concepts']['graph']['nodes']);
        $('#knowledgegraphLoading').hide();
    }
    chrome.tabs.executeScript(null, { file: "js/jquery-3.5.1.min.js" }, function() {
        chrome.tabs.executeScript(null, { file: "vizualization/popup-to-content.js" });
    });
}

function getCurrentDateTime(){
    var currentdate = new Date(); 
    return currentdate.getDate() + "-"
            + (currentdate.getMonth()+1)  + "-" 
            + currentdate.getFullYear() + " "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
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
    $('form').submit(function(event){event.preventDefault();});
    $('#container').load('html/header.html');

    $('#tabs').load('html/tabs.html', function(){
        var tabId = $( "#container" ).data( "tabid");
        $('#lcTab').load('html/tabs/lc.html', function(){
            load(tabId);
            $('#showLcRaw').on('click', function(){
                $( "#lcRaw" ).toggle();
            });
        });
        // $('#relativeTab').load('html/tabs/relative.html');
        // $('#gcTab').load('html/tabs/gc.html');
        $('#knowledgegraphTab').load('html/tabs/knowledgegraph.html');
        $('#surveyTab').load('html/tabs/survey.html', function(){
            var tabId = $( "#container" ).data( "tabid");
            chrome.storage.local.get(function(result){
                if(result['storyInput'] && result['storyInput'][tabId]){
                    $('#story_date').val(result['storyInput'][tabId]['pubDate']);
                    $('#story_source').val(result['storyInput'][tabId]['source']);
                    $('#story_link').val(result['storyInput'][tabId]['link']);
                    $('#story_title').val(result['storyInput'][tabId]['title']);
                    $('#news_topics').val(result['storyInput'][tabId]['news_topics']);
                    $('#open_date_time').val(getCurrentDateTime());
                    $.getJSON("https://api.ipify.org?format=json", function(data) { 
                        $('#user_code').val(data.ip);
                });
                }
            });
            $('#storySurveySubmit').on('click', function(){
                var data = $('#storySurveyForm').serializeArray().reduce(function(obj, item) {
                    obj[item.name] = item.value;
                    return obj;
                }, {});
                data['close_date_time'] = getCurrentDateTime();
                $( "#error", "#message").html('');
                $.ajax({
                    url : "http://127.0.0.1:3500/survey", // Url of backend (can be python, php, etc..)
                    type: "POST", // data type (can be get, post, put, delete)
                    dataType: 'json',
                    data : JSON.stringify(data), // data in json format
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    success: function(response, textStatus, jqXHR) {
                        console.log(response);
                        if(response.errors){
                            $("#error").html(response.errors);
                            $('#storySurveySubmit').show();
                            $('#surveyLoading').hide();
                        }else{
                            $( "#message" ).html('Thanks for the review.');
                            $('#storySurveyForm, #surveyLoading').hide();
                        }
                        $("html").animate({ scrollTop: 0 }, "slow");
                        
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        $('#storySurveySubmit').show();
                        $('#surveyLoading').hide();
                        ( "#error" ).html('Failed to save review.');
                        $("html").animate({ scrollTop: 0 }, "slow");
                    }
                });
                $('#storySurveySubmit').hide();
                $('#surveyLoading').show();
            });
        });
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

var content = '';
var maxPCount = 0;
var storyInput = {};

function init(tabId) {
    loadContent(tabId);
    
    if(storyInput[tabId]['content']){
        chrome.runtime.sendMessage({
            type: "storyFetchBackgroundLc", 
            tabId: tabId,
            options: {
                message: storyInput
            }
        });
    }
}

function loadContent(tabId){
    content = '';
    maxPCount = 0;
    divSelector = '';
    rawContent = '';
    if ($('.story-body').length){
        divSelector = '.story-body';
        rawContent = $('.story-body').html();
    }else if($('article').length){
        divSelector = 'article';
    }

    rawContent = $(divSelector).html();

    var topics = [];
    $("a[href^='/news/topics']").each(function(){
        var text = $(this).text();;
        if($.inArray(text, topics) === -1) topics.push(text);
    });

    storyInput[tabId] = {
        'title': $('h1').eq(0).text(),
        'description': $('meta[name=description]').attr("content"),
        'link': window.location.href,
        'source': window.location.hostname,
        'pubDate': $('time').prop('dateTime'),
        'divSelector': divSelector,
        'raw_content': rawContent,
        'news_topics': topics.join(', ')
    };

    console.log(storyInput);

    if (divSelector == 'article'){
        setArticleContent(divSelector, tabId);
    }else{
        $(divSelector).each(function () {
            setWinningDivContent(this, tabId);
        });
    }

    chrome.storage.local.set({
        'storyInput': storyInput
    });
}

function setArticleContent(selector, tabId){
    content = '';
    $('div').removeClass('addBorder');
    $(selector).children().each(function () {
        if ($(this).data('component') == 'text-block') {
            $(this).addClass('addBorder');
            content += $(this).text().trim() + '. ';
        }
    });
    //console.log(content);
    if(content){
        storyInput[tabId]['content'] = content;
    }
}

function setWinningDivContent(div, tabId) {
    var totalChildren = 0;
    $(div).children().each(function () {
        if ($(this).is('div')) {
            setWinningDivContent(this, tabId);
        }
        if ($(this).is('p') || $(this).is('ul') || $(this).is('h2')) totalChildren++;
    });

    if (totalChildren > maxPCount) {
        $('p, ul, h2').removeClass('addBorder');
        maxPCount = totalChildren;
        content = getDivContent(div);
        storyInput[tabId]['content'] = content;
    }
}

function shouldIncludeText(text) {
    console.log(text);
    var ignoreTexts = [
        "Do you work in the civil service? Share your views and experiences by emailing haveyoursay@bbc.co.uk.",
        "Please include a contact number if you are willing to speak to a BBC journalist. You can also get in touch in the following ways:",
        "Do you live in one of the areas where restrictions are being reintroduced? How will you be affected? Share your views and experiences by emailing haveyoursay@bbc.co.uk.",
        "WhatsApp: +44 7756 165803. Tweet: @BBC_HaveYourSay. Please read our terms & conditions and privacy policy. ",
        "Follow James on Twitter",
        "Follow Helen on Twitter.",
        "Use the form below to send us your questions and we could be in touch.",
        "In some cases your question will be published, displaying your name, age and location as you provide it, unless you state otherwise. Your contact details will never be published. Please ensure you have read the terms and conditions.",
        "If you are reading this page on the BBC News app, you will need to visit the mobile version of the BBC website to submit your question on this topic."
    ];

    if (ignoreTexts.indexOf(text) > -1) return false;
    return true;
}

function getDivContent(div) {
    var childContent = '';
    $(div).children().each(function () {
        if ($(this).is('p') || $(this).is('ul') || $(this).is('h2')) {
            var text = '';
            if ($(this).is('ul')) {
                $(this).children().each(function () {
                    if ($(this).prop('class') === 'story-body__list-item') return;
                    var liText =  $(this).text().trim();
                    if (shouldIncludeText(liText)) {
                        text += $(this).text().trim() + '. ';
                    }
                });
            } else {
                text = $(this).text().trim();
            }

            if (text && shouldIncludeText(text)){
                childContent += text;
                $(this).addClass('addBorder');
            }
            console.log('-- here --', text);
        }
    });
    return childContent;
}

function replaceBodyHtml(word){
    var currentHtml = $('.story-body').html()
    var replacePreviousHighlight = currentHtml.replace(/<span class="highlight">(.+)<\/span>/ig, '$1');
    var highlightedContent = replacePreviousHighlight.replace('/(' + word + ')/ig', '<span class="highlight">$1</span>')
    $('.story-body').html(highlightedContent);
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == "storyContentLoadText") init(request.tabId);
    if (request.type == "storyHighlightContent") replaceBodyHtml(request.text);
    sendResponse();
});


$(function () {
});

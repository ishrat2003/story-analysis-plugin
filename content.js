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

    storyInput[tabId] = {
        'title': $('h1').eq(0).text(),
        'description': $('meta[name=description]').attr("content"),
        'link': $(location).attr('href'),
        'pubDate': $('.date').data('datetime'),
        'raw_content': $('.story-body').html()
    };

    $("div").each(function () {
        setWinningDivContent(this, tabId);
    });

    chrome.storage.local.set({
        'storyInput': storyInput
    });

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
    var ignoreTexts = [
        "Do you work in the civil service? Share your views and experiences by emailing haveyoursay@bbc.co.uk.",
        "Please include a contact number if you are willing to speak to a BBC journalist. You can also get in touch in the following ways:",
        "Do you live in one of the areas where restrictions are being reintroduced? How will you be affected? Share your views and experiences by emailing haveyoursay@bbc.co.uk.",
        "WhatsApp: +44 7756 165803. Tweet: @BBC_HaveYourSay. Please read our terms & conditions and privacy policy. "
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

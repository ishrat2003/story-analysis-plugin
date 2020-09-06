var content = '';
var maxPCount = 0;
var storyInput = {};

function init(){
    storyInput = {
        'title': $('h1').eq(0).text(),
        'description': $('meta[name=description]').attr("content"),
        'link': $(location).attr('href'),
        'pubDate': $('.date').data('datetime')
    };
    $("div").each(function () {
        setWinningDivContent(this);
    });
    chrome.runtime.sendMessage({type: "storyFetch", options: { 
        message: storyInput
    }});
    chrome.storage.local.set({
        'storyInput': storyInput
    });
}

function setWinningDivContent(div) {
    var totalChildren = 0;
    $(div).children().each(function () {
        if ($(this).is('div')) {
            setWinningDivContent(this);
        }
        if ($(this).is('p') || $(this).is('ul')) totalChildren++;
    });

    if (totalChildren > maxPCount) {
        $('p, ul').removeClass('addBorder');
        maxPCount = totalChildren;
        content = getDivContent(div);
        storyInput['content'] = content;
    }
}

function shouldIncludeText(text) {
    var ignoreTexts = [
        "Do you work in the civil service? Share your views and experiences by emailing haveyoursay@bbc.co.uk.",
        "Please include a contact number if you are willing to speak to a BBC journalist. You can also get in touch in the following ways:",
        "WhatsApp: +44 7756 165803Tweet: @BBC_HaveYourSayPlease read our terms & conditions and privacy policy"
    ];

    if (ignoreTexts.indexOf(text) > -1) return false;
    return true;
}

function getDivContent(div) {
    var childContent = '';
    $(div).children().each(function () {
        if ($(this).is('p') || $(this).is('ul')) {
            var text = '';
            if ($(this).is('ul')) {
                $(this).children().each(function () {
                    text += $(this).text().trim();
                });
            } else {
                text = $(this).text().trim();
            }
            if (!shouldIncludeText(text)) return;
            childContent += text;

            $(this).addClass('addBorder');
        }
    });
    return childContent;
}


$(function () {
    init();
});
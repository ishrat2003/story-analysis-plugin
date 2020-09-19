function showRaw(data){
    $('#lcRaw').html('');
    $('#lcRaw').append(getProperNoun(data['proper_noun']));
    $('#lcRaw').append('<br class="clear"><br class="clear">');
    $('#lcRaw').append(getWords(data['noun'], 'Noun'));
    $('#lcRaw').append('<br class="clear"><br class="clear">');
    $('#lcRaw').append(getWords(data['adjective'], 'Adjective'));
    $('#lcRaw').append('<br class="clear"><br class="clear">');
    $('#lcRaw').append(getWords(data['adverb'], 'Adverb'));
    $('#lcRaw').append('<br class="clear"><br class="clear">');
    $('#lcRaw').append(getWords(data['verb'], 'Verb'));
    $('#lcRaw').append('<br class="clear"><br class="clear">');
    $('#lcRaw').append(getWords(data['positive'], 'Positive'));
    $('#lcRaw').append('<br class="clear"><br class="clear">');
    $('#lcRaw').append(getWords(data['negative'], 'Negative'));
    $('#lcRaw').append('<br class="clear"><br class="clear">');

    $('.storyWordCategory span').on('click', function(){
        var tabId = $( "#container" ).data( "tabid");
        chrome.tabs.sendMessage(tabId, {type: "storyHighlightContent", text: $(this).text()});
        console.log('sending message: storyHighlightContent');
    })
}

function getProperNoun(items){
    html = '<div class="storyWordCategory">'
    html += '<h3  class="properNoun">Proper Nouns</h3>';
    html += '<div class="properNoun">';
    divider = '';
    items.forEach(item => {
        html += divider + '<span>' + item + '</span>';
        divider = ', ';
    });
    html += '</div>';
    html += '</div>';
    return html;
}

function getWords(items, className){
    if(!items) return;

    html = '<div class="storyWordCategory">'
    html += '<h3 class="' + className.toLowerCase() + '">' + className + '</h3>';
    html += '<div class="' + className.toLowerCase() + '">';

    divider = '';
    items.forEach(item => {
        html += divider + '<span>' + item['pure_word'] + '</span> (' + item['count'] + ')';
        divider = ', ';
    });

    html += '</div>';
    html += '</div>';
    return html;
}
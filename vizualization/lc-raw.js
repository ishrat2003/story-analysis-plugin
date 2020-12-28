function showRaw(data){
    console.log(data)
    $('#lcRaw, #lcRawTop').html('');
    $('#lcRawTop').prepend('<h3>' + data['concepts']['story_what_about'] + ' <a href="#lcRawBlock">Check extracted concepts</a></h3>');
    
    $('#lcRaw').append(getProperNoun(data['concepts']['topic_words'], 'Topics'));
    $('#lcRaw').append('<br class="clear"><br class="clear">');

    //$('#lcRaw').append(getProperNoun(data['concepts']['proper_nouns'], 'Proper Nouns'));
    // $('#lcRaw').append('<br class="clear"><br class="clear">');

    // $('#lcRaw').append(getWords(data['noun'], 'Noun'));
    // $('#lcRaw').append('<br class="clear"><br class="clear">');
    // $('#lcRaw').append(getWords(data['adjective'], 'Adjective'));
    // $('#lcRaw').append('<br class="clear"><br class="clear">');
    // $('#lcRaw').append(getWords(data['adverb'], 'Adverb'));
    // $('#lcRaw').append('<br class="clear"><br class="clear">');
    // $('#lcRaw').append(getWords(data['verb'], 'Verb'));
    // $('#lcRaw').append('<br class="clear"><br class="clear">');

    if (data['concepts']['categories']['Person']) {
        $('#lcRaw').append(getCategoryWords(data['concepts']['categories']['Person'], 'Person'));
    }

    if (data['concepts']['categories']['Location']) {
        $('#lcRaw').append(getCategoryWords(data['concepts']['categories']['Location'], 'Location'));
    }

    if (data['concepts']['categories']['Organization']) {
        $('#lcRaw').append(getCategoryWords(data['concepts']['categories']['Organization'], 'Organization'));
    }

    if (data['concepts']['categories']['Time']) {
        $('#lcRaw').append(getCategoryWords(data['concepts']['categories']['Time'], 'Time'));
    }

    if (data['concepts']['categories']['Others']) {
        $('#lcRaw').append(getCategoryWords(data['concepts']['categories']['Others'], 'Others'));
    }

    if (data['concepts']['sentiment']['positive']) {
        $('#lcRaw').append(getCategoryWords(data['concepts']['sentiment']['positive'], 'Positive'));
    }

    if (data['concepts']['sentiment']['negative']) {
        $('#lcRaw').append(getCategoryWords(data['concepts']['sentiment']['negative'], 'Negative'));
    }

    $('.storyWordCategory span').on('click', function(){
        var tabId = $( "#container" ).data( "tabid");
        chrome.tabs.sendMessage(tabId, {type: "storyHighlightContent", text: $(this).text()});
        console.log('sending message: storyHighlightContent');
    })
}

function getProperNoun(items, title){
    html = '<div class="storyWordCategory">'
    html += '<h3  class="properNoun">' + title + '</h3>';
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

function getCategoryWords(items, className){
    if(!items) return;

    html = '<div class="storyWordCategory">'
    html += '<h3 class="' + className.toLowerCase() + '">' + className + '</h3>';
    html += '<div class="' + className.toLowerCase() + '">';

    divider = '';
    items.forEach(item => {
        html += divider + '<span>' + item + '</span>';
        divider = ', ';
    });

    html += '</div>';
    html += '</div>';
    return html;
}
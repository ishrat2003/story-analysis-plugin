$(function(){
    console.log('--- Running in page.js ---');
    var content = $("div.story-body").text();
    $('#lcStoryLoading').text(content);
    // do your business here
  });
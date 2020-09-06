$(function(){
    $('#local').show();
    
    $('.tablinks').on('click', function(){
        $('.tabcontent').hide();
        var divId = '#' + $(this).data('divid');
        console.log(divId);
        $(divId).show();
    });
});
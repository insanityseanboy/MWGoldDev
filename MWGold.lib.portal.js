function rearrangeEntry () {  $.get(knownURLS["portalURL"], function (data){rearrangePortal( $('<div/>').html(data).contents() );});}
function rearrangePortal(data){
    // move the 'My Games' thing
    $(data).find('#forumhome_forumlist > li:first').css('margin-right','0').after('<li id="portalBox0" style="height: 120px; margin-right: 0px;"></li>');
    var someshit = "";
    $(data).find('#forumhome_forumlist + div').children(':eq(1)').children().each(function (){ someshit+=$(this).html()+"<br/>"; });
    $(data).find('#portalBox0').attr('class','col span-1').css('padding','5px').append( "<h3><a>"+$(data).find('#forumhome_forumlist + div').children(':eq(0)').html()+"</a></h3>" ).append( "<div>"+someshit+"</div>" ); 
    $(data).find('#forumhome_forumlist + div').remove();

    // put everything in one grid
    log('fucking with children');
    var boxNo=2, dragQueen={ snap: true, stop:function(event,ui){log('entry for '+event.target.id);saveVal('pos_'+event.target.id, 
        {top: $('#'+event.target.id).css('top'), left: $('#'+event.target.id).css('left')});}};

    $(data).find('#forumhome_forumlist').attr('class','col span-6').children('li:gt(1)').each(function (){
        $(this).attr('class','col span-1').css('padding','5px').attr('id','portalBox'+boxNo);
        $(this).children(':eq(0)').attr('title',$(this).children(':eq(1)').html());
        $(this).children(':eq(1)').remove();
        $(this).children(':eq(1)').attr('class','smallfont').css('max-width','150').css('margin-left','15');
        $(this).children(':eq(1)').children('a').css('white-space','normal');
        boxNo++;
    });
    $(data).find('#forumhome_forumlist > li:first').attr('id','portalBox1').css('padding','5px').attr('class','col span-1').children(':eq(1)').attr('class','smallfont').css('max-width','150').css('margin-left','15').children('a').css('white-space','normal');
    log('done: returning: '+boxNo);
    for (var x=0;x<boxNo;x++) 
    {
        if (!$('#portalBox'+x).length) continue;
        var pos = loadVal('pos_portalBox'+x,null);
        var size = loadVal('size_portalBox'+x,null);
        if (pos) $(data).find('#portalBox'+x).css('left',pos.left).css('top',pos.top);
        if (size) $(data).find('#portalBox'+x).css('height',size.height).css('width',size.width);
        if ($('#resizeStuff').is(':checked')) $(data).find('#portalBox'+x).attr('class','col span-1 ui-widget-content').resizable({stop:function(event,ui){log('entry for '+event.target.id);saveVal('size_'+event.target.id, 
            {width: $('#'+event.target.id).css('width'), height: $('#'+event.target.id).css('height')});}}).css('background','transparent');
        $(data).find('#portalBox'+x).draggable(dragQueen);//.css('display','inline-block');
        $('#portalBox'+x).replaceWith($(data).find('#portalBox'+x));
    }
}
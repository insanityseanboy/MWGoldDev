function refreshStuff() { 
    setInterval(refreshShit, 45000);
    setInterval(fillInFriends, 55000);
    if (siteIs('portalURL') && toggleHash["Rearrange front page"])    setInterval(rearrangeEntry, 40000);
    if (siteIs('showThreadURL') ||siteIs('newReplyURL') ||siteIs('editPostURL'))    setInterval(detectNinjas, 35000);
}
function detectNinjas()
{
    var threadID = getThreadID();
    var forumURL = $('#breadcrumb li:last').prev().find('a[href^=http]').attr('href');
    //log('thread: '+threadID+' and forum: '+forumURL);
    $.get(forumURL + " #td_threadstatusicon_"+threadID, function _checkNewMessage(data) {
        var whichImage = $(data).find('img').attr('src');
        //log('found: '+whichImage+' but want: '+staticNewMessageImage);
        if (whichImage==staticNewMessageImage&&$('#newMessageITTAlert').length<1)
        {
            log('****** ninja detected! ******');
            // $('<div id="newMessageITTAlert" class="alert alert-warning fade in"><button class="close" data-dismiss="alert">x</button><strong>There is a new message in this thread</strong></div>').appendTo('body').alert();
            $('<div title="Ninja detected!" id="newMessageITTAlert"><strong>There is a new message in this thread.</strong></div>').appendTo('body');
            $('#newMessageITTAlert').dialog({position: { my: "right top", at: "right top", of: $('#headerContainer')[0] }});
            $('div.ui-dialog[aria-describedBy=newMessageITTAlert]').css('position','fixed');
        }
    });
}
function notifyInUserCPButton (data) { 
    var newMessageCount = ($(data).find('#threadslist')?$(data).find('#threadslist').children().length:0)+($(data).find('#collapseobj_usercp_pms')?$(data).find('#collapseobj_usercp_pms').children().length:0);
    $('a[href="'+knownURLS["userCPURL"]+'"]').html("User CP <b>("+newMessageCount+")</b>");

    // audio notifications
    if (!toggleHash["Audio notify when new messages are received"]) return;//siteIs("userCPURL") || 
    newMessagesLastTime = loadVal('newMessagesLastTime',0);
    if (toggleHash["Remind me of unread messages"]) newMessagesLastTime = 0;
    if (newMessageCount>newMessagesLastTime) {
        $.titleAlert(newMessageCount+" new messages",{interval:500});//duration:10000, 
        makeSomeNoise();}
    newMessagesLastTime = newMessageCount;
    saveVal('newMessagesLastTime',newMessagesLastTime);
}
function getAllPeeps () { if (toggleHash["Show who is browsing subscribed games"] && (siteIs("userCPURL") || siteIs("portalURL"))) 
                          for (var link in subscribedForumLinks) {getPeepsInThatGame(subscribedForumLinks[link]);}}
function getPeepsInThatGame(link) {
    $.get(link, 
        function(data)
        {
            var thisGame = link.split('=')[1]; 
            var listOfPeeps = $(data).find('div.smallfont.col > span.smallfont').html().replace(/(\n|\+)/g,'').split(',');
            if (listOfPeeps.length>1) log("link: "+link+" found peeps: "+JSON.stringify(listOfPeeps));
            for (var peep in listOfPeeps) {
                if (listOfPeeps[peep].includes(uName)) 
                    {listOfPeeps[peep]=null; listOfPeeps = cleanArray(listOfPeeps); break;}}
            
            var parental;
            if (siteIs("portalURL")) 
                parental = $('img[src="http://static.myth-weavers.com/images/sonata/statusicon/subforum_old.gif"]').parent().find('a[href="'+link+'"]')[0];
            else
                parental = $('#collapseobj_usercp_forums > tr[align!="center"] > td > a[href="'+link+'"]')[0];
            if (listOfPeeps.length>0)
                $(parental).after("<br /><a hidden id='MWGoldPeeps_"+thisGame+"' style='padding-left:10px' class='smallfont'>Browsing: "+listOfPeeps.join(", ")+"</a>");
            else
                $(parental).after("<br /><a hidden id='MWGoldPeeps_"+thisGame+"' style='padding-left:10px' class='smallfont'>Empty</a>");
            
            $('#MWGoldPeeps_'+thisGame).fadeIn();
        }
    );}
function refreshShit () { $.get(knownURLS["userCPURL"], function(data){
    var storedTime = $('#timenow').children().attr('title');
    for (var s in refreshThisStuff) {
        if (s=="#timenow"&&!toggleHash["Keep time current"]) continue;
        $(refreshThisStuff[s]).html($(data).find(refreshThisStuff[s]).html());
    }
    $('#timenow').children().attr("title",storedTime);
    if ($(data).find('#threadslist').length>0 || $(data).find('#collapseobj_usercp_pms').length>0) 
    {
        if (siteIs("userCPURL"))
        {
            $('#collapseobj_usercp_forums').parents('td').html( $(data).find('#threadslist').parents('td').html() );
            if ($('#collapseobj_usercp_pms').length>0&&$(data).find('#collapseobj_usercp_pms').length>0)
                $('#collapseobj_usercp_pms').html( $(data).find('#collapseobj_usercp_pms').html() );
            else if ($(data).find('#collapseobj_usercp_pms').length>0)
                $('#collapseobj_usercp_forums').parents('td').prepend( $(data).find('#collapseobj_usercp_pms').parents('table')[0].outerHTML );
        }
    } 
    notifyInUserCPButton(data);    }).promise().done(function () {if (siteIs("userCPURL")) {getAllPeeps(); printPinnedThreads();}
                                        if ($('#threadslist').length>0) improveThreads();
                                        if (toggleHash["Widescreen"]) widescreen(loadVal('width',90));
                                        dejumpifyLinks();
                                    });}
function findOnlineFriends(data){
    var xyz = [];
    if (!uNum||$(data).find('#collapseobj_forumhome_activeusers').length<1) return xyz;
    var onlinePeeps = $(data).find('#collapseobj_forumhome_activeusers').find('a[href="member.php?'+uNum+'"]').parent().html().split(",");
    for (var peep in onlinePeeps) if (onlinePeeps[peep].indexOf("+")>-1) xyz.push(onlinePeeps[peep].replace(/\+/g,""));
    return xyz;}
function fillInFriends () { 
    if (toggleHash["Show online friends"]) 
        $.get(knownURLS['portalURL'], function(data){ 
            $('#social').html("<div id='socialFriends' style='color: #ffffcc' align='right'><b>Friends Online:</b> </div>");
            var curOnline = findOnlineFriends(data);
            $('#socialFriends').append( curOnline.join(', ').replace(/\<a/g,"<a style='color:#ffffcc'") );
            if (!onlineFriends) onlineFriends = loadVal('onlineFriends',{});
            for (var c in onlineFriends) {if (curOnline.includes(c)) continue;
                if (Date.now()-onlineFriends[c]>1800000) //half an hour in miliseconds
                    delete onlineFriends[c];
                else{var extra='';if ($('#socialFriends').children('a').length>0) extra=', ';
                    $('#socialFriends').append( extra+c.replace(/\<a/g,"<a style='color:#eeeeee'") );
                }
            }
            $('#socialFriends').append( "<span style='display: inline-block;width:10%'></span>" ); // spacer to not make it touch the search bar
            for (var c in curOnline) onlineFriends[curOnline[c]]=Date.now();
            saveVal('onlineFriends',onlineFriends);
});}
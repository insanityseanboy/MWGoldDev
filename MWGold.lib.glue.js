function getListofSheets(doPurge){
    if (doPurge) // remove all associated data
    {
        var list = GM_listValues();
        for (var k in list) if (list[k].startsWith("Sheet_")) {GM_deleteValue(list[k]);}
        //GM_deleteValue('loadedSheets');
        log("sheet content purged");
    }

    log("rescraping sheets...");
    $.ajax({
         async: false,
         type: 'GET',
         url: knownURLS['sheetListURL'],
         success: function(data){ var sH={};
            $(data).find('a[href*="sheet.html#id="]').each(function(){ 
                sH[$(this).html().trim()]=$(this).attr("href").toString().split("=")[1];
            });
            saveVal("sheetHash",(sH));
            }
        });

    log("storing sheet data... ");
    sheetHash = loadVal("sheetHash",null);

    if ($('#rescrapeSheets')) $('#rescrapeSheets').attr('title','Currently have: '+Object.keys(sheetHash).length+' characters');

    log("setting session data... "+Object.keys(sheetHash).length); }
function amnesia () { 
    var list = GM_listValues();
    for (var k in list) {
        GM_deleteValue(list[k]); 
        log("deleted: "+list[k]);
    } 
    log("memory wipe complete");
    location.reload();}
function selectiveAmnesia (start) { 
    var list = GM_listValues();
    for (var k in list) if (list[k].startsWith(start))
    {
        GM_deleteValue(list[k]); 
        log("deleted: "+list[k]);
    } 
    log("partial memory wipe complete");}
function forgetAnalyses () { 
    analysisHash = null;
    GM_deleteValue("analysisHash");
    log("all gone");}
    
function dejumpifyLinks(){// make links not jump to things
$('a[href*="showthread.php?p="]').each(function () {$(this).attr('href',$(this).attr('href').split('#')[0]);});
}

function putInWideButtonFieldset (title, theHash, buttonPrefix, fieldsetID, gameID) {
    $('#MWGoldCP').append("<fieldset id='"+fieldsetID+"' style='max-width: "+(gameID==null?168:500)+"px;'><legend style='color: "+(gameID==null?'#ffffcc':'#571a19')+"'>"+title+"</legend></fieldset>");

    var list;
    if (gameID==null) list = Object.keys(theHash); else list=Object.keys(theHash[gameID]);
    for (var k in list) {
        log("fieldsetID: "+fieldsetID+" & gameID: "+gameID+" & list[k]: "+list[k]+" & $('#'+fieldsetID):"+$('#'+fieldsetID));
        if ($('#'+fieldsetID).html().includes("button")&&gameID==null)
            $('#'+fieldsetID).append("<br />");
        $('#'+fieldsetID).append("<button id='"+buttonPrefix+list[k].replace(/[^a-z]/gi,'')+"' data-key='"+list[k]+"' class='smallfont'>Forget "+list[k]+"</button>");
        if (gameID==null){
            $('#'+buttonPrefix+list[k].replace(/[^a-z]/gi,'')).click(function (event){
                delete theHash[$('#'+event.target.id).attr('data-key')];
                saveVal("sitewideHash",(theHash));
                $(this).remove();
            });
        }else{
            $('#'+buttonPrefix+list[k].replace(/[^a-z]/gi,'')).click(function (event){
                delete theHash[gameID][$('#'+event.target.id).attr('data-key')];
                saveVal("gamewideHash",(theHash));
                $(this).remove();
            });
        }
    }}
function siteIs (url) { 
    if (url=="portalURL") return $(location).attr('href').endsWith(knownURLS["portalURL"]);//.split(/^[\/]*\/\//,'')
    else return $(location).attr('href').replace(/\.com\/\/+/g,'.com/').startsWith(knownURLS[url]);}
function makeSomeNoise(){
    if (!toggleHash["Audio notify when new messages are received"]) return;
    var newMessageURL = loadVal('newMessageURL',defaultNewMessageURL);
    if (newMessageURL=="") newMessageURL=defaultNewMessageURL;
    if($('#alertObject').length<1)
    {// style="display:none"
        $('body').append('<iframe id="alertObject" width="0" height="0" src="'+newMessageURL+'" frameborder="0" wmode="Opaque"></iframe>');
        log("created element: "+$('#alertObject')[0].outerHTML);
    } else if (newMessageURL!=$('#alertObject').attr('src')) $('#alertObject').attr('src',newMessageURL);
    if ($('#alertObject').length>0) {$('#alertObject')[0].play; log('played '+$('#alertObject').attr('src'));}}

function widescreen(width) { 
    $('div.page').css('width',width+'%'); 
    $('#headerShadow').css('width',(width>90?100:(width+10))+'%'); 
    $('#headerInner').css('width',width+'%');
    $('#menu_bar').css('width','100%');
    if ($('#poststop').length>0) $('#poststop').next('div').removeClass('span-5').css('width','100%');
    if (siteIs("portalURL")&&$('div.span-1').length>0) $('div.span-1').removeClass('span-1');
    if (siteIs("forumDisplayURL")&&$('div.span-1').length>0) $('div.span-1').removeClass('span-1').css('width','15%').css('margin-right','0px');
    if (siteIs("forumDisplayURL")&&$('.selectlist').length>0) $('.selectlist').css('width','100%').parent().css('margin-right','0px');
    if (siteIs("forumDisplayURL")&&$('div.span-4').length>0) $('div.span-4').removeClass('span-4').css('width','85%').css('margin-right','0px');
    if ($('.span-2').length>0) {$('div.span-2.smallfont').removeClass('span-2').css('width','25%').attr('align','right');
                                    $('h1.span-2').removeClass('span-2').css('width','50%').attr('align','left').css('margin-right','0px');}
    if ($('div.span-3').length>0) {$('div.span-3.smallfont').removeClass('span-3').css('width','70%').css('margin-right','5%');
                                    $('div.span-3').removeClass('span-3').css('width','50%').attr('align','right').css('margin-right','0px');}
    if ($('div.span-5').length>0) $('div.span-5').removeClass('span-5').css('width','100%');
    if ($('div.span-4').length>0) $('div.span-4').removeClass('span-4').css('width','100%');//siteIs("userCPURL")&&
    if (siteIs("userCPURL")&&$('#threadslist').length>0) $('#threadslist').parent().css('width','100%').prev().css('width','100%');
    if ($('#threadgroups').length>0) $('#threadgroups').css('width','').parent().css('margin-right','0px');
    if ($('#vB_Editor_QR').length>0&&widescreen_firstpass) $('#vB_Editor_QR').parent().css('width','80%').css('max-width','');
    if ($('#vB_Editor_001_textarea').length>0&&widescreen_firstpass) $('#vB_Editor_001_textarea').css('width','100%').css('max-width','');
    if ((siteIs("forumDisplayURL")||siteIs("newReplyURL")||siteIs("newThreadURL")||siteIs("editPostURL"))&&$('#vB_Editor_001').length>0&&widescreen_firstpass) $('#vB_Editor_001').parents('div[style="width:747px"]').css('width','100%').css('max-width','').end().parents('table').css('width','98%').css('background-color','lightgrey');
    widescreen_firstpass=false;
}//siteIs("forumDisplayURL")&&
function getMyGames()
{
    log("scraping games...");
    myGames={};
    $.ajax({
         async: false,
         type: 'GET',
         url: knownURLS['userCPURL'],
         success: function(data){ 
            $(data).find('#collapseobj_usercp_forums > tr > td:nth-child(2) > a:nth-child(1)').each(function(){ 
                log('spawning getter for '+$(this).text());
                $.ajax({
                     async: false,
                     type: 'GET',
                     url: $(this).attr('href'),
                     success: function(data){
                        if ($(data).find('#fd_game_links').children().length>2) {
                            myGames[($(data).find('#inlinemodform').attr('action').split('=')[1])]={name:$(data).find('#fd_game_links').next().find('h1:first').text(),pinnedPCs:{},pinnedNPCs:{}};
                            log('gameID: '+($(data).find('#inlinemodform').attr('action').split('=')[1])+' & name: '+$(data).find('#fd_game_links').next().find('h1:first').text());
                        }
                     } 
                });
            });
        }
    });
    saveVal('myGames',myGames);
}
function improveThreads()
{
    if ($('#threadslist').length>0&&$('.MWGoldThreadButtonContainer').length<1&&toggleHash['Add extra buttons to threads'])
    {
        // var started=new Date().getSeconds();
        var notTheDM=($('ul.buttonbar').length<3);
        $('#threadslist li').each(function () {
//            $(this).find('span:first').click(function () {
            var threadID = $(this).children('div[id]').attr('id').replace(/\D+/g,'');
            var wasSticky=$(this).find('span:first').text().includes('Sticky:');
            
            // log('made vars: '+((new Date().getSeconds())-started));
            // if it's already made, toggle that shiet
            // otherwise, make the container
            if (toggleHash['Widescreen']) $('#td_threadtitle_'+threadID).after('<div id="MWGoldThreadButtonContainer'+threadID+'" class="smallfont MWGoldThreadButtonContainer" style="position: absolute; right: 170px; width: 105px; top: 4px; white-space:nowrap"></div>')
            else {
                $(this).find('span:first').attr('id','MWGoldThreadButtonContainer'+threadID).addClass('smallfont MWGoldThreadButtonContainer');
                $('#MWGoldThreadButtonContainer'+threadID).html($('#MWGoldThreadButtonContainer'+threadID).html().replace(/Sticky: /g,(notTheDM?'Sticky: ':'')).replace(/^\s+<br>/,'').replace(/([^<]+?)\s*<br>/g,'$1 '));//|<br>
             }
            $('#MWGoldThreadButtonContainer'+threadID).attr('data-thread-id',threadID).css('font','').css('font','bold');

            // log('added container: '+((new Date().getSeconds())-started));
            // add to the container: a subscribe button
            if ($('#MWGoldSub'+threadID).length<1){
                if (!subbedThreads) subbedThreads=loadVal('subbedThreads',[]);
                
                $('#MWGoldThreadButtonContainer'+threadID).append((subbedThreads.includes(threadID)?'<span id="MWGoldSub'+threadID+'" class="MWGoldSub smallfont">Subbed</span>':printFauxButton('MWGoldSub'+threadID,'Sub','Subscribe to this thread')));
                // $('#MWGoldThreadButtonContainer'+threadID).append(printFauxButton('MWGoldSub'+threadID,(subbedThreads[threadID]?'Unsub':'Sub'),(subbedThreads[threadID]?'Subscribe to this thread':'Unsubscribe to this thread')));
            }

            // log('added sub button: '+((new Date().getSeconds())-started));
            // add to the container: a pin button
            if ($('#MWGoldPin'+threadID).length<1){
                if (!pinnedThreads) pinnedThreads=loadVal('pinnedThreads',{});
                $('#MWGoldThreadButtonContainer'+threadID).append(printFauxButton('MWGoldPin'+threadID,(pinnedThreads[threadID]?'Unpin':'Pin'),(pinnedThreads[threadID]?'Unpin this thread':'Pin this thread')));
                $('#MWGoldPin'+threadID).addClass('MWGoldPin');
            }

            // log('added pin button: '+((new Date().getSeconds())-started));
            // if you're not the GM, the rest of the buttons are useless
            if (notTheDM) return;
            // log('DM confirmed: '+((new Date().getSeconds())-started));

            // add to the container: a stick thread button
            if ($('#MWGoldStick'+threadID).length<1){
                if (wasSticky) $('#MWGoldSub'+threadID).before(printFauxButton('MWGoldStick'+threadID,'Stuck','Unstick this thread'));
                else $('#MWGoldSub'+threadID).before(printFauxButton('MWGoldStick'+threadID,'Stick','Stick this thread'));
                $('#MWGoldStick'+threadID).addClass('MWGoldStick');
            }});


        // add functionality to buttons
        // log('adding sub functionality: '+((new Date().getSeconds())-started));
        $('#threadslist li .MWGoldSub').click(function (){ subToThread( $(this).parent().attr('data-thread-id') ); });
        // log('adding pin functionality: '+((new Date().getSeconds())-started));
        $('#threadslist li .MWGoldPin').click(function (){ 
            var threadID = $(this).parent().attr('data-thread-id');
            if (!pinnedThreads) pinnedThreads=loadVal('pinnedThreads',{});
            if (!pinnedThreads[threadID]) pinnedThreads[threadID]=$('#td_threadtitle_'+threadID+' > a[id]').text(); else delete pinnedThreads[threadID];
            saveVal('pinnedThreads',pinnedThreads);
            $(this).text((pinnedThreads[threadID]?'Unpin':'Pin'));
            $(this).attr('title',(pinnedThreads[threadID]?'Unpin this thread':'Pin this thread'));
        });
        // log('adding stick functionality: '+((new Date().getSeconds())-started));
        $('#threadslist li .MWGoldStick').click(function (){
            var threadID = $(this).parent().attr('data-thread-id');
            log("getting: https://www.myth-weavers.com/showthread.php?t="+threadID);
            Promise.resolve($.post("https://www.myth-weavers.com/postings.php"+"?t="+threadID+"&pollid=",
                            {do:"stick",t:threadID,securitytoken:$('input[name=securitytoken]').val()})).then(function () {
                            $('#threadslist').load(location.href+' #threadslist');}).then(improveThreads);
        });
        // log('complete: '+((new Date().getSeconds())-started));
    }
}
function subToThread(threadID) {
    if (!threadID) return;
    log("subbing to: https://www.myth-weavers.com/showthread.php?t="+threadID); 
    if (!subbedThreads) subbedThreads=loadVal('subbedThreads',[]);
    if (!subbedThreads.includes(threadID)) {
        subbedThreads.push(threadID);saveVal('subbedThreads',subbedThreads);
        $.post("https://www.myth-weavers.com/subscription.php?do=doaddsubscription&threadid="+threadID,
        {do:"doaddsubscription",threadid:threadID,emailupdate:0,folderid:0,securitytoken:$('input[name=securitytoken]').val()});}
    else
    {
        // get the subscriptionID

        // $.post("http://www.myth-weavers.com/subscription.php?do=dostuff&folderid=0",
        // {do:"dostuff",what:'delete',deletebox[subID]:"yes",securitytoken:$('input[name=securitytoken]').val()});
    }
}
function printPinnedThreads(){
    if ($('#pinnedThreads').length>0) return;
    $('#collapseobj_usercp_forums').parent().siblings('table:last').attr('id','pinnedThreads');
    pinnedThreads=loadVal('pinnedThreads',{});
    for (var t in pinnedThreads) {
        if ($('#pinnedThreads > thead').length<1) $('#pinnedThreads').append('<thead><tr><td class="tcat" colspan="5"><a style="float:right" href="#top"><img src="https://static.myth-weavers.com/images/sonata/buttons/collapse_tcat.gif" alt="" border="0"></a>Pinned Threads</td></tr></thead>');
        $('#pinnedThreads > tbody').append("<tr><td class='alt2'> <a href='"+knownURLS["showThreadURL"]+"?t="+t+"'> "+pinnedThreads[t]+" </a> </td></tr>");
        $('#pinnedThreads > tbody > tr:last').append('<td>'+printFauxButton('pin_'+t+'_nickname','Nickname','Give this pin a nickname')+'</td>');
        $('#pin_'+t+'_nickname').click(function () {
            var text = prompt('What would you prefer to call '+$(this).parent().prev().text()+"?");
            $(this).parent().prev().find('a:first').text(text);
            pinnedThreads[$(this).attr('id').replace(/\D/g,'')]=text;
            saveVal('pinnedThreads',pinnedThreads);
        });
    }

}
function makeTabbable(url, id, attachTo) {
    if ($('#'+id).length<1){
        $(attachTo).after("<form id='"+id+"'><br/><br/><b>MW Gold: Loading...</b></form>");
        $.get(url, function (data) {
            $('#'+id).html($(data).find('#breadcrumb').parent().html());
            $('#'+id).addClass('subform').children(':lt(4)').remove();
            if (toggleHash["Widescreen"]) widescreen(loadVal('width',90));
            if (!toggleHash["Show footer"]) $('div[style="text-align: center; padding: 12px;"]').fadeOut().prev().html("<span style='width:100%'></span>");
            $('.ad_cs_link').remove();
            if (id=='GMScreenForm') pinShiz('#'+id);
        });
    }
    $('.subform').hide();
    $('#'+id).show();
}
function pinShiz(id)
{
    if (!myGames) myGames=loadVal('myGames',"");
    var gameID=$(location).attr('href').split('=')[1];

    if (myGames==""||!myGames[gameID]||(Object.keys(myGames[gameID]['pinnedNPCs']).length<1&&Object.keys(myGames[gameID]['pinnedPCs']).length<1)){
        $(id).append('<div class="tcat" style="padding-left: 10px">No Pinned Characters</div>','<div class="alt1" style="padding: 10px">Browse to some character sheets, click "configurate", and add them to this game.</div>');
    }else{
        var numPCs=Object.keys(myGames[gameID]['pinnedPCs']).length, numNPCs=Object.keys(myGames[gameID]['pinnedNPCs']).length;
        var i=1,max=Math.max(numNPCs,numPCs);

        $(id).find('form > div.alt1 > textarea').attr('id','theArea').css('width','100%').after('<fieldset id="MWGoldSweetShitContainer" style="width: 97%; min-height: 150px;"><legend>Dice roller</legend></fieldset>');
        $(id).children('form').after('<div class="tcat" style="padding-left: 10px">Pinned Characters</div>','<div class="alt1" style="padding: 10px"><table class="span-4"><thead><tr class="span-4"><th class="span-2">PCs</th><th class="span-2">NPCs</th></tr></thead><tbody id="pinnedCharsHead"></tbody></table></div>');
        for (;i<=max;i++)
            $('#pinnedCharsHead').append('<tr class="span-4"></tr>');

        if (numPCs>0){
            i=1;
            for (var pc in myGames[gameID]['pinnedPCs']) {
                insertPinnedChar('#pinnedCharsHead tr:nth-child('+(i++)+')',gameID,pc,true);

                $('#MWGoldSweetShitContainer').append("<fieldset><legend class='smalltext'>"+myGames[gameID]['pinnedPCs'][pc]+"</legend><div id='MWGoldSweetShitContainer_"+pc+"' style='display:inline-block;float:right'></div></fieldset>");
                log( 'printSweetShit result: '+printSweetShitNoCheck('#MWGoldSweetShitContainer_'+pc,'theArea',myGames[gameID]['pinnedPCs'][pc],pc,"\n"+myGames[gameID]['pinnedPCs'][pc]+": ",false) );
            }

        }else{ $('#pinnedCharsHead tr:first').append('<td class="span-2">None</td>');}

        // append empty cells so that the NPCs appear in the right column
        for (i=Math.max(numPCs+1,2);i<=max;i++) $('#pinnedCharsHead tr:nth-child('+i+')').append('<td class="span-2"></td>');

        if (numNPCs>0){
            i=1;
            for (var npc in myGames[gameID]['pinnedNPCs']) 
                {insertPinnedChar('#pinnedCharsHead tr:nth-child('+(i++)+')',gameID,npc,false);

                $('#MWGoldSweetShitContainer').append("<fieldset><legend class='smalltext'>"+myGames[gameID]['pinnedNPCs'][npc]+"</legend><div id='MWGoldSweetShitContainer_"+npc+"' style='display:inline-block;float:right'></div></fieldset>");
                log( 'printSweetShit result: '+printSweetShitNoCheck('#MWGoldSweetShitContainer_'+npc,'theArea',myGames[gameID]['pinnedNPCs'][npc],npc,"\n"+myGames[gameID]['pinnedNPCs'][npc]+": ",false) );

                $('#MWGoldSweetShitContainer_'+npc).parent().hide();
            }
        }else{ $('#pinnedCharsHead tr:first').append('<td class="span-2">None</td>'); }
        $('#pinnedCharsHead').find('input[type=checkbox]').change(function __checkboxPinCharToggle() {
            log('sheetID: '+$(this).val());
            $('#MWGoldSweetShitContainer_'+$(this).val()).parent().slideToggle();
        });
        clearBuffs();

        // now put in the junk for doing them all at once lololol
        $('#MWGoldSweetShitContainer').prepend("<div>Skills: <select style='max-width:50%' id='MWGoldSweetSkills_All'></select>"
            +" | Misc: <select style='max-width:50%' id='MWGoldSweetAttributes_All'></select></div>");
        var skillOptions={};
        $('#MWGoldSweetShitContainer select.MWGoldSweetSkills option').each(function () {skillOptions[$(this).text()]=1;});
        for (var o in skillOptions) $('#MWGoldSweetSkills_All').append("<option>"+o+"</option>");
        skillOptions={};
        $('#MWGoldSweetShitContainer select.MWGoldSweetAttributes option').each(function () {skillOptions[$(this).text()]=1;});
        for (var o in skillOptions) $('#MWGoldSweetAttributes_All').append("<option>"+o+"</option>");
        $('#MWGoldSweetSkills_All').change(function () {
            var t = $(this).val();
            $('#MWGoldSweetShitContainer fieldset:visible select.MWGoldSweetSkills option').each(function () {
                $(this).prop('selected',($(this).text()==t));
            });
            $('#MWGoldSweetShitContainer fieldset:visible select.MWGoldSweetSkills').change();
        });       
        $('#MWGoldSweetAttributes_All').change(function () {
            var t = $(this).val();
            $('#MWGoldSweetShitContainer fieldset:visible select.MWGoldSweetAttributes option').each(function () {
                $(this).prop('selected',($(this).text()==t));
            });
            $('#MWGoldSweetShitContainer fieldset:visible select.MWGoldSweetAttributes').change();
        });

}}
function insertPinnedChar(parentNode,gameID,sheetID,isPC)
{
    $(parentNode).append('<td class="span-2"><input value="'+sheetID+'" type="checkbox" '+(isPC?'checked="checked"':'')+'> <a href="'
        +knownURLS['sheetURL']+sheetID+'">'+myGames[gameID]['pinned'+(isPC?'':'N')+'PCs'][sheetID]+'</a><span data-isPC="'+isPC+'" data-sheetID="'
        +sheetID+'" id="'+sheetID+'_controls" style="display:inline-block;float:right">'
        +printFauxButton('unpin_'+sheetID,'Unpin','Upin this sheet from this game')+'</span></td>');
    $('#unpin_'+sheetID).click(function () {
        var isPC=($(this).parent().attr('data-isPC')=='true'), sheetID=$(this).parent().attr('data-sheetID');
        log('Unpinned '+(isPC?'':'N')+'PC with sheetID:'+sheetID);
        delete myGames[gameID]['pinned'+(isPC?'':'N')+'PCs'][sheetID];
        saveVal('myGames',myGames);
        $(this).parent().parent().html("");
        $('#MWGoldSweetShitContainer_'+sheetID).parent().remove();
    });
}
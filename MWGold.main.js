
function makeAwesome(){
    // add some style to this bitch   //"https//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">'); // .MWGoldThreadButtonContainer {background:#eeeeee}
    $('head').append('<link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.12.1/themes/pepper-grinder/jquery-ui.css">');
    $('head').append('<style>.subbed{background:#eeeeee;background-position: center; background-repeat: no-repeat;}  .codeline {font-family:Georgia, Times, serif;color:purple}</style>');//;background-color:#d8da3d
    if (!toggleHash) toggleHash = loadVal("toggleHash",toggleDefaults);
    if (Object.keys(toggleHash).length<Object.keys(toggleDefaults).length) toggleHash = toggleDefaults;

    if (!siteIs("sheetURL")){

    // set the shit we need set
    if ($('a[title="Your Profile"]').length>0){
        uNum  = $('a[title="Your Profile"]').attr('href').toString().split("?")[1]; 
        uName = $('a[title="Your Profile"]').html();
        $('#timenow').children().attr("title","Page loaded: "+$('#timenow').children().html()+", "+$('#timenow').children().attr("title"));

        // *try* to create the sheetHash (shit always fails this early)
        sheetHash = loadVal("sheetHash",null);
        if (!sheetHash) {getListofSheets(false);}
        if (!analysisHash) analysisHash = loadVal("analysisHash",{});
//    }else if ($('a[href*="member.php?u="]').length>0){

    }else{log("Error: Could not find profile button");}

    // do page specific stuff
    if (siteIs("userCPURL")) {
        notifyInUserCPButton($('#threadslist').parent()); // update the UserCP button contents

        // replace silly useless box with Gold controls
        $('td.tcat:first').attr('id','MWGoldCP').css('max-width','168px').css('background-size','cover').html("").parents('table.tborder tbody').children(':gt(0)').addClass('junk').hide();
        $('#MWGoldCP').append("<fieldset id='MWGoldCPToggles'><legend style='color: #ffffcc'>MW Gold: Options</legend>"
            +"<div class='alt2' id='showToggles'></div>"
            +"<center><button id='showTheToggles' title='Display display options' class='button'>Show show options</button></center>"
            +"<div class='alt2' id='showTogglesList' hidden></div>"
            +"</fieldset>").parent().before("<tr><td class='button' id='showJunk'><center>Show regular shite</center></td></tr>");
        $('#showJunk').click(function () {if ($('#MWGoldCP').is(':hidden')) {$('#MWGoldCP').toggle();$('.junk').toggle();$('#showJunk').html('<center>Show regular shite</center>');}
                                          else {$('#MWGoldCP').toggle();$('.junk').toggle();$('#showJunk').html('<center>Show Gold control panel</center>');}});
        $('#showTheToggles').css('max-width','100%').css('color','black');
        for (var key in toggleHash) {
            if (key.startsWith("Widescreen")) continue;
            if (sheetToggleList.includes(key)) continue;
            var theStuff = "<input id='MWGold"+key.replace(/[^a-z]/gi,'')+"' data-key='"+key+"' type='checkbox' "+((toggleHash[key]) ? "checked" : "")+"/><a title='"+key+"' style='color: #ffffcc' class='smallfont'>"+(key.length>23?key.substr(0,20)+"...":key)+"</a><br />";
            if (key.startsWith("Show ")) $('#showTogglesList').append(theStuff);
            else    $('#showToggles').before(theStuff);
            $('#MWGold'+key.replace(/[^a-z]/gi,'')).change(function (event){
                toggleHash[$('#'+event.target.id).attr('data-key')]=$('#'+event.target.id).is(':checked');
                saveVal("toggleHash",(toggleHash));
                putAnAlertSomewhere('Changes saved<br/>Refresh to see them','#MWGoldCPToggles');
            });
        }
        var newMessageURL = loadVal('newMessageURL',defaultNewMessageURL);
        var namf=newMessageURL.split('/').slice(-1)[0];    if (!namf||namf=="") namf=newMessageURL;
        $("#MWGoldAudionotifywhennewmessagesarereceived").next().after("<br/>Notification sound:<br/><a id='changeSound'>"+(namf.length>23?namf.substr(0,20)+"...":namf)+"</a>");
        $('#changeSound').click(function () {
            if ($('#newSound').length>0) return;
            $('#changeSound').html("<input type='textbox' id='newSound' value='"+newMessageURL+"'/>");
            $('#newSound').keypress(function (e){if (e.keyCode==13) {$(this).blur();return false;}});
            $('#newSound').blur(function () {
                newMessageURL=$(this).val();
                if (!newMessageURL||newMessageURL=="") newMessageURL=defaultNewMessageURL; 
                saveVal('newMessageURL',newMessageURL);
                var cut = newMessageURL.split('/').slice(-1)[0];
                $('#changeSound').html((cut.length>23?cut.substr(0,20)+"...":cut));
                $(this).remove();
                });});
        $('#showTheToggles').click(function () {
            if ($('#showTogglesList').is(':hidden')) {$('#showTogglesList').slideDown(); $('#showTheToggles').html("No show show options");}
            else {$('#showTogglesList').slideUp(); $('#showTheToggles').html("Show show options");}
        });

        // pinned Threads logic
        printPinnedThreads();

        // rescrape sheets and amnesia buttons
        $('#MWGoldCP').append("<hr /><input id='MWGoldWidescreen' data-key='Widescreen' type='checkbox' "+((toggleHash["Widescreen"]||toggleHash["WidescreenPortal"]) ? "checked" : "")+"/><a title='Enable widescreen on Myth-Weavers' style='color: #ffffcc' class='smallfont'>Enable Widescreen</a><br />"
            +"<div id='widescreenBiz' "+((toggleHash["Widescreen"]||toggleHash["WidescreenPortal"]) ? "" : "hidden")+"><input id='MWGoldWidescreenPortal' data-key='WidescreenPortal' type='checkbox' "+((toggleHash["WidescreenPortal"]&&!toggleHash["Widescreen"]) ? "checked" : "")+"/><a title='Only enable widescreen on the Myth-Weavers portal/main page' style='color: #ffffcc' class='smallfont'>Only on portal</a>"
            +"<br />Widescreen %: <input type='textarea' style='width:30px' id='widthVal' title='Type a whole number between 1 and 100' value='"+loadVal('width',90)+"' /></div>"
            +"<hr/><center><button id='showForgetStuff' title='Display display options' class='button'>Show buttons of forgetting</button></center>"
            +"<br class='stuff' /><button class='stuff' title='Currently have: "+(sheetHash?Object.keys(sheetHash).length:0)+" characters' id='rescrapeSheets'>Refresh character list</button>"
            +"<br class='stuff' /><button class='stuff' title='Forget all analysis data' id='forgetAnalyses'>Forget analyses</button>"
            +"<br class='stuff' /><button class='stuff' title='CAUTION: Will forget everything! Analyses, loaded sheets, stored spell lists and backpacks, recorded images, saved templates, preferences - everything!' id='totalAmnesia'>Forget all data</button>");
        $('#showForgetStuff').click(function () {$('.stuff').slideToggle();});
        // widescreen part of menu
        $('#MWGoldWidescreen').change(function (event){
            var val = $('#'+event.target.id).is(':checked');
            toggleHash["Widescreen"]=val&&!($('#MWGoldWidescreenPortal').is(':checked'));
            if (!val) toggleHash["WidescreenPortal"]=false;
     
            saveVal("toggleHash",(toggleHash));
            if (val) $('#widescreenBiz').slideDown(); else $('#widescreenBiz').slideUp();
        });
        $('#MWGoldWidescreenPortal').change(function (event){
            var val = $('#'+event.target.id).is(':checked');
            toggleHash["Widescreen"]=!val;
            toggleHash["WidescreenPortal"]=true;
            saveVal("toggleHash",(toggleHash));
        });
        $('#widthVal').blur(function () {
            var wUser = parseInt($('#widthVal').val());
            if (isNaN(wUser) || wUser>100 || wUser < 0) putAnAlertSomewhere('Invalid width','#widescreenBiz');
            else {saveVal('width',wUser); if (toggleHash["Widescreen"]) widescreen(wUser);}
        });

        // memory management part of menu
        $('#rescrapeSheets').click(function () {getListofSheets(true);});
        $('#totalAmnesia').click(amnesia);
        $('#forgetAnalyses').click(forgetAnalyses);

        // fill sitewide buttons, if any.
        if (toggleHash["Show site-wide templates"]){
            if (!sitewideHash) sitewideHash = loadVal("sitewideHash",{});
            if (Object.keys(sitewideHash).length>0)
            {
                putInWideButtonFieldset("Site-wide templates", sitewideHash, "MWGoldSitewide", "MWGoldCPDeleteSitewides", null);
                $('#MWGoldCPDeleteSitewides').addClass('stuff');
            }
        }

        // fill loaded sheet forgetters, if any.
        if (!loadedSheets) loadedSheets = loadVal("loadedSheets",null);
        if (loadedSheets)
        {
            $('#MWGoldCP').append("<fieldset class='stuff' id='loadedSheets'><legend style='color: #ffffcc'>Loaded characters</legend></fieldset>");
            for (var name in loadedSheets)
            {
                var nam = name; if (nam.length>9) nam=name.substr(0,6)+"...";
                $('#loadedSheets').append( printFauxButton("sheet"+loadedSheets[name],"Forget "+nam,name.replace(/'/,'`')+"\nWill forget all memory of this sheet (will NOT delete the sheet itself; you will just need to click the \"Load to MW\" button on the sheet again)") +"<br/>");
                $('#sheet'+loadedSheets[name]).css('color','#000000').attr('data-name',name).click(function () {
                    var n = $(this).attr('data-name');
                    delete loadedSheets[n];
                    saveVal('loadedSheets',loadedSheets);
                    $(this).remove();
                });
            }
        }
        $('.stuff').toggle();
        // find subscribed forums to scrape
        subscribedForumLinks = [];
        $('#collapseobj_usercp_forums > tr[align!="center"] > td:nth-child(2) > a[href*="'+knownURLS["forumDisplayURL"]+'"]').each(function()
        {
            subscribedForumLinks.push( $(this).attr('href').replace(/^\/\//,'https://') );
        });
            
        //log("subscribedForumLinks="+JSON.stringify(subscribedForumLinks));
        getAllPeeps();}
    else if (siteIs("showThreadURL"))  {addEditorButtons('vB_Editor_QR_textarea','vB_Editor_QR');
        var threadID = getThreadID();
        var mutedColours=loadVal('mutedColours',{});

        // fiddle with sub button
        if (!subbedThreads) subbedThreads=loadVal('subbedThreads',[]);
        if (subbedThreads.length<1) $.get("https://www.myth-weavers.com/subscription.php?do=viewsubscription&folderid=all&pp=200", function (data) {
            $(data).find('#threadslist li').each(function () {subbedThreads.push( $(this).find('div[id]').attr('id').replace(/^\D+/g,'') );}).promise().done(function () {saveVal('subbedThreads',subbedThreads);
            });}); else if (subbedThreads.includes(threadID)) $('ul.buttonbar > li > a[href*="subscription.php"]').addClass('subbed');
        $('ul.buttonbar > li > a[href*="subscription.php"]').attr('href','javascript:void(0)').click(function () {
            subToThread( getThreadID() );
            $(this).addClass('subbed');
        });

        // hide sigs
        if (toggleHash["Hide signatures"]) {$('.signature').hide(); 
            $('.signature:parent').prev('div.postFooterRule').css('margin-right','180px'); 
            $('.signature:parent').prev().prev().prepend("<a href='javascript:void(0)'>Sig</a>"); 
            $('.signature:parent').prev().prev().children('a:nth-child(1)').click(function () {$(this).parent().next().next().toggle();});}

        // post controls
        $('#posts > div').each(function () {
            var poster = $(this).find('div.userMenu ul li a.bigusername').text();
            $(this).find('div.postControlsTop').prepend('<a href="javascript: void(0)" class="GoldPostControlsController" style="min-width:15px;min-height:15px; background-repeat:no-repeat;background-image:url(http://i.imgur.com/TxZ3RPe.png)"></a>');
            $(this).find('div.postControlsTop').prepend('<a href="javascript: void(0)" class="filterByPoster GoldPostControls" hidden data-poster="'+poster+'" title="Show only this person\'s posts">Only</a>');
            $(this).find('div.postControlsTop').prepend('<a href="javascript: void(0)" class="hidePoster GoldPostControls" hidden data-poster="'+poster+'" title="Hide this person\'s posts">Exclude</a>');
            $(this).find('div.postControlsTop').prepend('<a href="javascript: void(0)" class="showAll GoldPostControls" hidden title="Show all posts">All</a>');
            $(this).find('div.postControlsTop').prepend('<a href="javascript: void(0)" class="decolourify GoldPostControls" hidden title="Blacken coloured text from this post">Decolourify</a>');
        });
        $('a.GoldPostControlsController').click(function __showControls(){$(this).siblings('a.GoldPostControls').slideToggle();});
        $('a.decolourify').click(function __decolourify() {
            var fontTags = $(this).parents('div.postHeader').siblings('div.postContent').find('font[color]');
            var colours={};
            var black = prompt('What would you like the replacement colour to be?','black');
            fontTags.each(function () {colours[$(this).attr('color')]=black;});
            fontTags.attr('color',black);
            for (var x in colours) mutedColours[x]=black;//colours[x]
            saveVal('mutedColours',mutedColours);
        });
        $('font[color]').each(function () {
            if (mutedColours[$(this).attr('color')]) $(this).attr('color',mutedColours[$(this).attr('color')]);
        });
        $('a.showAll').click(function __showAll() {
            $('#posts > div').show();
        });
        $('a.hidePoster').click(function __hideByPoster() {
            var poster = $(this).attr('data-poster');
            $('#posts > div').each(function () {
                 //$(this).show();
                 if ($(this).find('div.userMenu ul li a.bigusername').text()==poster) $(this).hide();
        });});
        $('a.filterByPoster').click(function __filterByPoster() {
            var poster = $(this).attr('data-poster');
            $('#posts > div').each(function () {
                 $(this).hide();
                 if ($(this).find('div.userMenu ul li a.bigusername').text()==poster) $(this).show();
        });});
        
        // hide footer: this is slightly different in showThread for some reason
        if (toggleHash["Show footer"]) $('img[src="https://static.myth-weavers.com/images/sonata2/social_fb.png"]:last').parents('div').fadeOut().prev().html("<span style='width:100%'></span>");

        // keep an eye out for new editor areas
        // var initCount = $('.vBulletin_editor').length;
        // var observer = new MutationObserver(function(mutations) {
        //     if ($('body').find('.vBulletin_editor').length>initCount)
        //     {
        //         log('new editor found: firing: addEditorButtons with '+initCount);
        //         addEditorButtons('vB_Editor_'+initCount+'_textarea','vB_Editor_QE_'+initCount+'_editor');
        //         initCount = $('.vBulletin_editor').length;
        //         //observer.disconnect();
        // }});
        // observer.observe($('body')[0], { childList: true });


        // analysis junk
        if (toggleHash["Show past thread analyses"])   printThreadAnalysis(threadID);

        $('ul.buttonbar:first').prepend('<li><a id="Analyse'+threadID+'" data-thread-id="'+threadID+'" style="background-image: url(http://i.imgur.com/HUJwQHf.jpg)" title="Analyse Posting Stats"></a></li>');
        $('#Analyse'+threadID).click(analyseThread);
        if (toggleHash["Auto-analyse thread on thread visit"] && (!analysisHash["Threads"] || !analysisHash["Threads"][threadID])) analyseThread();}
    else if (siteIs("newReplyURL")) {addEditorButtons('vB_Editor_001_textarea','vB_Editor_001');}
    else if (siteIs("editPostURL")) {addEditorButtons('vB_Editor_001_textarea','vB_Editor_001');}
    else if (siteIs("newThreadURL")) {addEditorButtons('vB_Editor_001_textarea','vB_Editor_001');}
    else if (siteIs("forumDisplayURL")) {
        refreshThisStuff.push('#inlinemodform','div.col:nth-child(10)'); // keep the threads and folders fresh  '#threadslist',

        // make the tabs load in the same page
        var linkToGameProfile = $('#gameprofileuri').attr('href');
        $('#gameprofileuri').hide();
        $('#fd_game_links').prepend("<a id='loadGameForum'>Game Forum</a>");
        $('#fd_game_links').prepend("<a id='loadGameProfile'>Game Profile</a>");
        $('#inlinemodform').addClass('subform');

        var gameID = $(location).attr('href').split('=')[1];
        if ($('#fd_game_links a[href*="www.myth-weavers.com/gmscreen.php?g="]').length>0) 
        {
            $('#fd_game_links a[href*="www.myth-weavers.com/gmscreen.php?g="]').hide();
            $('#fd_game_links a[href*="do=editinfo"]').hide();
            var linkToGMPanel = $('#fd_game_links a[href*="www.myth-weavers.com/gmscreen.php?g="]').attr('href');
            var linkToEditGame = $('#fd_game_links a[href*="do=editinfo"]').attr('href');
            $('#loadGameForum').after('<a id="loadEditGame">Edit Game</a>');
            $('#loadGameForum').after('<a id="loadGMScreen">GM Screen</a>');
            $('#loadEditGame').click(function () {makeTabbable(linkToEditGame,'editGameForm','#inlinemodform');});
            $('#loadGMScreen').click(function () {makeTabbable(linkToGMPanel,'GMScreenForm','#inlinemodform');});

            if (!myGames) myGames=loadVal('myGames',{});
            if (!myGames[gameID]) myGames[gameID]={name:$('#fd_game_links').next().find('h1:first').text(),pinnedPCs:{},pinnedNPCs:{}};
        }

        $('#loadGameForum').click(function () {
            $('.subform').hide();
            $('#inlinemodform').show();
        });    
        $('#loadGameProfile').click(function () {makeTabbable(linkToGameProfile,'gameProfileForm','#inlinemodform');});

        if (gameID && toggleHash["Show game-wide templates"])
        {
            // make MWGoldCP
            $('#threadgroups').after("<br style='height:7px'/><div id='MWGoldCP'></div>");

            // fill sitewide buttons, if any.
            if (!gamewideHash) gamewideHash = loadVal("gamewideHash",{});
            if (gamewideHash[gameID]&&Object.keys(gamewideHash[gameID]).length>0)
                putInWideButtonFieldset("This game's templates", gamewideHash, "MWGoldGamewide", "MWGoldCPDeleteGamewides", gameID);
            $('#MWGoldCP').append("Currently selected sheet:<select style='max-width:100%' id='MWGoldSheetSelector'></select>");
            $('#MWGoldSheetSelector').append("<option>None</option>");

            // 1. Load the list of sheets
            if (!sheetHash) sheetHash = GM_getValue("sheetHash",null);
            if (!sheetHash) getListofSheets(false);
            var charNames = Object.keys(sheetHash);
            for (var i in charNames) $('#MWGoldSheetSelector').append("<option>" + charNames[i] + "</option>");
            
            // 2. remember the last sheet selected in this game and have it selected by default
            if (!curByGame) curByGame = loadVal("curByGame",{});
            if (curByGame[gameID]) $('#MWGoldSheetSelector').val(curByGame[gameID]);

            // 3. When a new sheet is selected, remember it
            $('#MWGoldSheetSelector').change(function() 
            {
                if (!curByGame) curByGame = loadVal("curByGame",{});
                curByGame[gameID]=$('#MWGoldSheetSelector').val();
                saveVal("curByGame",(curByGame));
            });
            // stick it down the bottom!
            //$('#MWGoldCP').position({my: "left bottom",at: "left bottom",of: $('#MWGoldCP').parents('.eqchilds')});
    }} 
    else if (siteIs("memberURL")) {
        var userID = $(location).attr('href').split('=')[1];
        $('#minicontact').parent().append("<li id='analyseUser' class='thread'><a href='javascript:void(0)'>Analyse</a></li>");
        $('#analyseUser').click(function (){
            analyseUser(userID);
        });
        printAnalForUser("#collapseobj_stats > div",userID);}
    else if (siteIs("portalURL")) // we're doing Amy's portal stuff!
    {
        refreshThisStuff.push('#collapseobj_forumhome_activeusers');

        subscribedForumLinks = [];
        $('img[src*="static.myth-weavers.com/images/sonata/statusicon/subforum_"]').siblings('a').each(function()
        {
            subscribedForumLinks.push( $(this).attr('href').replace(/^\/\//,'https://') );
        });
        log("subscribed to these games: "+JSON.stringify(subscribedForumLinks));

        // rearrange
        if (toggleHash["Rearrange front page"]) 
        {
            rearrangePortal(document);
            if (toggleHash["WidescreenPortal"]) widescreen(90);
            $('#breadcrumb').html('<span id="MWGoldTopContainer" class="thead" style="color: #ffffcc;padding:3px"><span style="padding-right: 7px;padding-left: 17px;">Drag and resize the categories until they look pretty:  </span></span>');
            $('#MWGoldTopContainer').append(printFauxButton('resetArrange','Reset','Reset size and position of all front page stuff'));
            $('#resetArrange').css('color','black').click(function () {
                selectiveAmnesia("pos_");
                selectiveAmnesia("size_");
                rearrangeEntry();
            });
            $('#MWGoldTopContainer').append('<input type="checkbox" id="resizeStuff">Show resize things</input>');
            $('#breadcrumb').append(printFauxButton('MWGoldOpenCloseTop','<','Hide the resize controls'));
            $('#MWGoldOpenCloseTop').click(function () {
                $('#MWGoldTopContainer').toggle('slide');
                if ($('#MWGoldOpenCloseTop').text()=="<") {$('#MWGoldOpenCloseTop').text(">").attr('title','Show the resize controls');}else{$('#MWGoldOpenCloseTop').text("<").attr('title','Hide the resize controls');}
            });
            if (!toggleHash["Show resize controls on front page"]) $('#MWGoldOpenCloseTop').click();
            $('#resizeStuff').change(function () {
                if ($('#resizeStuff').is(':checked')){
                    $('#forumhome_forumlist > li').each(function () {
                        $(this).attr('class','col span-1 ui-widget-content').resizable({stop:function(event,ui){log('entry for '+event.target.id);saveVal('size_'+event.target.id, 
                            {width: $('#'+event.target.id).css('width'), height: $('#'+event.target.id).css('height')});}}).css('background','transparent');
                    });
                    $('#forumhome_forumlist').attr('class','col span-1 ui-widget-content').resizable({stop:function(event,ui){log('entry for '+event.target.id);saveVal('size_'+event.target.id, 
                            {width: $('#'+event.target.id).css('width'), height: $('#'+event.target.id).css('height')});}}).css('background','transparent');
                }else{
                    $('#forumhome_forumlist > li').each(function () {
                        $(this).attr('class','col span-1').resizable('destroy');
                    });
                    $('#forumhome_forumlist').removeClass('ui-widget-content').resizable('destroy');
            }});
            var ffSize = loadVal("size_forumhome_forumlist",{height:'300px',width:'100%'});
            $('#forumhome_forumlist').css('height',ffSize.height).css('width',ffSize.width);//.css('display','block').css('height','auto').css('overflow','auto');
        }
        getAllPeeps();
        // remove the stuff that's just taking up space
        $('div.col:last').remove();
        $('thead').remove();
    }else if (siteIs("sheetListURL"))
    {
        // fiddle with the table
        if ($('table.table-striped').length>0){
            $('table.table-striped:first').attr('id','theTable').parent().attr('class','col-md-10 col-md-push-2');
            $('#theTable').parent().next().next().remove();
            $('#theTable').parent().next().attr('class','col-md-2 col-md-pull-10');
            var id=2;
            $('#theTable thead tr th:not(:last)').each(function () {
                if ($(this).html().trim()=="") return;
                $(this).append("<input style='float:right;max-width:50%' data-id='"+(id++)+"' type='textbox' />");
                $(this).find('input').keypress(function (e) {if (e.keyCode==13) $(this).blur();});
                $(this).find('input').blur(function __tablefiddle() {
                    var key = $(this).val(), id = parseInt($(this).attr('data-id'));
                    var sterf={};
                    $(this).parentsUntil('thead').find('th input').each(function () {if ($(this).val()!="") sterf[$(this).attr('data-id')]=$(this).val();})

                    log('key: '+key+' & id: '+id);
                    log('search terms: '+JSON.stringify(sterf));

                    if (Object.keys(sterf).length<1&&key=="") {$('#theTable tbody').find('tr').each(function () {$(this).show();}); log('cleared filters');return;}

                    $('#theTable tbody').find('tr:visible').each(function () {$(this).attr('match','false');});
                    
                    var result = $('#theTable tbody').find('td:nth-child('+id+'):CoNTains('+key+')');

                    //log('prelim results: '+result.length);

                    //for (var i in sterf) result = result.filter('td:nth-child('+i+'):CoNTains('+sterf[i]+')');

                    //log('filtered results: '+result.length);
                    
                    if (result.length>0) result.each(function () {$(this).parent().attr('match','true');});

                    $('#theTable tbody').find('tr').each(function () {if ($(this).attr('match')!='true') $(this).hide();});
                    
                    // $('#theTable tbody').find('tr').each(function () {$(this).attr('match','false');});
                    // var result = $('#theTable tbody').find('td:nth-child('+id+'):CoNTains('+key+')');
                    // if (result.length>0) $(result).each(function () {$(this).parents('tr').attr('match','true');});
                    // $('#theTable tbody').find('tr[match!=true]').each(function () {$(this).hide();});
                    // $('#theTable tbody').find('tr[match=true]:hidden').each(function () {$(this).show();});
                });
            }); // sorting stuff
            //$('#theTable thead tr').append('<th></th>');
            $('#theTable tbody tr').each(function () {
                var ID = $(this).children(':nth-child(1)').children('a').attr('href').split('/')[2];

                $(this).children('td:last').append('<img width="20px" href="#" src="https://cdn1.iconfinder.com/data/icons/basic-ui-elements-color/700/010_trash-2-128.png" id="deleteButton'+ID+'">');
                $('#deleteButton'+ID).click(function () {
                    $.post(knownURLS['sheetListURL']+'/'+$(this).attr('id').replace(/\D+/g,''),{'_method':'DELETE'});
                    $(this).parentsUntil('tbody').remove();
                });
            });
            $('#theTable th:last').html( '<a id="downloadAll">'+$('#theTable th:last').html()+'</a>' ).css('min-width','55px');
            $('#downloadAll').click(function () {
                $('.fa-download:lt(2)').each(function () { //TODO:rm first
                    if (!$(this).parent().attr('href')) return true;
                    $.get({
                        url: 'https://www.myth-weavers.com'+$(this).parent().attr('href'),
                        // data: data,
                        success: function (data) {
                            //GM_setValue('JSON_'+data['name'],data);
                            console.log('got: JSON_'+data['name']);
                        },
                        dataType: "json"
                    });
                });
            });
        }


    toggleHash['skip']=true;
    }
    else if (siteIs("pmURL")){
        //  
        // else
        var editor='#vB_Editor_QR_textarea';
        if ($('#vB_Editor_001_textarea').length>0) editor='#vB_Editor_001_textarea';
        $(editor).css('height','500px');
        addEditorButtons(editor.replace(/#/,''),editor.replace(/#/,'').split('_').slice(0,-1).join('_'));

        if ($('#cb_savecopy').length>0&&toggleHash['Auto-save copy of PMs']) $('#cb_savecopy').prop('checked',true);
        else if ($('#qr_submit').length>0&&toggleHash['Auto-save copy of PMs']) $('#qr_submit').before('<input name="savecopy" value="1" id="cb_savecopy" tabindex="1" type="checkbox" checked hidden>');
    }
    // run out of known sites
    else{ log($(location).attr('href').toString()+" is not a known url"); }

    // stuff to do for every page!
    if (!toggleHash['skip']||!uName){

    // replace "social" with much more social shit
    if (toggleHash["Show online friends"]){
        $('#social').html("");
        $('#social').attr('style','padding-right:30px');
        fillInFriends();
        $('#social').fadeIn(1000);}

    // make wide-screen baby
    if (toggleHash["Widescreen"]) widescreen(loadVal('width',90));

    // hide annoying useless shit
    if (!toggleHash["Show shop button"])//&&!(siteIs("portalURL")&&toggleHash["Rearrange front page"]))
        $("a[href='http://astore.amazon.com/mythweaver-20']").parent().fadeOut();
     if (!toggleHash["Show footer"])
        $('div[style="text-align: center; padding: 12px;"]').fadeOut().prev().html("<span style='width:100%'></span>");
    $('.ad_cs_link').remove();

    if (showMemStuff||debugMode)
    {
        $('#logo').after(printFauxButton('showMemory','>','List everything the script knows'));
        $('#headerContainer').after("<fieldset id='MemFieldset' style='float:top;z-index:10' hidden><legend style='color: #ffffcc'>Everything I know</legend><div id='memoryContainer' data-loaded='false'></div></fieldset>");
        $('#showMemory').css('color','black').css('float','right').click(function () {
            if ($('#showMemory').text()==">") {$('#MemFieldset').slideDown(); $('#showMemory').text("<");
                if ($('#memoryContainer').attr('data-loaded')=='false') { var vs = GM_listValues();
                    $('#memoryContainer').append("<ul></ul>");
                    for (var v in vs) if (vs[v].endsWith("_type")) $('#memoryContainer > ul > li[data-key="'+vs[v].substr(0,vs[v].length-5)+'"]').append(" ("+GM_getValue(vs[v],"")+")");
                        else {$("<li data-key='"+vs[v]+"'><a>"+vs[v]+"</a></li>").appendTo('#memoryContainer > ul'); 
                            $('#memoryContainer > ul > li:last > a').click(function () {
                                if (!$(this).next('div').length){
                                    var key = $(this).parent().attr('data-key');
                                    var val = loadVal(key,null);
                                    $(this).after('<div style="color: #ffffcc" hidden>'+JSON.stringify(val)+'</div>');
                                    $(this).next('div').click(function () {
                                        if (!prompt('Are you sure you want to delete '+key+'? (Type something to confirm)')) return;
                                        GM_deleteValue(key);
                                        GM_deleteValue(key+'_type');
                                        $(this).parent().remove();
                                    });
                                }
                                var thing = $(this).next('div');
                                if (thing.is(':hidden')) thing.slideDown(); else thing.slideUp(); 
                        })}
                    $('#memoryContainer').attr('data-loaded', 'true');}
            } else {$('#MemFieldset').slideUp(); $('#showMemory').text(">");}
        });
    }

    // make the threads list better
    improveThreads();

    // auto-update shit
    refreshStuff();

    // change the menu links to shitty utility pages into popup dialogs
    if (toggleHash['Replace Site Tools with pop ups']) {
        $('#menu_bar a[href="'+knownURLS["pbURL"]+'"]').attr('href','javascript:;').click(function (){createPBDialog(false);});
        $('#menu_bar a[href="'+knownURLS["npcgenURL"]+'"]').attr('href','javascript:;').click(createNPCGenDialog);
        $('#menu_bar a[href="'+knownURLS["lootgenURL"]+'"]').attr('href','javascript:;').click(createLootGenDialog);
        $('#menu_bar li:nth-child(3) ul').css('background-size','cover').append("<li><a href='javascript:void' id='pfWepCreator'>PF Weapon Creator</a></li>");
        $('#pfWepCreator').click(createWeaponCreatorDialog);
    }
    
    if (!toggleHash['Show search box']) $('#searchform').remove();


    // remember where we left off last time on the page
    scrollPosHash=loadVal('scrollPosHash',{});
    var t = document.URL.split('#')[0].replace(/[^\da-z]/gi,'');
    if (scrollPosHash[t]) $(window).scrollTop(scrollPosHash[t]);
    $(window).click(function _saveScrollPos(){
        scrollPosHash[document.URL.split('#')[0].replace(/[^\da-z]/gi,'')]=$(window).scrollTop();
        saveVal('scrollPosHash',scrollPosHash);
    });
    dejumpifyLinks();

    }}else{//stuff for the character sheet pages 
        var sheetID = document.URL.replace(/\D/g,'');
        $("button.sheetsave").click(function(){scrape(document,sheetID);});
        $('head').append('<style>.page {padding: 5px} .page table {border-spacing:0px;} '+
            '.recentlyChanged{background-color: #dfedf9}'+ //{border: 2px solid #dadada;border-radius: 7px;} .recentlyChanged:focus
            '.ui-autocomplete {overflow-x: hidden;overflow-y: auto;max-height:500px;max-width:300px} '+
            '.spellssheets tr.title td {background-color:black; color:white; font-size:14px; font-weight:bold; font-family:Arial, sans-serif; text-align:center}'+
            '.spellssheets td:first {text-align:center;border:1px solid black;width:100%}'+
            '.spellspacer{max-height:8px; white-space: nowrap; }'+
//            'input,textarea { background-color: white; } .page {background-color: #eee !important}'+
            '#skillcontainer { width: 35%; } #sheetcontainer,#sheet { width: 100%; } #sheet > .page { width: 98%; margin-left:0.5%} #spellstuff td.saves { width: 18%; } '+
            '.skillslot > .skillmod:nth-child(4) > .text { font-weight: bold; background-color: #99ffb3; }'+
            '.skillslot > .skillmod:nth-child(8) > .text { font-weight: bold; background-color: #ffcc99; }'+
            //'.skillslot:nth-child(even) *, #gear tr.slot:nth-child(even) *, #feats tr:nth-child(2) table tr:nth-child(even) *, #languages tr:nth-child(even) *, .spelllist tr:nth-child(even) *'+' {background-color: #ccf3ff;}'+
            '</style>');
        waitForFire(improveSheet,document,sheetID);
        if (toggleHash['Auto-load sheet on visit']) waitForFire(scrape,document,sheetID);

        // delete ads
        $('#sheet_controls .mwadcontainer').remove();
        $('#alerts').prev('div').has('a[href*=facebook]').remove();

        // config menu
        $('#character_name').parent().after("<li id='MWGoldCPToggles'>"+"<button class='smalltext btn btn-primary' title='Show the MW Gold configuration options' id='openConfig'>Configurate</button><br/><div class='alt2' id='showToggles' hidden></div></li>");
        $('#openConfig').css('margin-top','0.8em').click(function () {$('#showToggles').toggle();});
        var list = sheetToggleList;
        for (var l in list){
            var theStuff = "<input id='MWGoldToggle"+l+"' data-key='"+list[l]+"' type='checkbox' "+(toggleHash[list[l]]?"checked":"")+"/><a title='"+list[l]+"' class='smallfont'>"+(list[l].length>38?list[l].substr(0,35)+"...":list[l])+"</a><br />";
            $('#showToggles').append(theStuff);
            $('#MWGoldToggle'+l).change(function _sheetToggle(event){
                toggleHash[$('#'+event.target.id).attr('data-key')]=$('#'+event.target.id).is(':checked');
                saveVal("toggleHash",(toggleHash));
                putAnAlertSomewhere('Changes saved','#MWGoldCPToggles');
                if ($('#'+event.target.id).attr('data-key')=='Quench auto-crossclassing when skill name changes'&&$('#'+event.target.id).is(':checked')) quench();
                if ($('#'+event.target.id).attr('data-key')=='Show featstore') {$('#featContainer').toggle();  
                    if ($('#sheet > div:nth-child(1)').css('height')=="1400px") $('#sheet > div:nth-child(1)').css('height','1250px'); 
                    else $('#sheet > div:nth-child(1)').css('height','1400px');}
                if ($('#'+event.target.id).attr('data-key')=='Show item backpacks') $('#backpackContainer').toggle();
                if ($('#'+event.target.id).attr('data-key')=='Show spell sheets') $('#spellControlsContainer').toggle();
            });}
        // $("button.sheetsave").after("<button id='compareLast' class='btn btn-primary' text='Compare'/>");
        // $("#compareLast").click(function() {highlightChanges(sheetID)});

        $(window).click(function _saveScrollPos(){saveVal('ScrollPos_'+sheetID,$(window).scrollTop())});
    }
}
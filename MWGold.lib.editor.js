
function addSiteWideButtons (textArea, cleansed, gameID) { //gameID should be not be used but is required
    if (!sitewideHash) sitewideHash = loadVal("sitewideHash",{cleansed:""}); 

    saveVal("sitewideHash",(sitewideHash));
    if (!sitewideCounter) sitewideCounter = Object.keys(sitewideHash).length;

    $('#MWGoldSitewideButtonContainer').find(':last').before("<DIV style='display:inline-block;'><b id='MWGoldSitewide"+sitewideCounter+"Name"+"'>"+cleansed+":</b> "
        +printFauxButton('MWGoldSitewide'+sitewideCounter+"Save",'Copy','Copy current text to '+cleansed)
        +printFauxButton('MWGoldSitewide'+sitewideCounter+"Load",'Paste','Paste '+cleansed+' at caret in textbox')+" | </DIV>"
        );//+"</div>");
    $("#MWGoldSitewide"+sitewideCounter+"Name").click(function() {
        var id = $(this).attr('id').replace(/Name$/,'TextBox');
        var oldName = $(this).html().replace(/:$/,'');
        $(this).html("<input type='textbox' data-key='"+oldName+"' id='"+id+"' value='"+oldName+"'></input>");
        $("#"+id).blur(function () {
            var id = $(this).attr('id').replace(/TextBox$/,'Name');
            var newName=$(this).val();
            if (newName&&newName!=""&&newName!=$(this).attr('data-key')){
                var val = sitewideHash[$(this).attr('data-key')];
                delete sitewideHash[$(this).attr('data-key')];
                sitewideHash[newName]=val;
                saveVal('sitewideHash',(sitewideHash));}
            $(this).remove();
            $("#"+id).html(newName+":").attr('data-texty','false');
        });
    });
    $('#MWGoldSitewide'+sitewideCounter+"Save").attr('data-key',cleansed).click(function(event) {
        var shite = getSelection(textArea);
        if (!shite || shite=="") {putAnAlertSomewhere("Select some text to copy",$('#'+event.target.id).parent()); return;} //sitewideHash[$('#'+event.target.id).attr('data-key')] = $('#'+textArea).val();
        else sitewideHash[$('#'+event.target.id).attr('data-key')] = shite;
        
        saveVal('sitewideHash',(sitewideHash));
        putAnAlertSomewhere("Saved",$('#'+event.target.id).parent());
    });
    $('#MWGoldSitewide'+sitewideCounter+"Load").attr('data-key',cleansed).click(function(event) {
        if (!sitewideHash) sitewideHash = loadVal('sitewideHash',"");
        // if (sitewideHash!="") insertAtCaret(textArea,sitewideHash[$('#'+event.target.id).attr('data-key')]); 
        var selectedText = getSelection(textArea), template = sitewideHash[$('#'+event.target.id).attr('data-key')];
        if (!selectedText || selectedText=="") insertAtCaret(textArea,template); 
        else if (template.includes('""')) {
            var abc = template.split('""');
            overwrite(textArea,abc[0]+'"'+selectedText.replace(/^"/,'').replace(/"$/,'')+'"'+abc[1]);
        }else if (template.includes('][/')) {
            var abc = template.split('][/');
            overwrite(textArea,abc[0]+']'+selectedText+'[/'+abc.slice(1).join('][/'));
        }else log("error retrieving "+$('#'+event.target.id).attr('data-key'));
    });
    sitewideCounter++;}
function addGameWideButtons (textArea, cleansed, gameID) { 
    if (!gamewideHash) gamewideHash = loadVal("gamewideHash",{}); 
    if (!gamewideHash[gameID]) gamewideHash[gameID] = {};
    saveVal("gamewideHash",(gamewideHash));

    if (!gamewideCounter) gamewideCounter = Object.keys(gamewideHash).length;

    $('#MWGoldGamewideButtonContainer').attr('data-gameid',gameID).find(':last').before("<b data-texty='false' id='MWGoldGamewide"+gamewideCounter+"Name"+"'>"+cleansed+":</b> "
        +printFauxButton('MWGoldGamewide'+gamewideCounter+"Save",'Copy','Copy current text to '+cleansed)
        +printFauxButton('MWGoldGamewide'+gamewideCounter+"Load",'Paste','Paste '+cleansed+' at caret in textbox')+" | "
        );//+"</div>");
    $("#MWGoldGamewide"+gamewideCounter+"Name").click(function() {
        if ($(this).attr('data-texty')=='true') return;
        $(this).attr('data-texty','true');
        var id = $(this).attr('id').replace(/Name$/,'TextBox');
        var oldname = $(this).html().replace(/:$/,'');
        $(this).html("<input type='textbox' data-key='"+oldname+"' id='"+id+"' value='"+oldname+"'></input>");
        $('#'+id).keypress(function (e){if (e.keyCode==13) {$(this).blur();return false;}});//e.stopPropagation();
        $("#"+id).blur(function () {
            var id = $(this).attr('id').replace(/TextBox$/,'Name');
            var newName=$(this).val();
            if (newName&&newName!=""&&newName!=$(this).attr('data-key')){
                var val = gamewideHash[$('#MWGoldGamewideButtonContainer').attr('data-gameid')][$(this).attr('data-key')];
                delete gamewideHash[$('#MWGoldGamewideButtonContainer').attr('data-gameid')][$(this).attr('data-key')];
                gamewideHash[$('#MWGoldGamewideButtonContainer').attr('data-gameid')][newName]=val;
                $(this).attr('data-key',newName);
                saveVal('gamewideHash',(gamewideHash));}
            $(this).remove();
            $("#"+id).html(newName+":").attr('data-texty','false');
        });
    });
    $('#MWGoldGamewide'+gamewideCounter+"Save").attr('data-key',cleansed).click(function(event) {
        var shite = getSelection(textArea);
        if (!shite || shite=="") {putAnAlertSomewhere("Select some text to copy",$('#'+event.target.id).parent()); return;} //gamewideHash[gameID][$('#'+event.target.id).attr('data-key')] = $('#'+textArea).val();
        else gamewideHash[gameID][$('#'+event.target.id).attr('data-key')] = shite;
        
        saveVal('gamewideHash',(gamewideHash));
        putAnAlertSomewhere("Saved",$('#'+event.target.id).parent());
    });
    $('#MWGoldGamewide'+gamewideCounter+"Load").attr('data-key',cleansed).click(function(event) {
        if (!gamewideHash) gamewideHash = loadVal('gamewideHash',"");
        if (gamewideHash!="") 
        {
            var selectedText = getSelection(textArea), template = gamewideHash[gameID][$('#'+event.target.id).attr('data-key')];
            if (!selectedText || selectedText=="") insertAtCaret(textArea,template); 
            else if (template.includes('""')) {
                var abc = template.split('""');
                overwrite(textArea,abc[0]+'"'+selectedText.replace(/^"/,'').replace(/"$/,'')+'"'+abc[1]);
            }else if (template.includes('][/')) {
                var abc = template.split('][/');
                overwrite(textArea,abc[0]+']'+selectedText+'[/'+abc.slice(1).join('][/'));
            }else insertAtCaret(textArea,template);
        }else log("error retrieving "+$('#'+event.target.id).attr('data-key'));
    });
    gamewideCounter++;}
function makeContainer (textArea, containerType,theHash,addFunc,gameID) { 
    $('#MWGold'+containerType+'ButtonContainer').append(printFauxButton('MWGoldAdd'+containerType,'+','Click to add a new '+containerType+' button'));
    
    // restore previously created sitewides
    if (gameID)
        for (var h in theHash[gameID]) addFunc(textArea, h, gameID);
    else
        for (var h in theHash) addFunc(textArea, h, gameID);
    
    // make the '+' do something
    $('#MWGoldAdd'+containerType).click(function(){
        var userinput = prompt("Please enter a name to store the thing as (hint: keeping it short = takes up less space)");
        var cleansed = userinput.replace(/[^\sa-z0-9]/gi,'');
        addFunc(textArea, cleansed, gameID);
    }); }

    function tablify (textArea,opts) { 
    var selectedText = getSelection(textArea);
    if (selectedText=="") {putAnAlertSomewhere("Select some text to tablify","#MWGoldTopTools"); return;}
    if (!selectedText.includes('|')) {putAnAlertSomewhere('Separate columns with a pipe: "|" (shift+\\)',"#MWGoldTopTools"); return;}

    var lines = selectedText.split('\n');
    var endString = "";
    var row = 1, col = maxcol = 0;
    for (var r in lines)
    {
        col = 1;
        var cols = lines[r].split('|');
        for (var c in cols)
        {
            if (opts['Max columns']&&col>opts['Max columns']) {col=1;row++;maxcol=opts['Max columns']+1;}
            else if (col>10) {col=2;row++;maxcol=10;}
            var colsc=cols[c];
            if ((opts['Bold first column']&&col==1)||(opts['Bold first row']&&row==1)) colsc = "[b]"+colsc+"[/b]";
            endString += "[r="+col+","+row+"]"+colsc; 
            col++;
        }
        if (col>maxcol) maxcol=col;
        endString += "\n";
        row++;
    }
    overwrite(textArea,"[table="+(maxcol-1)+","+(row-1)+"]"+endString.trim()+"[/table]");}
function OOCnote (textArea) { 
    var selectedText = getSelection(textArea);
    var userinput = prompt("What do you want the OOC mouseover to say?");
    if (userinput==null) return;
    overwrite(textArea,"[ooc="+selectedText+"]"+userinput+"[/ooc]");}
function img2insertion (textArea,wrapOOC) { 
    var selectedText = getSelection(textArea),pre="[img2=100]",post="[/img2]";
    if (wrapOOC) {post+="[/ooc]";pre="[ooc=][img2=490]";}
    if (selectedText=="") 
    {
        var userinput, def = getMostUsedImage();
        if (def==null) userinput = prompt("What's the link for the image?");
        else userinput = prompt("What's the link for the image?",def);
        if (userinput==null) return;

        insertAtCaret(textArea,pre+userinput+post);
    }else{
        if (wrapOOC) 
            overwrite(textArea,"[ooc="+selectedText+"][img2=490]"+prompt("What's the link for the image?")+post);
        else
            overwrite(textArea,pre+selectedText+post);
    }}
function getMostUsedImage(){
        if (!imageHash) imageHash = loadVal('imageHash',{});
        var max = -1, favourite=null;
        for (var k in imageHash) if (imageHash[k]>max) {max=imageHash[k];favourite=k;}
        return favourite;
}
function fieldsetInsertion (textArea) { 
    var selectedText = getSelection(textArea);
    var fieldset;
    var userinput = prompt("What's the title for the fieldset(blank for none)?");
    if (userinput==null) return;
    if (userinput=="") fieldset = "setfield"; else fieldset = "fieldset="+userinput;
    if (selectedText=="") 
    {
        insertAtCaret(textArea,"["+fieldset+"]\n\n[/"+fieldset.split('=')[0]+"]");
    }else{
        overwrite(textArea,"["+fieldset+"]"+selectedText+"[/"+fieldset.split('=')[0]+"]");
    }}
function spoilerInsertion (textArea) { 
    var selectedText = getSelection(textArea);
    var userinput = prompt("What shall be the title/name (the visible text) of the spoiler?");
    if (userinput==null) return;
    if (selectedText=="") 
    {
        insertAtCaret(textArea,"[spoiler="+userinput+"]\n\n[/spoiler]");
    }else{
        overwrite(textArea,"[spoiler="+userinput+"]"+selectedText+"[/spoiler]");
    }}
function makeList(textArea) { 
    var selectedText = getSelection(textArea);
    if (selectedText=="") 
    {
        insertAtCaret(textArea,"[list]\n[*]\n[/list]");
    }else{
        overwrite(textArea,"[list]\n[*]"+selectedText.replace(/\n/g,'\n[*]')+"\n[/list]");
    }}
function makeMiniMenu(container, hidingId, vbutton){// where does it go? who you gonna call (it)? what controls it?
    $(container).after("<div id='"+hidingId+"' hidden><span style='width:300;'></span></div>")
    $(vbutton).click(function (){
        if ($(vbutton).html()=='∧') $(vbutton).html('∨'); 
        else {$(vbutton).html('∧'); $('#'+hidingId).hide();}
    });
    $(vbutton).hover(function () { $('#'+hidingId).show(); }, function () { if ($(vbutton).html()=='∧') $('#'+hidingId).hide(); } );
}
function privateMessage (textArea, rList) { 
    //if (rList==[]) {putAnAlertSomewhere("You need to 'analyse' this thread to get the users who post here (the button is at the top of the thread with a little magnifying glass)",'#MWGoldTopTools');}
    var selectedText = getSelection(textArea);
    overwrite(textArea,"[private="+(rList.length>0?rList.join(", "):"\" \"")+"]"+selectedText+"[/private]");}
function makeAnyTag (textArea) { 
    var selectedText = getSelection(textArea);
    var p = prompt("Please enter the tag you'd like to wrap around the text. "+'Eg. "noparse" or "center"');
    if (p==null) return;
    overwrite(textArea,"["+p+"]"+selectedText+"[/"+p+"]");}
function selectiveQuote (textArea) { 
    var selectedText = window.getSelection().toString();
    alert(selectedText);
    // TODO: Logic for getting poster
    insertAtCaret(textArea,"[quote]"+selectedText+"[/quote]");}
function generateToolkit (textArea, userList) { 
    $('#MWGoldToolsContainer').prev().after("<span float='right' id='MWGoldTopTools' class='smalltext'>"
        +"<span><input id='autoPreview' type='checkbox'>Auto-preview</span>"
        +"<img style='vertical-align: top;' src='http://i.imgur.com/TxZ3RPe.png' title='MWGold Toolkit' />" // fancy button
        +"<span style='background-color:#888888;padding:1px'>"
        +printFauxButton("makeTable","Tablify","Turns text like this into a table:\na|b|c\nd|e|f\ng|h|i")
        +"<span style='"+fauxButton+"' id='tmenu'>∧</span>"
        +printFauxButton("makeList","Listify","Puts list tags around selected text (if any), and makes each line a dot point")
        +printFauxButton("OOCnote","OOC","Attaches an OOC message to the selected text (if any)")
        +printFauxButton("img2","IMG2","Puts resizeable image tags around selected link, or, if nothing is selected, prompts you for a link")
        +printFauxButton("img2ooc","IMG2OOC","Puts ooc tags (around selected text, if any) containing resizeable image tags and prompts you for a link")
        +printFauxButton("fieldsetInsertion","Fieldset","Puts a fieldset around selected link (if any), prompts you for a title")
        +printFauxButton("spoilerInsertion","Spoiler","Puts spoiler tags around selected text (if any), prompts you for a title")
        +printFauxButton("privateMessage","Private","Puts private tags around selected text (if any), prompts you for a title")
        +"<span style='"+fauxButton+"' id='pmenu'>∧</span>"
        +printFauxButton("anyButton","Any","Puts tags around the selected text (if any), prompts you for which tags")
        +"</span></span>");
    $('#img2').after("<span style='"+fauxButton+"' id='imenu'>∧</span>");

    // remove spoiler and preview buttons for PMs and non-QRs
    if (!$('#vB_Editor_QR').length||siteIs('pmURL')) {
        $('#autoPreview').parent().remove();
        $('#spoilerInsertion').remove();

        // requotify button
        $('#MWGoldTopTools').append(printFauxButton('autorequotifyButton','Requotify','Rearrange the quotes into paragraph, removing anyone but the most recent poster'));
        $('#autorequotifyButton').click(function (){if ($('#'+textArea).length>0) {
            var openQuote=$('#'+textArea).val().split(']')[0]+"]";
            log('openQuote: '+openQuote+' & quote count: '+$('#'+textArea).val().split(openQuote).join('').split('[QUOTE=').length);
            if ($('#'+textArea).val().split(openQuote).join('').split('[QUOTE=').length>0){  
                var trimmed = $('#'+textArea).val().slice(openQuote.length).replace(/\[QUOTE=(.|\r?\n)+?(\[\/QUOTE\]\s*)+/gi,'').trim();
                var endStr = openQuote+trimmed.replace(/(\S)\n\n\s*/g,'$1[/quote]\n\n'+openQuote.toLowerCase()).trim();
                if (!endStr.toLowerCase().endsWith("[/quote]")) endStr+="[/quote]";
                $('#'+textArea).val( endStr+"\n" );
            }
        }});
    }
    else {$('#autoPreview').click(function () {
            if ($(this).prop('checked')) {
                $(this).attr('data-sI',JSON.stringify(setInterval(function () {$('#vB_Editor_QR > input:last').click();},1000)));
                log("set to: "+$(this).attr('data-sI')+" & found nodes: "+$('td.tcat:contains(Preview)').length);
            }else{
                log("retrieved: "+$(this).attr('data-sI'));
                clearInterval(JSON.parse($(this).attr('data-sI')));
            }});
        $('#spoilerInsertion').click(function () {spoilerInsertion(textArea);} );
    }

    // hook up all those buttons with functionality baby!
    $('#makeList').click(function () {makeList(textArea);} );
    $('#makeTable').click(function () {
        var opts={};
        $('#tmenucontent input.tmenucheckbox:checked').each(function () {opts[$(this).attr('label')]=true;});
        $('#tmenucontent input.tmenutextbox').each(function () {if ($(this).val()) opts[$(this).attr('label')]=parseInt($(this).val());});
        tablify(textArea,opts);
    });
    $('#OOCnote').click(function () {OOCnote(textArea);} );
    $('#img2').click(function () {img2insertion(textArea,false);} );
    $('#img2ooc').click(function () {img2insertion(textArea,true);} );
    $('#anyButton').click(function () {makeAnyTag(textArea);} );
    $('#fieldsetInsertion').click(function () {fieldsetInsertion(textArea);} );
    $('#privateMessage').click(function () { 
        var allVals = [];
        $('#pmenucontent').find('input:checked').each(function (){allVals.push($(this).attr('data-key'));});
        privateMessage(textArea,allVals);
    } );

    // table menu junk
    makeMiniMenu('#MWGoldTopTools', 'tmenucontent', '#tmenu');
    $('#tmenucontent').append("<input type='checkbox' class='tmenucheckbox' label='Bold first row'/>Bold first row<br/>");
    $('#tmenucontent').append("<input type='checkbox' class='tmenucheckbox' label='Bold first column'/>Bold first column<br/>");
    $('#tmenucontent').append("<input type='textbox' class='tmenutextbox' width='10px' label='Max columns'/>Max columns");
    
    // user memory junk
    makeMiniMenu('#MWGoldTopTools', 'pmenucontent', '#pmenu');
    if (userList.length) 
        for (var u in userList) 
            {if (userList[u]!=uName) 
                $('#pmenucontent').append("<div style='display:inline-block; background-color:#aaa; padding: 2px;'><input type='checkbox' "+(toggleHash["Private recipients checked by default"]?"checked":"")+" data-key='"
                    +userList[u]+"'>"+userList[u]+"</input></div>");
            }
    else 
    {
        $('#pmenucontent').append("You need to 'analyse' this thread to get the users who post here."+printFauxButton('analThisThread','Do it now','Just do it'));
        $('#analThisThread').click(analyseThread);
    }

    // image memory junk
    makeMiniMenu('#MWGoldTopTools', 'imenucontent', '#imenu');
    if (!imageHash) imageHash = loadVal('imageHash',{});
    var tuples = [];
    for (var key in imageHash) tuples.push([key, imageHash[key]]);
    if (tuples.length){
        tuples.sort(function(a, b) {a = a[1];b = b[1];return a > b ? 1 : (a < b ? -1 : 0);});
        for (var i in tuples)
        {
            var w = 100; // 100 px by default
            $('#imenucontent').append("<div style='display:inline-block; background-color:#aaa; padding: 2px;'><img src='"+tuples[i][0]+"' width='"+w+"px' /></div>");
        }
        $('#imenucontent div img').click(function (event) {
            var url = $(this).attr('src');
            if (imageHash[url].size)
                insertAtCaret(textArea,"[img2="+imageHash[url].size+"]"+url+"[/img2]");
            else
                insertAtCaret(textArea,"[img]"+url+"[/img]");
        });
    }else{$('#imenucontent').append("<div style='display:inline-block; background-color:#aaa; padding: 2px;'>No images found. Spam some images on the boards to have them appear here.</div>");}
}

function getThreadID () { 
    var threadID = $('input[name="threadid"]').val();
    if (!threadID) threadID = $('#qr_threadid').val();
    if (!threadID && $(location).attr('href').includes("t=")) 
        threadID = $(location).attr('href').split("t=")[1].replace(/(\d+)\D.*/,'$1');
    if (!threadID && $('a[href*="showthread.php?t="]').length>0) threadID = $('a[href*="showthread.php?t="]').attr('href').split('t=')[1].replace(/(\d+)\D.*/,'$1');
    return threadID;}
function addEditorButtons (textArea,editorArea) { 
    var gameID = "none";
    if ($('#breadcrumb > li > a[href*="forumdisplay.php?f="]').length>1) 
        gameID = $('#breadcrumb > li > a[href*="forumdisplay.php?f="]').eq(1).attr('href').split("=")[1]; 
    else if ($('#breadcrumb > li > a[href*="forumdisplay.php?f="]').length>0) 
        gameID = $('#breadcrumb > li > a[href*="forumdisplay.php?f="]').eq(0).attr('href').split("=")[1]; 
    var threadID = getThreadID(), submitFormButton;
    log("threadID="+threadID+" ("+typeof (threadID)+")");
    log("gameID="+gameID+" ("+typeof (gameID)+")");
    
    $('#'+textArea).css('height','300'); // make it bigger cus it's fucking tiny by default

    if (editorArea=="vB_Editor_QR") submitFormButton='#qr_submit'; else submitFormButton='#vB_Editor_001_save';
    $(submitFormButton).click(function () {
        // stuff to do when the form is submitted
        $('#preview_output').html('');
        analysePost($('#'+textArea).val());
        saveVal('preventMWFromEating',$('#'+textArea).val());
    });
    $(submitFormButton).after( printFauxButton('preventMWFromEating','Recover post','If you have recently lost a post to MW, this button will try to recover it')+(siteIs('showThreadURL')?'<br>':'') );
    $('#preventMWFromEating').off().click(function () {$('#'+textArea).val(loadVal('preventMWFromEating',''))});
    $('#'+textArea).blur(function () {if ($('#'+textArea).val()&&$('#'+textArea).val()!="") saveVal('preventMWFromEating',$('#'+textArea).val());});

    //// misc tool buttons
    if (toggleHash["Show toolkit"])
    {
        $('#'+editorArea).append("<div align='right' id='MWGoldToolsContainer'>");
        if (!analysisHash) analysisHash = loadVal('analysisHash',{});
        var uList = [];
        if (!threadID || !analysisHash["Threads"] || !analysisHash["Threads"][threadID] || !analysisHash["Threads"][threadID]["authors"])
        {   log('Thread ('+threadID+') not analysed properly or at all, failed to generate list of users');
        }else uList = Object.keys(analysisHash["Threads"][threadID]["authors"]);
        generateToolkit(textArea,uList);
    }

    //// save/load functionality    
    if (toggleHash["Show game-wide templates"]&&threadID)
    {
        $('#'+editorArea).append("<fieldset id='MWGoldGamewideButtonContainer'><legend class='smalltext'>Game-wide templates</legend></fieldset>");
        if (!gamewideHash) gamewideHash = loadVal('gamewideHash',{});
        makeContainer(textArea, "Gamewide", gamewideHash, addGameWideButtons, gameID);
    }
    if (toggleHash["Show site-wide templates"])
    {
        $('#'+editorArea).append("<fieldset id='MWGoldSitewideButtonContainer'><legend class='smalltext'>Site-wide templates</legend></fieldset>");
        if (!sitewideHash) sitewideHash = loadVal('sitewideHash',{});
        makeContainer(textArea, "Sitewide",sitewideHash,addSiteWideButtons, null);
    }
    // don't do the fun stuff if that's undesirable
    if ("none"!=gameID&&toggleHash["Show dice composer"]&&threadID) 
    {
        if (!myGames) myGames=loadVal('myGames',{});
        if (myGames[gameID]){



        }else{ // use the player thingo

            //// setting up sheets for autorolls
            // 0. create the basics
            $('#MWGoldToolsContainer').prepend("<fieldset id='MWGoldCharacterContainer'><legend class='smalltext'>Dice roll generator</legend>"// style='border-radius: 25px; border: 1px solid #34282c'>"
                +"<select style='max-width:50%' id='MWGoldSheetSelector'></select><br /><div id='MWGoldSweetShitContainer'></div></fieldset>");
            $('#MWGoldSheetSelector').append("<option>None</option>");

            // 1. Load the list of sheets
            if (!sheetHash) sheetHash = GM_getValue("sheetHash",null);
            if (!sheetHash) getListofSheets(false);
            log("sheetHash.length: "+Object.keys(sheetHash).length);
            var charNames = Object.keys(sheetHash);
            for (var i in charNames) 
            {
              $('#MWGoldSheetSelector').append("<option>" + charNames[i] + "</option>");
            }
            
            // 2. remember the last sheet selected in this game and have it selected by default
            if (!curByGame) curByGame = loadVal("curByGame",{});
            log("curByGame: "+curByGame+" ... key: "+gameID+" val: "+curByGame[gameID]);
            if (curByGame[gameID]) 
            {
                $('#MWGoldSheetSelector').val(curByGame[gameID]); 
                
                // 2.5. Create the junk for autocompleting rolls and shit
                var errorCode = printSweetShit(textArea, curByGame[gameID]);
                if (errorCode && debugMode) log("if (curByGame[gameID]): Error in printSweetShit: "+errorCode);
            }

            // 3. When a new sheet is selected, remember it instead and change the current junk to that sheet's
            $('#MWGoldSheetSelector').change(function() 
            {
                if (!curByGame) curByGame = loadVal("curByGame",{});
                curByGame[gameID]=$('#MWGoldSheetSelector').val();
                saveVal("curByGame",(curByGame));
                clearBuffs();

                if ($('#MWGoldSheetSelector').val()=="None") 
                {
                    $('#MWGoldSweetShitContainer').hide();
                    curSheet=null; 
                    if ($('#loadSheet').length>0) $('#loadSheet').remove();
                } else {
                    $('#MWGoldSweetShitContainer').html("<b>MWGold:</b> Sweet Shit: Loading...").show();
                    curSheet = $('#MWGoldSheetSelector').val();

                    // 4. Create the junk for autocompleting rolls and shit
                    var errorCode = printSweetShit(textArea, curSheet);
                    if (errorCode && debugMode) log("$('#MWGoldSheetSelector').change: Error in printSweetShit: "+errorCode);
                }
            });
        }
    }}

function printSweetShit (textArea, sheetName) {
    loadedSheets = loadVal("loadedSheets",{});
    if (!sheetName || !sheetHash[sheetName]) return "curSheet ("+sheetName+") and/or sheetHash ("+sheetHash.length+") not defined!";
    var sheetID = sheetHash[sheetName];
    if (sheetID==null) return "sheetName: "+sheetName+" was not found in sheetHash";
    if (curSheet!=sheetName) curSheet=sheetName;

    if (!loadedSheets[curSheet])
    {
        if (!$('#progress').length) {
            $('#MWGoldSweetShitContainer').append('<b>MWGold:</b> <span id="progressText">Initialising...</span>  <div id="progress"></div>');
            $('#progress').progressbar({value: 1});
            $('body').append('<iframe id="deleteme" style="height:0px"></iframe>');// hidden
            if (toggleHash['Show character sheet at bottom of thread']) $('#deleteme').css('width','100%').css('height','450px').show();

            $('#MWGoldSweetShitContainer').append(printFauxButton("refresh","Refresh "+curSheet,"Refresh "+curSheet+" once it's done loading"));
            $('#refresh').click(function () {$(this).remove();printSweetShit(textArea, sheetName);});
            log('url for get: '+knownURLS["sheetURL"]+sheetHash[curSheet]);
            $('#progress').val(10);
            $('#progressText').html("Finding sheet...");
            $('#deleteme').on('load',function () {waitForFire(scrape,$('#deleteme')[0].contentDocument,sheetID);});
            $('#deleteme').attr('src',knownURLS["sheetURL"]+sheetHash[curSheet]);
        }else{
            putAnAlertSomewhere("Automatic loading failed: you'll need to go to the character sheet manually","#MWGoldSweetShitContainer");
            $('#MWGoldSweetShitContainer').append(printFauxButton("loadShitBelow","Open "+curSheet,"Open "+curSheet+" in a new tab, then click the \"load to MW\" button once the character sheet has loaded"));
            $('#loadShitBelow').click(function () {
                window.open(knownURLS["sheetURL"]+sheetHash[curSheet]); 
                $('#MWGoldSweetShitContainer').html("Refresh this page once the sheet has loaded");
                $('#MWGoldSweetShitContainer').append(printFauxButton("refresh","Refresh "+curSheet,"Refresh "+curSheet+" once it's done loading"));
                $('#refresh').click(function () {
                    $(this).remove();
                    //sheetHash=loadVal('sheetHash',{});
                    printSweetShit(textArea, sheetName);});
            });     
            return "sheet has not been loaded yet: automatic load failed";
        }
        return "sheet has not been loaded yet: attempting to load it from sheet";
    }

    // wait... wow... we're actually finished error checking?!?!?!
    if (!toggleHash['Show character sheet at bottom of thread']&&$('#deleteme').length>-1) $('#deleteme').remove();
    else if (toggleHash['Show character sheet at bottom of thread']) $('<iframe id="charsheet"></iframe>').attr('src',knownURLS["sheetURL"]+sheetHash[curSheet]).appendTo('body');
    $('#MWGoldSweetShitContainer').html(" "); // blank whatever nonsense we had
    $('#MWGoldSheetSelector').before(printFauxButton("loadSheet","Open sheet","Open selected character in a new tab"));
    $('#loadSheet').click(function () {window.open(knownURLS["sheetURL"]+sheetHash[curSheet]);}); 

    printSweetShitNoCheck('#MWGoldSweetShitContainer',textArea, sheetName, sheetID, '', true);
    $('#MWGoldSweetShitContainer').show();
}

function printSweetShitNoCheck (container, textArea, sheetName, sheetID, rollPrefix, showBuffs) {
    var thisPrefix = "Sheet_"+sheetID; // this is what we need to use for our shit
    var contID = $(container).attr('id');
    log("our prefix string: '"+thisPrefix+"' and sheetID: "+sheetID+" and sheetName: "+sheetName);

    var myHash = loadVal(thisPrefix+"_hash", {});

    // attacks   // stored [weapon name -> {prop -> prop vals}]
    var attacks; 
    if (myHash["attacks"]) attacks = myHash["attacks"]; else attacks={};
    if (myHash["extraAttacks"]) for (var a in myHash["extraAttacks"]) attacks[a]=myHash["extraAttacks"][a];
    //log("Attacks JSONed: "+JSON.stringify(attacks)+" & type: "+ typeof GM_getValue(thisPrefix+"_attacks_type", null)+" & type: "+ typeof GM_getValue(thisPrefix+"_attacks_type", 1));

    if (!attacks || Object.keys(attacks).length<1) {log("this sheet ("+sheetName+") may not have been scraped properly! (no attacks)");}
    else {
        $(container).append("Attacks: <select style='max-width:50%' id='MWGoldSweetAttacks_"+contID+"_"+sheetID+"'><option>Select to roll</option></select> | ");
        for (var a in attacks) {$('#MWGoldSweetAttacks_'+contID+"_"+sheetID).append("<option>"+attacks[a]["Name"]+"</option");}

        $('#MWGoldSweetAttacks_'+contID+"_"+sheetID).change(function () {
            var prettyName = $(this).val();
            if (prettyName=="Select to roll") return false;
            for (var a in attacks) if (attacks[a]["Name"]==prettyName)
                insertAtCaret(textArea, rollPrefix+makeAttackRollString(prettyName, attacks[a]));
        });
    }

    // skills
    var skills; if (myHash["skills"]) skills = myHash["skills"]; else skills="";
    // stored {skill name -> bonus}
    log("Skills JSONed: "+JSON.stringify(skills));

    if (skills=="") {log("this sheet ("+sheetName+") may not have been scraped properly! (no skills)");}
    else {
        $(container).append("Skills: <select class='MWGoldSweetSkills' style='max-width:50%' id='MWGoldSweetSkills_"+contID+"_"+sheetID+"'><option>Select to roll</option></select>");
        for (var s in skills) $('#MWGoldSweetSkills_'+contID+"_"+sheetID).append("<option data-bonus='"+skills[s].replace(/\+/g,'')+"'>"+s+"</option");
        
        $('#MWGoldSweetSkills_'+contID+"_"+sheetID).change(function () {
            var prettyName = $(this).val();
            if (prettyName!="Select to roll")
            {
                var oName=prettyName;
                var bonus = isBuffed(['skills',prettyName.toLowerCase()]);
                if (bonus!=0) oName+=";with "+whichBuffs(['skills',prettyName.toLowerCase()]);
                bonus += parseInt(myHash["skills"][prettyName].replace(/\+/g,''));
                insertAtCaret(textArea, rollPrefix+makeRollString(oName, "1d20+"+bonus));
            }
        });
    }
    
    // spells
    var spells; if (myHash["spells"]) spells = myHash["spells"]; else spells="";
    // stored as {spell name -> prep/cast}
    log("Spells JSONed: "+JSON.stringify(spells));

    if (spells=="") {log("this sheet ("+sheetName+") may not have been scraped properly! (no spells)");}
    else {
        $(container).append("<br/>Spells: <select style='max-width:50%' id='MWGoldSweetSpells_"+contID+"_"+sheetID+"'><option>Select to roll</option></select>");
        for (var s in spells) {
            var prettyS = s;
            if (!isNaN(parseInt(s[0]))) prettyS = s.slice(3);
            $('#MWGoldSweetSpells_'+contID+"_"+sheetID).append("<option>"+prettyS+"</option");
        }

        $('#MWGoldSweetSpells_'+contID+"_"+sheetID).change(function () {
            var prettyName = $(this).val().replace(/\(.*?\)/g,'').replace(/\[.*?\]/g,'').trim();
            if (prettyName=="Select to roll")
                return false;
            var srd = "srd";
            if (myHash["CMB"]) srd = "pfsrd";
            insertAtCaret(textArea,rollPrefix+"[ooc="+prettyName+"]["+srd+"=spell]"+prettyName+"[/"+srd+"][/ooc]");
        });
    }

    // specified attributes
    var curAttributes = myHash;
    var attributes;
    if (myHash['attributes']) attributes = myHash['attributes']; else attributes = defaultAttributes;

    $(container).append(" | Misc: <select class='MWGoldSweetAttributes' style='max-width:50%' id='MWGoldSweetAttributes_"+contID+"_"+sheetID+"'><option>Select to roll</option></select>");
    for (var a in attributes) {
        log("currently processing attribute: "+thisPrefix+"_"+attributes[a]);
        if (!curAttributes[attributes[a]]) delete curAttributes[attributes[a]];
        else {
            var prettyA = attributes[a]; 
            if (prettyAttributes[attributes[a]]) prettyA = prettyAttributes[attributes[a]];
            $('#MWGoldSweetAttributes_'+contID+"_"+sheetID).append("<option data-bonus='"+curAttributes[attributes[a]].replace(/\+/g,'')+"'>"+prettyA+"</option");
        }
    }
    $('#MWGoldSweetAttributes_'+contID+"_"+sheetID).change(function () {
        var prettyName = $(this).val(), realName="";
        if (prettyName=="Select to roll") return false;
        for (var i in prettyAttributes) {if (prettyAttributes[i]==prettyName) {realName = i;break;}}
        if (realName=="") realName=prettyName;
        var bonus = curAttributes[realName].replace(/\+/g,''), oName=prettyName;
        var whatCanBuffThis = [realName.toLowerCase()];
        if (prettyName.endsWith('attack')) whatCanBuffThis.push('attack');
        if (prettyName.startsWith('Fort')) whatCanBuffThis = whatCanBuffThis.concat(['saves','fort']);
        if (prettyName.startsWith('Ref')) whatCanBuffThis = whatCanBuffThis.concat(['saves','ref']);
        if (prettyName.startsWith('Will')) whatCanBuffThis = whatCanBuffThis.concat(['saves','will']);
        var rBuffs = isBuffed(whatCanBuffThis);
        if (rBuffs) {bonus += rBuffs; oName+=";with "+whichBuffs(whatCanBuffThis);}
        insertAtCaret(textArea, rollPrefix+makeRollString(oName, "1d20+"+bonus));
    });

    $(container).parent().prepend("<div style='float:left;max-width:25%'>"+printFauxButton('hideshowBuffs_'+contID+"_"+sheetID,'Buffs and conditionals','Click to hide/show the list of buffs and conditional modifiers this character has specified on their sheet.')+"<ul hidden id='buffs_"+contID+"_"+sheetID+"'></ul></div>");
    $('#hideshowBuffs_'+contID+"_"+sheetID).click(function () {$(this).next().slideToggle();});
    if (myHash["skillConditionals"]||myHash["attackConditionals"]||myHash["saveConditionals"]||myHash["buffBools"])
    {
        if (myHash["buffBools"]&&showBuffs)
        {
            for (var k in myHash["buffBools"]) 
            {
                $('#buffs_'+contID+"_"+sheetID).append('<li><input type="checkbox" checked data-key="'+k+'">'+k+'</input></li>');
                $('#buffs_'+contID+"_"+sheetID+' li:last input').change(function () {
                    var key = $(this).attr('data-key');
                    if ($(this).is(':checked'))
                        buffsOn(key,myHash['buffBools'][key]);
                    else
                        buffsOff(key);     
                });
                buffsOn(k,myHash['buffBools'][k]);
            }
        }
        if (myHash["attackConditionals"])
        {
            if (myHash["buffBools"]) $('#buffs_'+contID+"_"+sheetID).append("<hr/>");
            for (var k in myHash["attackConditionals"]) 
                {
                    $('#buffs_'+contID+"_"+sheetID).append('<li><input type="checkbox" data-key="'+myHash["attackConditionals"][k]+'">'
                                    +myHash["attackConditionals"][k]+'</input></li>');
                    // $('#buffs li:last input').change(function () {
                    //     var key = $(this).attr('data-key');
                    //     if ($(this).is(':checked'))
                    //         buffsOn[key]=key;
                    //     else
                    //         if (buffsOn[key]) delete buffsOn[key];     
                    // });
                }
        }
        if (myHash["skillConditionals"])
        {
            if (myHash["attackConditionals"]||myHash["buffBools"]) $('#buffs_'+contID+"_"+sheetID).append("<hr/>");
            for (var k in myHash["skillConditionals"]) 
                {$('#buffs_'+contID+"_"+sheetID).append('<li><input type="checkbox" data-key="'+k+'">'
                                    +k+': '+myHash["skillConditionals"][k].join(', ')+'</input></li>');}
        }
        if (myHash["saveConditionals"])
        {
            if (myHash["skillConditionals"]||myHash["attackConditionals"]||myHash["buffBools"]) $('#buffs_'+contID+"_"+sheetID).append("<hr/>");
            for (var k in myHash["saveConditionals"]) 
                {$('#buffs_'+contID+"_"+sheetID).append('<li><input type="checkbox" data-key="'+k+'">'
                                    +myHash["saveConditionals"][k]+'</input></li>');}
        }

    }else{
        $('#buffs_'+contID+"_"+sheetID).append("<li style='text-decoration:underline'>No buffs or conditional modifiers found for this character, click to learn how to specify them</li>");
        $('#buffs_'+contID+"_"+sheetID+' li').click(function () {$(this).remove(); //$('#MWGoldCharacterContainer').append(
            if ($('#BuffInstructional').length>0) $('#BuffInstructional').dialog("show"); else{
            $('<div id="BuffInstructional" title="Specifying Gold Variables in Your Character Sheet and You" hidden></div>').dialog({width:800})
            .position({my:'center bottom', at:'center top', of:container}).appendTo('head');
            fixCloseButtonOnDialog();
            $('div.ui-dialog[aria-describedBy=BuffInstructional]').append("<div align='left'>Options can be set in your MW character sheet (including buffs)"
            +"<br/>  by entering some lines beginning with '!' and specifying the values there, separated by ':'s.  "
            +"<br/>  "
            +"<br/>  Attributes are which boxes from the sheet you want the script to get. It gets everything it needs "
            +"<br/>  by default, so it's just extra junk you want. Or you can put an '!' to not get certain boxes eg:"
            +"<br/>  <span class='codeline'>!attributes: !CasterLevel, ActionPoints, SpellSlots1, !AC, !CMD</span>"
            +"<br/>  "
            +"<br/>  Buffs are toggles that apply bonuses to your rolls."
            +"<br/>  \"!buff: name:affects:magnitude:affects:magnitude\". Multiple buffs must be on separate lines. "
            +"<br/>      You can also delete with ! (even though none are given by default at this stage). eg: "
            +"<br/>  <span class='codeline'>!buff:guidance:  attack:1:skills:1:saves:1</span>"
            +"<br/>  <span class='codeline'>!buff:!powerAttack</span>"
            +"<br/>  <span class='codeline'>!buff:divine favour:attack:1:damage:1</span>"
            +"<br/>  <span class='codeline'>!buff: power attack:   attack:-1:   damage:+2</span>"
            +"<br/>  "
            +"<br/>  Attacks are extra attacks to add to the \"Attacks\" drop-down list (since MW sheets only allow for four)"
            +"<br/>  \"!attack\" specifies additional weapons you might want to attack with. Only name, attack, and damage are required. "
            +"<br/>      Unused options in the example: Range, Weight, Ammo, Special. eg:"
            +"<br/>  <span class='codeline'>!attack:Spiked Gauntlet:attack:+6:Damage:1d4+4:Crit:x2:Size:M(light):Type:P</span>"
            +"<br/>  "
            +"<br/>  Conditional modifiers are notes at the bottom of your Defences, Attacks, and Skills."
            +"<br/>  Save and attack conditional modifiers: specify text to add to the bottom of defences roll or attack rolls."
            +"<br/>      Multiple commands must be on separate lines. eg:"
            +"<br/>  <span class='codeline'>!saveconditioNal: +1 luck to saves or dodge to AC if War Mind is active</span>"
            +"<br/>  <span class='codeline'>!attackconditional: +2 damage vs humanoids</span>"
            +"<br/>  "
            +"<br/>  Skill conditional modifiers are slightly more complex as you need to specify the skill. "
            +"<br/>  <span class='codeline'>!skillconditional: Spellcraft: +2 to id magic items</span>"
            +"<br/>  <span class='codeline'>!skillConditional: Perception:+8 to detect scents</span>"
            +"<br/>  "
            +"<br/>  Last one is the easiest one. You don't need to include bonuses from buffs, the script will do that for you."
            +"<br/>     if you don't specify this, it will use the default: 1d3+@{StrMod}"
            +"<br/>  <span class='codeline'>!unarmeddamage: 1d2+@{StrMod}</span>"
            +"<br/>  <span class='codeline'>!unarmeDDamage: 1d8+1.5*@{StrMod}</span>"
            +"<br/>  "
            +"<br/>  Note: spaces and capital letters don't matter except for skills and attributes which must be capitalised.</div>");
        }});
    }

    return false;}
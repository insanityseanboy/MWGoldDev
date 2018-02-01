
function quench(){
    $('#skills tr.skillslot td.name input').focus(function _quenchFocus(e){
        var box = $(e.target).parent().siblings('td.char').find('input');
        box.attr('data-mong',box.is(':checked'));
        // log('mong: '+box.is(':checked'));
    });
    $('#skills tr.skillslot td.name input').blur(function _quenchBlur(e){
        var box = $(e.target).parent().siblings('td.char').find('input');
        if ((box.attr('data-mong')=='true')!=box.is(':checked')) {
            box.prop('checked',(box.attr('data-mong')=='true')?true:false);
            saveSheetShit(box);}
        // log('mong: '+box.attr('data-mong'));
    });
    $('#skills tr.skillslot td:nth-child(8) input').blur(function _totalRanks(){
        var totalskillranks = 0;
        $('#skills tr.skillslot td:nth-child(8) input').each(function __countRanks() {
            if (parseInt($(this).val()))
                totalskillranks += parseInt($(this).val());
        });
        $('#totalranks').text(totalskillranks);
    });
    $('#skills tr.skillslot td:nth-child(8) input:first').blur();
}
function saveSheetShit(node)
{
    if ($.isArray(node)) {for (var n in node) saveSheetShit(node[n]);} else
    {$(node)[0].dispatchEvent(new Event('change', {bubbles:true, target:$(node)[0]}));}
}
function highlightChanges(sheetID){
    // highlight changes
    if (!sheetCollectorHash) sheetCollectorHash = loadVal('sheetCollectorHash',{});
    if (!sheetCollectorHash[sheetID]) sheetCollectorHash[sheetID] = {};
    $('input:not(:hidden)[name]').add('textArea:not(:hidden)[name]').each(function (){
        if ( sheetCollectorHash[sheetID][$(this).attr('name')] && (sheetCollectorHash[sheetID][$(this).attr('name')]!=$(this).val()) ) 
        {
            log('change detected in '+$(this).attr('name')+": was: "+sheetCollectorHash[sheetID][$(this).attr('name')]+" now: "+$(this).val());
            $(this).css('background-color','#eeeeff');//.addClass('recentlyChanged')
            $(this).attr('title',$(this).attr('title')+"\nPreviously: "+sheetCollectorHash[sheetID][$(this).attr('name')]+" on "+(new Date(sheetCollectorHash[sheetID]['lastScrape'])).toLocaleString());
        }
        //TODO: Restore: sheetCollectorHash[sheetID][$(this).attr('name')]=$(this).val();
    }).promise().done(function () {sheetCollectorHash[sheetID]['lastScrape']=Date.now();saveVal('sheetCollectorHash',sheetCollectorHash);});
}
function improveSheet(doc,sheetID){
    if (!knownFeats) knownFeats = loadVal('knownFeats',[]);
    if (!knownGear) knownGear=loadVal('knownGear',[]);
    if (!knownSpells) knownSpells=loadVal('knownSpells',[]);

    highlightChanges(sheetID);

    $('#showToggles').append("<hr>Pin to a game: <select id='pin2game'><option>Select a game</option></select>");
    $('#showToggles').append("<br/>Copy/paste all values: "+printFauxButton('copyAll','Copy','Copy as much of this sheet as possible')+printFauxButton('pasteAll','Paste','Paste whatever is currently copied'));
    $('#copyAll').click(function () {if (!sheetCopyPasteHash) sheetCopyPasteHash = loadVal('sheetCopyPasteHash',{});
        $('input:not(:hidden)[name]').each(function (){sheetCopyPasteHash[$(this).attr('name')]=$(this).val();}).promise().done(function () {saveVal('sheetCopyPasteHash',sheetCopyPasteHash);
        putAnAlertSomewhere('Done!','#MWGoldCPToggles');});});
    $('#pasteAll').click(function () {if (!sheetCopyPasteHash) sheetCopyPasteHash = loadVal('sheetCopyPasteHash',{});
        $('input:not(:hidden)[name]').each(function (){if (sheetCopyPasteHash[$(this).attr('name')]) {$(this).val(sheetCopyPasteHash[$(this).attr('name')]); saveSheetShit(this);}});});

    if (!sheetCollectorHash) sheetCollectorHash = loadVal('sheetCollectorHash',{});            
    $('#showToggles').append("<br/>Restore last version: ");
    if (sheetCollectorHash[sheetID]&&Object.keys(sheetCollectorHash[sheetID]).length==1) 
        $('#showToggles').append("Sheet was empty last time it was cached. Sorry =(");
    else if (sheetCollectorHash[sheetID]) {
        $('#showToggles').append(printFauxButton('restoreOMG','Restore','Restore as much of this sheet as possible'));
        $('#restoreOMG').click(function __magicRestoreCode() {
            log('known vals: '+Object.keys(sheetCollectorHash[sheetID]));
            $('input:not(:hidden)[name]').add('textArea:not(:hidden)[name]').each(function (){
                if ( sheetCollectorHash[sheetID][$(this).attr('name')] ) 
                {
                    log('restoring '+$(this).attr('name')+" to: "+sheetCollectorHash[sheetID][$(this).attr('name')]);
                    $(this).val( sheetCollectorHash[sheetID][$(this).attr('name')] );
                    saveSheetShit($(this));
                }
            });
        });
    }else $('#showToggles').append("No data found. Sorry =(");

    // pin to game logic
    if (!myGames) myGames=loadVal('myGames',"");
    if (myGames=="") getMyGames();
    for (var g in myGames) {$('#pin2game').append('<option value="'+g+'">'+myGames[g].name+'</option>');
        if (myGames[g]['pinnedNPCs'][sheetID]||myGames[g]['pinnedPCs'][sheetID]) $('#pin2game option:last').prop('selected','true');
    }
    $('#pin2game').change(function () {
        if ($('#pin2game option:selected').text()=="Select a game") return;
        var gID=$('#pin2game option:selected').val(),gName=$('#pin2game option:selected').text();
        myGames=loadVal('myGames',{});
        sheetHash=loadVal('sheetHash',{});
        if ( Object.values(sheetHash).includes(sheetID) ) { // if it's an NPC
            if ($('#character_other_notes').length>0) 
                myGames[gID]['pinnedNPCs'][sheetID]=$('#sheet > div:nth-child(1) input[name=name]').val();
            else
                myGames[gID]['pinnedNPCs'][sheetID]=$('#info input[name=Name]').val();
        }else{
            if ($('#character_other_notes').length>0) 
                myGames[gID]['pinnedPCs'][sheetID]=$('#sheet > div:nth-child(1) input[name=name]').val();
            else
                myGames[gID]['pinnedPCs'][sheetID]=$('#info input[name=Name]').val();
        }
        if ($('#character_other_notes').length<1) 
            scrapeWithName(document, sheetID, $('#info > tbody > tr:nth-child(1) > td:nth-child(1) > input[name=Name]').val() );
        saveVal('myGames',myGames);
    });

   // put in the point buy calculator
    if ($('#statblock tbody tr:first td:first').length>0) {
        $('#statblock tbody tr:first td:first').html( printFauxButton('statSumButton','Calculate','Opens a mini-window for tallying stats'));
        $('#statSumButton').addClass('smallfont btn btn-primary').click(function () { createPBDialog(true); });
    }

    if ($('#character_other_notes').length>0) return;  // finish here if it's PF Experimental

    // generic usefulness
    if (toggleHash['Show featstore']) $('#sheet > div:nth-child(1)').css('height','1400px'); else $('#sheet > div:nth-child(1)').css('height','1250px');
    if ($('head title').html().includes('Pathfinder')) {$('#sheet > div:nth-child(2)').css('height','1250px'); $('#sheet > div:nth-child(3)').css('height','750px');}
    else $('#sheet > div:nth-child(3)').css('height','1300px');
    $(window).scrollTop(loadVal('ScrollPos_'+sheetID,$(window).scrollTop()));
    $('#totalweight').html(parseFloat(parseFloat($('#totalweight').html()).toFixed(2)));
    $('#gear tr.slot td:nth-child(2) input').blur(function _fixWt(){$('#totalweight').html(parseFloat(parseFloat($('#totalweight').html()).toFixed(2)))});

    if (toggleHash['Quench auto-crossclassing when skill name changes']) quench();

    // Swap weight/location columns
    $('#gear tr:nth-child(1) > td').append(printFauxButton('swapItemCols','Swap','Swaps the contents of the weight & location columns'));
    $('#swapItemCols').css('float','right').click(function () { //.css('color','black')
        $('#gear tr.slot').each(function () {
            var t = $(this).find('td:nth-child(2) > input').val();
            $(this).find('td:nth-child(2) > input').val($(this).find('td:nth-child(3) > input').val());
            $(this).find('td:nth-child(3) > input').val(t);
            saveSheetShit([$(this).find('td:nth-child(2) > input'),$(this).find('td:nth-child(3) > input')]);
        });
    });

    // Save/load inventory
    $('#currency').before('<table style="width:100%" class="spellssheets"><tbody id=backpackContainer><tr colspan="6" class="title"><td colspan="6">MWGold: Backpacks</td></tr></tbody></table>');
    if (!toggleHash['Show item backpacks']) $('#backpackContainer').hide();
    if (!nonBoolSettings) nonBoolSettings=loadVal('nonBoolSettings',nonBoolDefaults);
    for (var i=1,glob="Global",x = nonBoolSettings["Number of item backpacks"];i<1+x['global']+x['local'];i++){
        if (i==1+x['global']) glob="";
        var tit = i, v = loadVal('Backpackstore_'+(glob!=""?glob:sheetID)+'_'+i,false);
        if (v) tit=tit+' ('+v['Name']+'): '+(Object.keys(v).length-1)+' items'; else tit+=': empty';
        if (i%2) $('#backpackContainer').append('<tr colspan="6"></tr>');
        $('#backpackContainer tr:last').append('<td colspan="2">'+(glob!=""?glob+' ':"")+tit+'</td><td align="right" colspan="1">'
            +printFauxButton('backpackSave'+glob+i,'Save','Save this list of items in slot '+i+(glob!=""?' so that it can be accessed by other sheets':''))//+'</td><td>'
            +printFauxButton('backpackLoad'+glob+i,'Load','Load this list of items from slot '+i+(glob!=""?' so that it can be accessed by other sheets':''))//+'</td><td>'
            +printFauxButton('backpackForget'+glob+i,'Forget','Clear this list of items from'+(glob!=""?' '+glob:"")+' slot '+i)+'</td>');
        $('#backpackSave'+glob+i).click(function () {var glob="",i = parseInt($(this).attr('id').replace(/\D/g,''));if(i<x['global']) glob="Global"; var v = backpackstore('Backpackstore_'+(glob!=""?glob:sheetID)+'_'+i);if (v) $('#backpackContainer tr:eq('+(Math.ceil(i/2))+') td:eq('+2*(1-(i%2))+')').html(glob+' '+i+' ('+v['Name']+'): '+(Object.keys(v).length-1)+' items');});
        $('#backpackLoad'+glob+i).click(function () {var glob="",i = parseInt($(this).attr('id').replace(/\D/g,'')); if(i<x['global']) glob="Global"; backpackpour('Backpackstore_'+(glob!=""?glob:sheetID)+'_' +i, true);});
        $('#backpackForget'+glob+i).click(function () {var glob="",i = $(this).attr('id').replace(/\D/g,''); if(i<x['global']) glob="Global"; GM_deleteValue('Backpackstore_'+(glob!=""?glob:sheetID)+'_' + i); GM_deleteValue('Backpackstore_'+(glob!=""?glob:sheetID)+'_' + i+"_type"); $('#backpackContainer tr:eq('+(Math.ceil(i/2))+') td:eq('+2*(1-(i%2))+')').html(glob+' '+i+': empty');});
    }

    // Save/load feats
    $('#feats').after('<table style="width:100%" class="spellssheets"><tbody id=featContainer><tr colspan="8" class="title"><td colspan="8">MWGold: Featstore</td></tr><tr style="text-align:center" colspan="8" class="header"><td colspan="2">Column 1</td><td colspan="2">Column 2</td><td colspan="2">Column 3</td><td colspan="2">Column 4</td></tr></tbody></table>');
    if (!toggleHash['Show featstore']) $('#featContainer').hide();
    if (!nonBoolSettings) nonBoolSettings=loadVal('nonBoolSettings',nonBoolDefaults);
    for (var i=1,glob="Global",x = nonBoolSettings["Number of feat columns"];i<x['global']+x['local']+1;i++){
        if (i==x['global']+1) glob="";
        var tit = i, v = loadVal('Featstore_'+(glob!=""?glob:sheetID)+'_'+i,false);
        if (v) tit=tit+' ('+v['Name']+'): '+(Object.keys(v).length-1)+' feats'; else tit+=': empty';
        if (1==(i%4)) $('#featContainer').append('<tr colspan="8"></tr>');
        $('#featContainer tr:last').append('<td colspan="1">'+(glob!=""?glob+' ':"")+tit+'</td><td align="right" colspan="1">'
            +printFauxButton('featSave'+glob+i,'Save','Save this list of feats in slot '+i+(glob!=""?' so that it can be accessed by other sheets':''))//+'</td><td>'
            +printFauxButton('featLoad'+glob+i,'Load','Load this list of feats from slot '+i+(glob!=""?' so that it can be accessed by other sheets':''))//+'</td><td>'
            +printFauxButton('featForget'+glob+i,'Forget','Clear this list of feats from'+(glob!=""?' '+glob:"")+' slot '+i)+'</td>');
        $('#featSave'+glob+i).click(function () {
            var glob="",i = parseInt($(this).attr('id').replace(/\D/g,''));
            if(i<=nonBoolSettings["Number of feat columns"]['global']) glob="Global"; 
            var v = featstore('Featstore_'+(glob!=""?glob:sheetID)+'_'+i,(i-1)%4);
            if (v) $('#featContainer tr:eq('+(Math.floor((i-1)/4)+2)+') td:eq('+(2*((i-1)%4))+')').html(glob+' '+i+' ('+v['Name']+'): '+(Object.keys(v).length-1)+' feats');
        });
        $('#featLoad'+glob+i).click(function () {
            var glob="",i = parseInt($(this).attr('id').replace(/\D/g,'')); 
            if(i<=nonBoolSettings["Number of feat columns"]['global']) glob="Global"; featpour('Featstore_'+(glob!=""?glob:sheetID)+'_' +i, true,(i-1)%4);});
        $('#featForget'+glob+i).click(function () {var glob="",i = $(this).attr('id').replace(/\D/g,''); if(i<nonBoolSettings["Number of feat columns"]['global']) glob="Global"; 
            GM_deleteValue('Featstore_'+(glob!=""?glob:sheetID)+'_' + i); GM_deleteValue('Featstore_'+(glob!=""?glob:sheetID)+'_' + i+"_type"); 
            $('#featContainer tr:eq('+(Math.floor((i-1)/4)+2)+') td:eq('+(2*((i-1)%4))+')').html(glob+' '+i+': empty');});
    }


    // Save/load spell shiz
    $('#spellstuff td:first').prepend('<table style="width:100%" cellspacing="0" class="spellssheets"><tbody id=spellControlsContainer><tr colspan="4" class="title"><td colspan="4">MWGold: Spell sheets</td></tr></tbody></table>');
    if (!toggleHash['Show spell sheets']) $('#spellControlsContainer').hide();
    for (var i=1;i<1+nonBoolSettings["Number of spell sheets"]['global'];i++){
        var tit = i, v = loadVal('Spellstore_global_'+i,false);
        if (v) tit=tit+' ('+v['Name']+'): '+(Object.keys(v).length-1)+' spells'; else tit+=': empty';
        $('#spellControlsContainer').append('<tr colspan="4"><td colspan="3">Global '+tit+'</td><td align="right" colspan="1">'
            +printFauxButton('spellbookSaveGlobal'+i,'Save','Save this list of spells in slot '+i+' so that it can be accessed by other sheets')//+'</td><td>'
            +printFauxButton('spellbookLoadGlobal'+i,'Load','Load this list of spells from slot '+i+' so that it can be accessed by other sheets')//+'</td><td>'
            +printFauxButton('spellbookForgetGlobal'+i,'Forget','Clear this list of spells from global slot '+i)+'</td></tr>');
        $('#spellbookSaveGlobal'+i).click(function () {var i = parseInt($(this).attr('id').replace(/\D/g,'')), v = spellstore('Spellstore_global_'+i);if (v) $('#spellControlsContainer tr:eq('+i+') td:first').html('Global '+i+' ('+v['Name']+'): '+(Object.keys(v).length-1)+' spells');});
        $('#spellbookLoadGlobal'+i).click(function () {spellpour('Spellstore_global_' +$(this).attr('id').replace(/\D/g,''), true);});
        $('#spellbookForgetGlobal'+i).click(function () {var i = $(this).attr('id').replace(/\D/g,''); GM_deleteValue('Spellstore_global_' + i); GM_deleteValue('Spellstore_global_' + i+"_type"); $('#spellControlsContainer tr:eq('+i+') td:first').html('Global '+i+': empty');});
    }
    for (var i=1;i<1+nonBoolSettings["Number of spell sheets"]['local'];i++){
        var tit = i, v = loadVal('Spellstore_'+sheetID+'_'+i,false);
        if (v) tit=tit+' ('+v['Name']+'): '+(Object.keys(v).length-1)+' spells'; else tit+=': empty';
        $('#spellControlsContainer').append('<tr colspan="4"><td colspan="3">'+tit+'</td><td align="right" colspan="1">'
            +printFauxButton('spellbookSave'+i,'Save','Save this list of spells in slot '+i)//+'</td><td>'
            +printFauxButton('spellbookLoad'+i,'Load','Load this list of spells from slot '+i)//+'</td><td>'
            +printFauxButton('spellbookForget'+i,'Forget','Clear this list of spells from slot '+i)+'</td></tr>');
        $('#spellbookSave'+i).click(function () {var i = parseInt($(this).attr('id').replace(/\D/g,'')),v=spellstore('Spellstore_'+sheetID+'_'+i);if (v) $('#spellControlsContainer tr:eq('+(i+2)+') td:first').html(i+' ('+v['Name']+'): '+(Object.keys(v).length-1)+' spells');});
        $('#spellbookLoad'+i).click(function () {spellpour('Spellstore_'+sheetID+'_' +$(this).attr('id').replace(/\D/g,''), true);});
        $('#spellbookForget'+i).click(function () {var i = parseInt($(this).attr('id').replace(/\D/g,'')); GM_deleteValue('Spellstore_'+sheetID+'_' + i); GM_deleteValue('Spellstore_'+sheetID+'_' + i+"_type"); $('#spellControlsContainer tr:eq('+(i+2)+') td:first').html(i+': empty');});
    }
    $('#spellControlsContainer').append('<tr></tr>');

    // logic for spells to be moved around and shit
    $('a[title="Sort by Number of times cast, memorized, or manifested"]').html("#Mem");
    $('table.spelllist').parent().css('padding-right','10px');
    $('table.spelllist td.name').each(function () { //log('got one');
        var name=$(this).find('input').attr('name');

        $(this).parent().append("<span style='margin: 3px'>"+printFauxButton(name+'spacer','+','Insert blank line')+printFauxButton(name+'killer','–','Remove this line')+"</span>"); //+'&nbsp'

        $('#'+name+'killer').addClass('spellspacer').css('display','inline').click(function(){ //.hide()
            var IDclicked=$(this).parent().index();
            var curNode=$(this).parents('table.spelllist').find('tr:last');

            for (var i=$(curNode).index(),lastname="",lastmem="";i>=IDclicked;i--)
            {
                var thisname=$(curNode).find('td.name input').val();
                var thismem=$(curNode).find('td.mem input').val();
                if (lastname!=thisname||thismem!=lastmem){
                    $(curNode).find('td.name input').val(lastname);
                    $(curNode).find('td.mem input').val(lastmem);
                    lastname=thisname;lastmem=thismem;
                    saveSheetShit([$(curNode).find('td.name input'),$(curNode).find('td.mem input')]);
                }
                curNode=$(curNode).prev();
            }
        });
        $('#'+name+'spacer').addClass('spellspacer').css('display','inline').click(function(){ //.hide()
            var IDclicked=$(this).parent().index()+1;
            var curNode=$(this).parents('table.spelllist').find('tr:nth-child('+IDclicked+')'), rowsInTable=$(curNode).siblings('tr').length;

            for (var i=IDclicked,lastname="",lastmem="";i<=rowsInTable;i++)
            {
                var thisname=$(curNode).find('td.name input').val();
                var thismem=$(curNode).find('td.mem input').val();
                if (lastname!=thisname||thismem!=lastmem){
                    $(curNode).find('td.name input').val(lastname).change();
                    $(curNode).find('td.mem input').val(lastmem).change();
                    lastname=thisname;lastmem=thismem;
                    saveSheetShit([$(curNode).find('td.name input'),$(curNode).find('td.mem input')]);
                }
                curNode=$(curNode).next();
            }
        });
        //$(this).parent().hover(function(){$('#'+name+'spacer').show();$('#'+name+'killer').show();},function(){$('.spellspacer').hide();});
    });

    // put in the autoselectors
    if (toggleHash['Show item suggestions'])
    $("input.name[name*='Gear']").autocomplete({
      minLength: 3,
      source: knownGear,
      position: {  collision: "flip"  },
      focus: function( event, ui ) {
        $( this ).val( ui.item.label ); 
        return false;
      },
      select: function( event, ui ) {
        $( this ).val( ui.item.label ); 
        if (ui.item.weight&&!toggleHash['Use weight column for item costs']) $( "input[title="+$( this ).attr('name')+"W]" ).val( ui.item.weight );
        if (ui.item.cost&&toggleHash['Tally gold spent in Currency box']) $('textarea[title=Cash]').val($('textarea[title=Cash]').val()+"\n-"+ui.item.cost+"gp ("+ui.item.label+")");
        if (ui.item.cost&&toggleHash['Use weight column for item costs']) $( "input[title="+$( this ).attr('name')+"W]" ).val( ui.item.cost );
        return false;
      }
      }).autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li class='smallfont'>" ) 
        .append( "<div>"+item.label+"</div>" )//+info
        .appendTo( ul );
    };

    if (toggleHash['Show feat suggestions'])
    $("input[name*='Feat']").autocomplete({
      minLength: 3,
      source: knownFeats,
      position: {  collision: "flip"  }
      }).autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li class='smallfont'>" ) 
        .append( "<div style='word-wrap:normal'>"+item+"</div>" )//+info
        .appendTo( ul );
    };

    if (toggleHash['Show spell suggestions'])
    $("td.name input[name*='Spell']").autocomplete({
      minLength: 4,
      source: knownSpells,
      position: {  collision: "flip"  }
    });
}

function backpackstore(storeName)
{
    var n = prompt('What would you like to call this backpack?');
    if (!n) return false;
    var itemHash={"Name":n};
    $('#gear tr.slot td:nth-child(1) input').each(function _backpackstore() {
        var num = $(this).attr('name');
        var nam = $(this).val();
        var wt = $(this).parent().next().find('input').val();
        var loc = $(this).parent().next().next().find('input').val();
        if (!nam && !wt && !loc) return;
        if (""==nam && ""==wt && loc=="") return;
        itemHash[num]=[nam,wt,loc];
    });
    saveVal(storeName,itemHash);
    return itemHash;
}
function backpackpour(storeName,cleanseIt)
{
    var itemHash=loadVal(storeName,{});
    $('#gear tr.slot td:nth-child(1) input').each(function _backpackspore() {
        var num = $(this).attr('name');
        var wt = $(this).parent().next().find('input');
        var loc = $(this).parent().next().next().find('input');
        if (!itemHash[num]) if (cleanseIt) itemHash[num]=["","",""]; else return;
        if (itemHash[num][0]==$(this).val()&&wt.val()==itemHash[num][1]&&loc.val()==itemHash[num][2]) return;
        $(this).val(itemHash[num][0]);
        wt.val(itemHash[num][1]);
        loc.val(itemHash[num][2]);
        saveSheetShit([wt,loc,this]);
    });
}
function spellstore(storeName)
{
    var n = prompt('What would you like to call this spellbook sheet?');
    if (!n) return false;
    var spellHash={"Name":n};
    $('.spelllist td.name input').each(function _spellstore() {
        var num = $(this).attr('name');
        var nam = $(this).val();
        var mem = $(this).parent().siblings('td.mem').find('input').val();
        if (!nam && !mem) return;
        if (""==nam && ""==mem) return;
        spellHash[num]=[nam,mem];
    });
    saveVal(storeName,spellHash);
    return spellHash;
}
function spellpour(storeName,cleanseIt)
{
    var spellHash=loadVal(storeName,{});
    $('.spelllist td.name input').each(function _spellspore() {
        var num = $(this).attr('name');
        var mem = $(this).parent().siblings('td.mem').find('input');
        if (!spellHash[num]) if (cleanseIt) spellHash[num]=["",""]; else return;
        if (spellHash[num][0]==$(this).val()&&mem.val()==spellHash[num][1]) return;
        $(this).val(spellHash[num][0]);
        mem.val(spellHash[num][1]);
        saveSheetShit([mem,this]);
    });
}
function featstore(storeName, col)
{
    var n = prompt('What would you like to call this feat column?');
    if (!n) return false;
    var featHash={"Name":n},i=0;
    $('#feats > tbody > tr:nth-child(2) > td:eq('+col+')').find('input').each(function _featstore() {
        // var num = $(this).attr('name');
        var nam = $(this).val();
        if (!nam||""==nam) return;
        featHash[i++]=nam;
    });
    saveVal(storeName,featHash);
    return featHash;
}
function featpour(storeName,cleanseIt, col)
{
    var featHash=loadVal(storeName,{}),i=0;
    $('#feats > tbody > tr:nth-child(2) > td:eq('+col+')').find('input').each(function _featspore() {
        // var num = $(this).attr('name');
        if (!featHash[i]) if (cleanseIt) featHash[i]=""; else return i++;
        if (featHash[i]==$(this).val()) return i++;
        $(this).val(featHash[i++]);
        saveSheetShit(this);
    });
}
function waitForFire(f, doc, sheetID) 
{
    if ($('#progress').length>0) {$('#progress').val(25);
           $('#progressText').html("Waiting on sheet...");}
    var observer = new MutationObserver(function(mutations) {
        if ($('#progress').length>0) {$('#progress').val(50);
           $('#progressText').html("Waiting on sheet data...");}
        if ( ($(doc).find('#character_other_notes textarea[name]').length>0&&$(doc).find('input[name=name]').val())
        ||(($(doc).find('textarea[title=Notes]').length>0)&&($(doc).find('textarea[title=Notes]').val()||$(doc).find('input[name=Name]').val())))
        {
            log('firing: '+f.toString().split('{')[0]);
            if ($('#progress').length>0){
               $('#progress').val(75);
               $('#progressText').html("Scraping sheet...");}
            f(doc,sheetID);
            if ($('#progress').length>0){
               $('#progress').val(90);
               $('#progressText').html("Dumping sheet...");}
            observer.disconnect();
        }
    });
    observer.observe((doc===document?$('body')[0]:doc.body), { childList: true });
}
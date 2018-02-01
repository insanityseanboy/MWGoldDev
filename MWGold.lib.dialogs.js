
function calculateDP()
{
    log('this: '+this.id+' changed!');

    // calculate totals
    var SME="",L12="",tot = 0,goldTot=4,totWeight=0,extra=[];
    if ($('#pfWCA_simple').prop('checked')) SME="simple";
    if ($('#pfWCA_martial').prop('checked')) {SME="martial";goldTot=5;}
    if ($('#pfWCA_exotic').prop('checked')) {SME="exotic";goldTot=6;}

    $('#pfWC_OutputQuals').html("");
    $('#pfWepCreator_aria input.pfWCA_bits:checked').add('#pfWepCreator_aria select option:selected').each(function () {
        if ($(this).val()) tot+=parseInt($(this).val());

        if ($(this).parent().attr('id')=="pfWCA_ADP") goldTot+=parseInt($(this).val())*(-15);
        if ($(this).attr('id')=="pfWCA_Shield") goldTot+=3;
        if ($(this).attr('id')=="pfWCA_ShieldArmSpike") goldTot+=50;
        if ($(this).attr('id')=="pfWCA_Tool") {goldTot+=150*parseInt($('#pfWCA_ToolNumTools').val()); totWeight+=2*parseInt($('#pfWCA_ToolNumTools').val());}

        if ($(this).data('extra')) extra.push( $(this).data('extra') );

        var mytext = $(this).text();
        if (mytext=="") mytext=$(this).parent().find('label[for='+$(this).attr('id')+']').text();
        if (mytext!="None"&&mytext!="As above"&&mytext!="Choose melee/ranged first"&&mytext!="20"&&mytext!="Not attached"&&mytext!="x2"&&mytext!="1d3"&&mytext!="")
            $('#pfWC_OutputQuals').append( mytext+" ("+$(this).val()+"), " );

        $(this).attr( 'title', $(this).attr('id') );//TODO:DELETE ME
    });
    //goldTot += 
    

    // enter total into header
    $('#tot').html( tot );

    // construct stat block
    $('#pfWC_OutputHead').html( $('#pfWC_WepName').val() );
    $('#pfWC_OutputDesc').html( $('#pfWC_WepDesc').val() + (extra.length>0?'<ol style="list-style-type: lower-roman"><li>'+extra.join('</li><li>')+'</li></ol>':'') );
    if ($('#pfWCA_light').prop('checked')) L12="light";
    if ($('#pfWCA_one-handed').prop('checked')) L12="one-handed";
    if ($('#pfWCA_two-handed').prop('checked')) L12="two-handed";
    $('#pfWC_OutputStatBlock').html( "<b>Price</b> "+goldTot+" gp; <b>Type</b> "+L12+" "+($('#pfWCA_melee').prop('checked')?'melee':'ranged')+"; <b>Proficiency</b> "+SME+"; <b>Damage (M)</b> "+$('#pfWepDMG select option:selected').text()+"; <b>Critical</b> "+$('#pfWepCrit1 select option:selected').text()+"/"+$('#pfWepCrit2 select option:selected').text()+"; <b>Weapon Group</b> "+$('#pfWC_WepGroup').val()+"; <b>Weight</b> "+totWeight+" lbs." );
    
    // enable/disable rules
    $('#pfWCA_Conc').checkboxradio( ($('#pfWCA_light').prop('checked')||$('#pfWCA_one-handed').prop('checked')?'enable':'disable') );
    $('#pfWCA_Ease').checkboxradio( ($('#pfWCA_exotic').prop('checked')&&$('#pfWCA_one-handed').prop('checked')?'enable':'disable') );
    $('#pfWCA_Fin').checkboxradio( ($('#pfWCA_exotic').prop('checked')||$('#pfWCA_one-handed').prop('checked')?'enable':'disable') );
    $('#pfWCA_Shield').checkboxradio( ($('#pfWCA_melee').prop('checked')&&$('#pfWCA_one-handed').prop('checked')?'enable':'disable') );
    $('#pfWCA_Trad').checkboxradio( ($('#pfWCA_exotic').prop('checked')?'enable':'disable') );
    $('#pfWCA_Spring-Loaded').checkboxradio( ($('#pfWCA_melee').prop('checked')&&!$('#pfWCA_light').prop('checked')&&($('#pfWCA_WeapFeat1').val()=="reach"||$('#pfWCA_WeapFeat2').val()=="reach"||$('#pfWCA_WeapFeat3').val()=="reach")?'enable':'disable') );
    $('#pfWCA_WeapFeat2').selectmenu( ($('#pfWCA_exotic').prop('checked')||$('#pfWCA_martial').prop('checked')?'enable':'disable') );
    $('#pfWCA_WeapFeat3').selectmenu( ($('#pfWCA_exotic').prop('checked')?'enable':'disable') );

    // special rules
    if ($(this).attr('id')=='pfWCA_ICTR') //
    {
        if ($(this).val()=="20") $('#pfWCA_ImprovedMult').html("<option value='0' selected='selected'>x2</option><option value='3'>x3</option><option value='6'>x4</option>");
        else $('#pfWCA_ImprovedMult').html("<option value='0' selected='selected'>x2</option><option value='6'>x3</option>");

        $('#pfWCA_ImprovedMult').selectmenu('refresh');
    }
    
    //Damage caps
    $('#pfWCA_ImpDamn option').prop('disabled',true).each(function () {
        $(this).prop('disabled',false);
        if ( ($('#pfWCA_light').prop('checked')&&$(this).val()==2) || ($('#pfWCA_one-handed').prop('checked')&&((!$('#pfWCA_exotic').prop('checked')&&$(this).val()==3)||$('#pfWCA_exotic').prop('checked')&&$(this).val()==4)) || 
             ($('#pfWCA_two-handed').prop('checked')&&$(this).val()==5) || (!$('#pfWCA_melee').prop('checked')&&(($('#pfWCA_two-handed').prop('checked')&&$(this).val()==4)||$('#pfWCA_one-handed').prop('checked')&&$(this).val()==2)) )
            return false;
    });
    $('#pfWCA_ImpDamn').selectmenu('refresh');

    if ($(this).attr('name')=='MPT') 
    {
        $('#pfWCA_ERI').html("<option value='0' selected='selected'>None</option>");
        if ($(this).attr('id')=="pfWCA_melee") 
            {$('#pfWCA_ERI').selectmenu('disable');$('#pfWCA_light').checkboxradio('enable');$('#pfWCA_Aero').checkboxradio('enable');}
        else
            {$('#pfWCA_ERI').selectmenu('enable');$('#pfWCA_light').checkboxradio('disable');$('#pfWCA_Aero').checkboxradio('disable');}
        
        if ($(this).attr('id')=="pfWCA_thrown"){
             for (var i=1;i<3;i++) $('#pfWCA_ERI').append("<option value='"+i+"'>+"+i+"0ft/"+i+"DP</option>");// selected='selected'
        }
        else if ($(this).attr('id')=="pfWCA_projectile"){
             for (var i=1;i<8;i++) $('#pfWCA_ERI').append("<option value='"+i+"'>+"+i+"0ft/"+i+"DP</option>");
         }

        $('#pfWCA_ERI').selectmenu('refresh');
    }

}

function createWeaponCreatorDialog() {
    if ($('#pfWepCreator_aria').length>0) $('#pfWepCreator_aria').show(); else {
    $('<div id="pfWepCreator_div"></div>').hide().dialog({minHeight: 800, minWidth: 800}).appendTo('head');
    $('.ui-dialog[aria-describedBy=pfWepCreator_div]').attr('id','pfWepCreator_aria').css('min-width','700px').position({my:"top center", at:"bottom center",of:"#menu_bar"})
    .append('<table><tr id="pfWepTR1"></tr><tr id="pfWepTR2"></tr><tr id="pfWepTR3"></tr><tr id="pfWepTR4"></tr></table>');
    $('#pfWepTR1')
    .append('<td style="width:50%">Proficiency:<br><label for="pfWCA_simple">Simple (4 DP)</label><input type="radio" name="SME" value="-4" id="pfWCA_simple"><label for="pfWCA_martial">Martial (5 DP)</label><input type="radio" value="-5" name="SME" id="pfWCA_martial"><label for="pfWCA_exotic">exotic (6 DP)</label><input type="radio" value="-6" name="SME" id="pfWCA_exotic"></td>')
    .append('<td style="width:50%"><br>Damage type: <label for="pfWCA_bludge">Bludgeoning</label><input type="radio" name="PBS" value="0" id="pfWCA_bludge"><label for="pfWCA_piercing">Piercing</label><input type="radio" value="0" name="PBS" id="pfWCA_piercing"><label for="pfWCA_slashing">Slashing</label><input type="radio" value="0" name="PBS" id="pfWCA_slashing"></td>');
    $('#pfWepTR1 td:last').append("<br><label for='pfWCA_ADT'>Additional Damage Type (1 or 3 DP): </label><select name='ADT' id='pfWCA_ADT'><option value='0' selected='selected'>As above</option><option value='1'>Piercing or Bludgeoning</option><option value='1'>Piercing or Slashing</option><option value='1'>Slashing or Bludgeoning</option><option value='3'>Piercing and Bludgeoning</option><option value='3'>Piercing and Slashing</option><option value='3'>Slashing and Bludgeoning</option></select>");
    
    $('#pfWepTR2')
    .append('<td style="width:50%"><span title="A projectile ranged weapon has a 50-foot range increment and uses ammunition, while a thrown ranged weapon has a 10-foot range increment.">Range: <label for="pfWCA_melee">Melee</label><input type="radio" value="0" name="MPT" id="pfWCA_melee"><label for="pfWCA_thrown">Thrown (10ft)</label><input type="radio" value="0" name="MPT" id="pfWCA_thrown"><label for="pfWCA_projectile">Projectile (50ft)</label><input value="0" type="radio" name="MPT" id="pfWCA_projectile"></span></td>')
    .append('<td style="width:50%"><span title="The base number of Design Points of one-handed and ranged weapons increases by 2, and the base number of Design Points of two-handed weapons increases by 3."><label for="pfWCA_light">Light (melee only)</label><input type="radio" value="0" name="L12" id="pfWCA_light"><label for="pfWCA_one-handed">One-handed</label><input type="radio" name="L12" value="-2" id="pfWCA_one-handed"><label for="pfWCA_two-handed">Two-handed</label><input type="radio" name="L12" value="-3" id="pfWCA_two-handed"></span></td>');
    
    $('#pfWepTR3')
    .append('<td style="width:50%">Base statistics: Damage (M) <span id="pfWepDMG">1d3</span><br>Critical <span id="pfWepCrit1">20</span>/<span id="pfWepCrit2">x2</span></td>')
    .append('<td style="width:50%">Fighter Weapon Group: <input id="pfWC_WepGroup" type="textbox" name="FWG"></td>');
    $('#pfWepCrit2').html("<select class='miniselect' title='Increase the weapon`s critical multiplier by 1. This quality can be selected twice. It costs 3 DP the first time it is selected, and 6 DP the second time. It can be selected only once if the weapon has the improved critical threat range quality, in which case the Design Point cost is doubled.' name='ImprovedMult' id='pfWCA_ImprovedMult'><option value='0' selected='selected'>x2</option><option value='3'>x3</option><option value='6'>x4</option></select>")
    $('#pfWepCrit1').html("<select class='miniselect' name='ICTR' id='pfWCA_ICTR'><option value='0' selected='selected'>20</option><option value='3'>19-20</option><option value='7'>18-20</option></select>")
    $('#pfWepDMG').html("<select class='miniselect' name='ImpDamn' id='pfWCA_ImpDamn'><option value='-1'>1d2</option><option value='0' selected='selected'>1d3</option><option value='1'>1d4</option><option value='2'>1d6</option><option value='3'>2d4 (or 1d8)</option><option value='4'>1d10</option><option value='5'>2d6 (or 1d12)</option></select>");

    $('#pfWepTR4').append('<td style="width:50%"><h4>Melee</h4></td><td style="width:50%"><h4>Ranged</h4></td>');
    $('#pfWepTR4 td:first').append("<label title='The weapon has a 10-foot range and can be thrown up to 5 range increments. Only melee weapons can have this quality.' for='pfWCA_Aero'>Aerodynamic (1 DP)</label><input type='checkbox' name='Aero' data-extra='The weapon has a 10-foot range and can be thrown up to 5 range increments.' value='1' id='pfWCA_Aero'>")
    .append("<label title='The weapon can be used with Weapon Finesse as if it were a light weapon. Only one-handed and exotic melee weapons can have this quality.' for='pfWCA_Fin'>Finesse (3 DP)</label><input type='checkbox' value='3' name='Fin' id='pfWCA_Fin'>")
    .append("<label title='The weapon counts as a light shield made of wood or metal and can have armor spikes (your choice). Add the gp price of the shield and any armor spikes that the weapon gains from this quality to the weapon`s gp price. This quality can be added only to one-handed melee weapons.' for='pfWCA_Shield'>Shield (1 DP)</label><input type='checkbox' value='1' name='Shield' id='pfWCA_Shield'> <label for='pfWCA_ShieldArmSpike'>+ Armour Spikes?</label><input type='checkbox' value='0' name='ShieldArmSpike' id='pfWCA_ShieldArmSpike'>")
    .append("<label title='The weapon`s wielder can activate or suspend its reach as a swift action. This quality can be added only to one-handed or two-handed melee weapons with the reach special feature.' for='pfWCA_Spring-Loaded'>Spring-Loaded (2 DP)</label><input type='checkbox' value='2' data-extra='The wielder can activate or suspend its reach as a swift action.' name='Spring-Loaded' id='pfWCA_Spring-Loaded'>");
    $('#pfWepTR4 td:last')
    .append("<label for='pfWCA_ERI'>Expanded Range Increment (1 DP): </label><select name='ERI' id='pfWCA_ERI'><option value='0' selected='selected'>Choose melee/ranged first</option></select>");

    $('#pfWepCreator_aria').append("<hr>")
    .append("<label for='pfWCA_WeapFeat1'>Weapon Feature (1 DP)</label><select name='WeapFeat1' id='pfWCA_WeapFeat1'><option value='0' selected='selected'>None</option><option value='1'>blocking</option><option value='1'>brace</option><option value='1'>deadly</option><option value='1'>disarm</option><option value='1'>distracting</option><option value='1'>grapple</option><option value='1'>monk</option><option value='1'>nonlethal</option><option value='1'>performance</option><option value='1'>reach</option><option value='1'>trip</option></select>")
    .append("<label for='pfWCA_WeapFeat2'>Weapon Feature (3 DP)</label><select name='WeapFeat2' id='pfWCA_WeapFeat2'><option value='0' selected='selected'>None</option><option value='3'>blocking</option><option value='3'>brace</option><option value='3'>deadly</option><option value='3'>disarm</option><option value='3'>distracting</option><option value='3'>grapple</option><option value='3'>monk</option><option value='3'>nonlethal</option><option value='3'>performance</option><option value='3'>reach</option><option value='3'>trip</option></select>")
    .append("<br><label for='pfWCA_WeapFeat3'>Weapon Feature (4 DP)</label><select name='WeapFeat3' id='pfWCA_WeapFeat3'><option value='0' selected='selected'>None</option><option value='4'>blocking</option><option value='4'>brace</option><option value='4'>deadly</option><option value='4'>disarm</option><option value='4'>distracting</option><option value='4'>grapple</option><option value='4'>monk</option><option value='4'>nonlethal</option><option value='4'>performance</option><option value='4'>reach</option><option value='4'>trip</option></select>");

    $('#pfWepCreator_aria').append('<table><tr><td>Name:</td><td><input id="pfWC_WepName" type="textbox" style="width:500px" value="Name of weapon"></td></tr><tr><td>Description:</td><td><input id="pfWC_WepDesc" type="textarea" style="height:200px;width:500px" value="Description of weapon"></td></tr></table>');
    $('#pfWepCreator_aria').append('<h3>Buy offs</h3>')
    .append("<label for='pfWCA_ADP'>Additional Design Points (-1 or -2 DP): </label><select name='ADP' id='pfWCA_ADP'><option value='0'>None</option><option value='-1'>+1 DP for 15gp</option><option value='-2' selected='selected'>+2 DP for 30gp</option></select>")
    .append("<label title='The weapon gains the fragile special weapon feature.' for='pfWCA_Frag'>Fragile (-1 DP)</label><input type='checkbox' data-extra='Fragile (breaks on an attack roll of 1)' value='-1' name='Frag' id='pfWCA_Frag'>")
    
    .append('<h3>Upgrades</h3>')
    .append("<label title='The weapon can also serve as a specific mundane tool. Add triple the price and double the weight of the tool to the weapon`s final price and weight.' for='pfWCA_Tool'>Tool (0 DP): </label><input type='checkbox' value='0' name='Tool' id='pfWCA_Tool' data-extra='The weapon can also serve as a specific mundane tool.'><input type='textbox' id='pfWCA_ToolNumTools' style='width:20px' min='0' value='0'>")
    .append("<select title='The weapon is attached to the wielder`s arm and cannot be disarmed. The wielder can wield or carry items in the hand to which this weapon is attached, but she takes a –2 penalty on all precision-based tasks involving that hand (such as opening locks). This penalty can be removed by increasing this quality`s cost to 3 DP.' name='Attached' id='pfWCA_Attached'><option value='0' selected='selected'>Not attached</option><option data-extra='cannot be disarmed</li><li>–2 penalty on all precision-based tasks involving that hand (such as opening locks)' value='1'>Attached, with -2 penalty on stuff (1DP)</option><option data-extra='cannot be disarmed' value='3'>Attached with no penalty (3DP)</option></select>")
    .append("<br><label title='The weapon is easy to hide, granting the wielder a +2 bonus on Sleight of Hand checks to conceal it. Only light and one-handed melee weapons and ranged weapons that need one hand to fire can have this quality.' for='pfWCA_Conc'>Concealed (1 DP)</label><input data-extra='+2 bonus on Sleight of Hand checks to conceal it' type='checkbox' name='Conc' value='1' id='pfWCA_Conc'>")
    .append("<label title='The weapon can be wielded as a two-handed martial weapon. Only one-handed exotic weapons can have this quality.' for='pfWCA_Ease'>Ease of Grip (1 DP)</label><input type='checkbox' name='Ease' value='1' id='pfWCA_Ease'>")
    .append("<label title='The weapon`s wielder gains a +2 bonus to her Combat Maneuver Defense to resist sunder combat maneuvers attempted against the weapon.' for='pfWCA_Stronk'>Strong (1 DP)</label><input type='checkbox' value='1' name='Stronk' id='pfWCA_Stronk' data-extra='+2 bonus to her Combat Maneuver Defense to resist sunder combat maneuvers attempted against the weapon'>")
    .append("<label title='Select one race with the weapon familiarity racial trait (such as elves or orcs). Members of that race with the weapon familiarity racial trait treat the weapon as a martial weapon. This quality can be applied only to exotic weapons.' for='pfWCA_Trad'>Traditional (1 DP)</label><input type='checkbox' value='1' name='Trad' id='pfWCA_Trad'>");
 
    // $("#pfWepCreator_aria").css('overflow-y','auto');
    $("#pfWepCreator_aria > div:first > span:first").html("PF Weapon Creator<br>DP under/over limit: <span id='tot'>?</span>");

    $('#pfWepCreator_aria > div:first').after("<div style='background-color:white' id='pfWC_Output'><h4 id='pfWC_OutputHead' style='background-color:rgb(207,226,243);padding:3px'></h4><p id='pfWC_OutputDesc' style='font:normal 10pt black Arial,sans-serif;background-color:white'></p><p style='font:normal 10pt black Arial,sans-serif;background-color:white' id='pfWC_OutputStatBlock'></p><p style='font-size:12px;font-weight:bold;border-top:thin solid;border-bottom:thin solid'>QUALITIES</p><p style='font:normal 10pt black Arial,sans-serif;background-color:white' id='pfWC_OutputQuals'></p></div>");

    $("#pfWepCreator_aria [title]").css('text-decoration','underline');
    $("#pfWepCreator_aria input:radio").checkboxradio({icon:false});
    $("#pfWepCreator_aria input:checkbox").checkboxradio({icon:false});
    $("#pfWepCreator_aria select").selectmenu();
    $("#pfWepCreator_aria select.miniselect").selectmenu( "option", "width", 100 );

    $("#pfWepCreator_aria input").add("#pfWepCreator_aria input:checkbox").addClass('pfWCA_bits');
    $('#pfWepCreator_aria').on('change','.pfWCA_bits', calculateDP);
    $('#pfWepCreator_aria select').on( "selectmenuchange", calculateDP );
    // $('#pfWC_WepName').change(calculateDP);
    // $('#pfWC_WepDesc').change(calculateDP);
    calculateDP();
}}
function createNPCGenDialog()
{
    if ($('#npcDialog').length>0) $( "#npcDialog" ).dialog( "open" ); 
    else{//generate_npc.php?do=npcgen
        var npcgenhtml = '<form id="npggenpackage"><div class="col span-3"><span id="npcexplainbtn" class="button">Click to hide/show instructions</span><br/><div id="npcexplain" hidden style="font: 16px georgia; color: #333;">Welcome to the Dungeons &amp; Dragons 3.5 Random NPC Generator, originally developed by Jamis Buck, updated and maintained by Myth-Weavers. Check out our other generators from the Site Tools menu in the navigation!<br><br>This tool allows you to generate random characters for the heroes of your campaign to encounter.<p><i>Please note</i> that this generator will only generate NPCs of up to character level 20. If you try to create a Wiz20/Sor20/Clr20 character - that\'s actually a <i>60th level character</i>! If you input more than 20 levels, only the first 20 will be calculated.</p>  <p>The level input can be set to any <b>integer 1-20</b> or any of the following: <b>any, low, med, high.</b></p></div><br><table><tbody><tr><td align="right">Alignment: </td><td><select name="a"><option value="any" selected="">Any</option><option value="evil">Any evil</option><option value="good">Any good</option><option value="geneutral">Any Good/Evil/Neutral</option><option value="lcneutral">Any Lawful/Chaotic/Neutral</option><option value="lawful">Any Lawful</option><option value="chaotic">Any Chaotic</option><option value="ce">Chaotic Evil</option><option value="cg">Chaotic Good</option><option value="cn">Chaotic Neutral</option><option value="le">Lawful Evil</option><option value="lg">Lawful Good</option><option value="ln">Lawful Neutral</option><option value="ne">Neutral Evil</option><option value="ng">Neutral Good</option><option value="nn">Neutral</option></select></td><td align="right">Class #1: </td><td><select name="class1"><option value="any" selected="">Any</option><option value="anynpc">Any NPC</option><option value="anypc">Any PC</option><option value="barbarian">Barbarian</option><option value="bard">Bard</option><option value="cleric">Cleric</option><option value="druid">Druid</option><option value="fighter">Fighter</option><option value="monk">Monk</option><option value="paladin">Paladin</option><option value="ranger">Ranger</option><option value="rogue">Rogue</option><option value="sorcerer">Sorcerer</option><option value="wizard">Wizard</option><option value="adept">Adept</option><option value="aristocrat">Aristocrat</option><option value="commoner">Commoner</option><option value="expert">Expert</option><option value="warrior">Warrior</option></select></td><td align="right">Level #1: </td><td><input name="level1" maxlength="4" value="any" style="width: 36px;" type="text"></td></tr><tr><td align="right">Gender: </td><td><select name="g"><option value="any" selected="">Any</option><option value="female">Female</option><option value="male">Male</option></select></td><td align="right">Class #2: </td><td><select name="class2"><option value="any" selected="">Any</option><option value="anynpc">Any NPC</option><option value="anypc">Any PC</option><option value="barbarian">Barbarian</option><option value="bard">Bard</option><option value="cleric">Cleric</option><option value="druid">Druid</option><option value="fighter">Fighter</option><option value="monk">Monk</option><option value="paladin">Paladin</option><option value="ranger">Ranger</option><option value="rogue">Rogue</option><option value="sorcerer">Sorcerer</option><option value="wizard">Wizard</option><option value="adept">Adept</option><option value="aristocrat">Aristocrat</option><option value="commoner">Commoner</option><option value="expert">Expert</option><option value="warrior">Warrior</option></select></td><td align="right">Level #2: </td><td><input name="level2" maxlength="4" value="any" style="width: 36px;" type="text"></td></tr><tr><td align="right">Race: </td><td><select name="r"><option value="any" selected="">Any</option><option value="human">Human</option><option value="dwarf">Dwarf</option><option value="elf">Elf</option><option value="gnome">Gnome</option><option value="halfelf">Half Elf</option><option value="hafling">Halfling</option><option value="halforc">Half Orc</option></select></td><td align="right">Class #3: </td><td><select name="class3"><option value="any" selected="">Any</option><option value="anynpc">Any NPC</option><option value="anypc">Any PC</option><option value="barbarian">Barbarian</option><option value="bard">Bard</option><option value="cleric">Cleric</option><option value="druid">Druid</option><option value="fighter">Fighter</option><option value="monk">Monk</option><option value="paladin">Paladin</option><option value="ranger">Ranger</option><option value="rogue">Rogue</option><option value="sorcerer">Sorcerer</option><option value="wizard">Wizard</option><option value="adept">Adept</option><option value="aristocrat">Aristocrat</option><option value="commoner">Commoner</option><option value="expert">Expert</option><option value="warrior">Warrior</option></select></td><td align="right">Level #3: </td><td><input name="level3" maxlength="4" value="any" style="width: 36px;" type="text"></td></tr><tr><td colspan="2">Number to Generate <input name="n" maxlength="1" style="width: 24px;" value="1" type="text"></td><td colspan="2">Ability Score Generation:</td><td colspan="2"><select name="strat"><option value="4" selected="">Best 3 of 4d6</option><option value="3">Straight 3d6</option><option value="18">Straight 18</option><option value="h">Heroic</option><option value="a">Average (10-11)</option></select></td></tr><tr><td colspan="2">Show NPC Motivation <input name="b" ""="" type="checkbox"></td><td colspan="2"></td></tr></tbody></table><div style="text-align: right;"></div><br></div></form><button id="btnGenNPCs" class="button"><b>Generate NPCs!</b></button><div id=npcresults hidden style="overflow-y:scroll;max-height:350px"></div>';
        $('<div id="npcDialog" title="NPC Generator"><p>Loading...</p></div>').dialog({width:590,position: { my: "center top", at: "center bottom", of: $('#menu_bar')[0] }}).appendTo('head');  
        fixCloseButtonOnDialog();
        $('div.ui-dialog.ui-front[aria-describedBy=npcDialog]').addClass('smallfont').append(npcgenhtml);
        $('#npcexplainbtn').click(function () {$('#npcexplain').toggle();});
        $('#btnGenNPCs').off().click(function () {$.post(knownURLS["npcgenURL"]+"do=npcgen",$('#npggenpackage').serialize(), function (data){
            $('#npcresults').prepend($(data).find('div.clear.alt1')).show();
        });});
    }    
}
function createLootGenDialog()
{//"lootgenURL"
    if ($('#lootDialog').length>0) $( "#lootDialog" ).dialog( "open" ); 
    else{//action="generate_treasure.php?do=treasure" method="POST"
        var lootgenhtml = '<form id="lootpackage"><div style="color: #333;" class="col span-3"><span id="lootexplainbtn" class="button">Click to hide/show instructions</span><br/><div id="lootexplain" hidden style="font: 16px georgia; ">Welcome to the Dungeons &amp; Dragons Random Treasure Generator, originally developed for 3e by Jamis Buck, updated to 3.5e and maintained by Myth-Weavers. Check out our other generators from the Site Tools menu in the navigation!<br><br>This tool allows you to generate treasure for your encounters from a large variety of sources, including supplements, for D&amp;D 3.5e, with support for the older D&amp;D3e ruleset.<br><br>Just enter an encounter level, and optionally the various modifiers, and get your loot!</div><br><table style="width: 100%;"><tbody><tr><td style="width: 48%;" valign="top"><table style="width: 100%;"><tbody><tr><td style="width: 30px;"><input id="choiceEL" name="choice" value="EL" checked="" type="radio"></td><td colspan="2"><label for="choiceEL"><b>Generate Treasure by<br> Encounter Level</b></label></td></tr><tr><td></td><td>EL</td><td>&nbsp;<input name="result" maxlength="2" size="2" value="1" type="text"></td></tr><tr><td></td><td>Coins</td><td>x<input name="coins" maxlength="1" size="2" value="1" type="text"></td></tr><tr><td></td><td>Goods</td><td>x<input name="goods" maxlength="1" size="2" value="1" type="text"></td></tr><tr><td></td><td>Items</td><td>x<input name="items" maxlength="1" size="2" value="1" type="text"></td></tr></tbody></table></td><td valign="top">OR</td><td style="width: 48%;" valign="top"><table style="width: 100%;"><tbody valign="top"><tr><td style="width: 30px;"><input id="choiceIT" name="choice" value="IT" type="radio"></td><td colspan="2"><label for="choiceIT"><b>Generate Items</b></label></td></tr><tr><td></td><td># Items</td><td><input name="result2" maxlength="2" size="2" value="1" type="text"></td></tr><tr><td></td><td>Item Level</td><td><select name="itemtype[]" multiple="multiple" size="9" style="width: 100px;" class="multiple"><option value="armor" selected="">Armor</option><option value="weapon">Weapon</option><option value="potion">Potion</option><option value="ring">Ring</option><option value="rod">Rod</option><option value="scroll">Scroll</option><option value="staff">Staff</option><option value="wand">Wand</option><option value="wondrous item">Wondrous Item</option></select></td></tr><tr><td></td><td>Item Type</td><td><select name="itemlevel[]" multiple="multiple" size="3" style="width: 100px;" class="multiple"><option value="minor" selected="">Minor</option><option value="medium">Medium</option><option value="major">Major</option></select></td></tr></tbody></table></td></tr></tbody></table><hr><input value="1" name="ifset" type="checkbox"> Use the D&amp;D3e Ruleset instead of D&amp;D3.5e<br></div></form><div style="text-align: right;"><button id="btnGenLoot" class="button"><b>Generate Treasure!</b></button></div><div id=lootresults hidden style="overflow-y:scroll;max-height:350px"></div>';
        $('<div id="lootDialog" title="Treasure Generator"><p>Loading...</p></div>').dialog({width:590,position: { my: "center top", at: "center bottom", of: $('#menu_bar')[0] }}).appendTo('head');  
        fixCloseButtonOnDialog();
        $('div.ui-dialog.ui-front[aria-describedBy=lootDialog]').addClass('smallfont').append(lootgenhtml);
        $('#lootexplainbtn').click(function () {$('#lootexplain').toggle();});
        $('#btnGenLoot').off().click(function () {$.post(knownURLS["lootgenURL"]+"do=treasure",$('#lootpackage').serialize(), function (data){
            $('#lootresults').prepend($(data).find('div.alt1')).show();
        });});
    }    
}
function fixCloseButtonOnDialog(){
    // var kids = $(".ui-dialog-titlebar-close").children(':last').clone();
    $(".ui-dialog-titlebar-close").before("<img style='cursor:pointer' src='http://i.imgur.com/1qsyHoq.png' width='20px' align='right' />");//.prepend(kids);
    $(".ui-dialog-titlebar-close").prev('img').click(function () {var id=$(this).parents('div.ui-dialog').attr('aria-describedBy');
                                                                  $('#'+id).dialog("close");}).end().remove();
}
function createPBDialog(loadAbilitiesFromSheet)
{
    var speed = 300;
    if ($('#pbDialog').length>0) $( "#pbDialog" ).dialog( "open" ); 
    else{
        var pbhtml = '<h3>Bonuses</h3><div id="thelog" class="col-md-4"><form id="ability_bonus"><table><thead><tr><th>Str</th><th>Dex</th><th>Con</th><th>Int</th><th>Wis</th><th>Cha</th></tr></thead><tbody><tr><td><input name="str_bonus" type="text" pattern="[+-]?[0-9]+" value="0"></td><td><input name="dex_bonus" type="text" pattern="[+-]?[0-9]+" value="0"></td><td><input name="con_bonus" type="text" pattern="[+-]?[0-9]+" value="0"></td><td><input name="int_bonus" type="text" pattern="[+-]?[0-9]+" value="0"></td><td><input name="wis_bonus" type="text" pattern="[+-]?[0-9]+" value="0"></td><td><input name="cha_bonus" type="text" pattern="[+-]?[0-9]+" value="0"></td></tr></tbody></table></form>'
            +'</div><div id="dnddiv" class="col-md-4"><h3 id="dndh3">&#8630; D&amp;D3.5e</h3><form class="pb" name="pb_dnd35" id="pb_dnd35"><table><thead><tr><th>Base</th><th>Abil</th><th>Score</th><th>Mod</th></tr></thead><tbody><tr><th>Str</th><td><input type="number" name="str" value="8"></td><td><span id="dnd35_strFinal">8</span></td><td><span id="dnd35_strMod">-1</span></td></tr><tr><th>Dex</th><td><input type="number" name="dex" value="8"></td><td><span id="dnd35_dexFinal">8</span></td><td><span id="dnd35_dexMod">-1</span></td></tr><tr><th>Con</th><td><input type="number" name="con" value="8"></td><td><span id="dnd35_conFinal">8</span></td><td><span id="dnd35_conMod">-1</span></td></tr><tr><th>Int</th><td><input type="number" name="int" value="8"></td><td><span id="dnd35_intFinal">8</span></td><td><span id="dnd35_intMod">-1</span></td></tr><tr><th>Wis</th><td><input type="number" name="wis" value="8"></td><td><span id="dnd35_wisFinal">8</span></td><td><span id="dnd35_wisMod">-1</span></td></tr><tr><th>Cha</th><td><input type="number" name="cha" value="8"></td><td><span id="dnd35_chaFinal">8</span></td><td><span id="dnd35_chaMod">-1</span></td></tr></tbody><tfoot><tr><th>Points</th><td><span id="dnd35_total">0</span></td><td /><td /></tr></tfoot></table></form>'
            +'</div><div id="pfdiv" hidden class="col-md-4"><h3 id="pfh3">&#8630; Pathfinder</h3><form class="pb" name="pb_pf" id="pb_pf"><table><thead><tr><th>Base</th><th>Abil</th><th>Score</th><th>Mod</th></tr></thead><tbody><tr><th>Str</th><td><input type="number" name="str" value="10"></td><td><span id="pf_strFinal">10</span></td><td><span id="pf_strMod">+0</span></td></tr><tr><th>Dex</th><td><input type="number" name="dex" value="10"></td><td><span id="pf_dexFinal">10</span></td><td><span id="pf_dexMod">+0</span></td></tr><tr><th>Con</th><td><input type="number" name="con" value="10"></td><td><span id="pf_conFinal">10</span></td><td><span id="pf_conMod">+0</span></td></tr><tr><th>Int</th><td><input type="number" name="int" value="10"></td><td><span id="pf_intFinal">10</span></td><td><span id="pf_intMod">+0</span></td></tr><tr><th>Wis</th><td><input type="number" name="wis" value="10"></td><td><span id="pf_wisFinal">10</span></td><td><span id="pf_wisMod">+0</span></td></tr><tr><th>Cha</th><td><input type="number" name="cha" value="10"></td><td><span id="pf_chaFinal">10</span></td><td><span id="pf_chaMod">+0</span></td></tr></tbody><tfoot><tr><th>Points</th><td><span id="pf_total">0</span></td><td /><td /></tr></tfoot></table></form>'
            +"</div></div>";
        var desiredLoc=$('div.navbar.navbar-fixed-top')[0]; if (!loadAbilitiesFromSheet) desiredLoc=$('#menu_bar')[0];
        $('<div id="pbDialog" title="Point buy calculator"><p style="z-index:101;">Loading...</p></div>').dialog({width:450,position: { my: "center top", at: "center bottom", of: desiredLoc }}).appendTo('head');  
        fixCloseButtonOnDialog();
        $('div.ui-dialog.ui-front[aria-describedBy=pbDialog]').addClass('smallfont').append(pbhtml);//{modal: true}
        $('#dnddiv h3').click(function () {$('#dnddiv').fadeOut(speed).promise().done(function () {$('#pfdiv').fadeIn(speed);});});
        $('#pfdiv h3').click(function () {$('#pfdiv').fadeOut(speed).promise().done(function () {$('#dnddiv').fadeIn(speed);});});
        $("#ability_bonus input").change(function() {$("#pb_dnd35 input, #pb_pf input").trigger('change');}).css('max-width','50px');
        $(".pb input").change(pointBuy).attr('min', 7).attr('max', 18);
        if (loadAbilitiesFromSheet){
            for (var a in abils)
            {
                log('abilsa: '+abils[a]+" & len: "+$('#statblock input.mod[name='+abils[a]+']').length);
                if ($('#statblock input.mod[name='+abils[a]+']').length<1||$('#statblock input.mod[name='+abils[a]+']').val()=="") continue;
                var nam = abils[a].toLowerCase(),str=parseInt($('#statblock input.mod[name='+abils[a]+']').val());
                log('nam: '+nam+" & val: "+$('#statblock input.mod[name='+abils[a]+']').val());
                $('#dnddiv input[name='+nam+']').val(str);
                $('#pfdiv input[name='+nam+']').val(str);
                if ($('#statblock input.tempmod[name='+abils[a]+'Temp]').length>0&&$('#statblock input.tempmod[name='+abils[a]+'Temp]').val()!="")
                    $('#ability_bonus input[name='+nam+'_bonus]').val(parseInt($('#statblock input.tempmod[name='+abils[a]+'Temp]').val())-str);
            }
            $('#thelog').parent().append(printFauxButton('applyToSheet','Apply','Apply to sheet')+printFauxButton('applyToSheet2','Apply temp','Apply to sheet using the temp scores as racial mods'));
            $('#applyToSheet').addClass('btn btn-primary').click(function () {$('#thelog').parent().find('div:visible > form.pb span[id]').each(function (){
                log('considering '+$(this).attr('id'));
                if ($(this).attr('id').includes('Final'))
                {
                    var mod = $(this).attr('id').split('_')[1].replace(/Final$/,'');
                    log('found '+mod);
                    mod = mod[0].toUpperCase()+mod.slice(1);
                    if ($('#statblock input[title="'+mod+'"]')) {$('#statblock input[title="'+mod+'"]').val($(this).text()); saveSheetShit($('#statblock input[title="'+mod+'"]'));}
                }
            });});
            $('#applyToSheet2').addClass('btn btn-primary').click(function () {$('#thelog').parent().find('div:visible > form.pb span[id]').each(function (){
                log('considering '+$(this).attr('id'));
                if ($(this).attr('id').includes('Final'))
                {
                    var mod = $(this).attr('id').split('_')[1].replace(/Final$/,'');
                    log('found '+mod);
                    var racial = parseInt($('#ability_bonus input[name='+mod+'_bonus]').val());
                    log('racial '+racial);
                    mod = mod[0].toUpperCase()+mod.slice(1);
                    if ($('#statblock input[title="'+mod+'"]')) {$('#statblock input[title="'+mod+'"]').val(parseInt($(this).text())-racial); saveSheetShit($('#statblock input[title="'+mod+'"]'));}
                    if ($('#statblock input[title="'+mod+'Temp"]')&&racial!=0) {$('#statblock input[title="'+mod+'Temp"]').val($(this).text()); saveSheetShit($('#statblock input[title="'+mod+'Temp"]'));}
                }
            });});
        }
        $("#pb_dnd35 input, #pb_pf input").trigger('change');
    }
}
function pointBuy() {
var point_map = {'7': -1, '8': 0, '9': 1, '10': 2, '11': 3, '12': 4, '13': 5, '14': 6, '15': 8, '16': 10, '17': 13, '18': 16},
  point_map_pf = {'7': -4, '8': -2, '9': -1, '10': 0, '11': 1, '12': 2, '13': 3, '14': 5, '15': 7, '16': 10, '17': 13, '18': 17};

  var input = $(this);
  var theForm = $(this).parents('form');

  var map = {};
  var prefix = '';

  if(theForm.attr('name') == 'pb_dnd35') {
    map = point_map;
    prefix = 'dnd35';
  }
  else if(theForm.attr('name') == 'pb_pf') {
    map = point_map_pf;
    prefix = 'pf';
  }else{log('Unknown form');return;}

  bonus = parseInt($("#ability_bonus input[name="+input.attr('name')+"_bonus]").val());
  $("#"+prefix+"_"+input.attr('name')+"Final").text( parseInt(input.val()) + bonus );


  var mod = Math.floor( ((parseInt(input.val()) + bonus) - 10) / 2);
  if (mod >= 0) {
    mod = "+"+mod;
  }
  $("#"+prefix+"_"+input.attr('name')+"Mod").text( mod );

  var points = 0;

  points += map[theForm.find("input[name=str]").val()] + map[theForm.find("input[name=dex]").val()];
  points += map[theForm.find("input[name=con]").val()] + map[theForm.find("input[name=int]").val()];
  points += map[theForm.find("input[name=wis]").val()] + map[theForm.find("input[name=cha]").val()];
  if (isNaN(points)) points = "Inconceivable!";
 $("#"+prefix+"_total").text(points);
}

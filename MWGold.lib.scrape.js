
function scrape(doc, sheetID) {
    var sheetName;
    if (!sheetHash) sheetHash=loadVal('sheetHash',null);
    for (var s in sheetHash) if (sheetHash[s]==sheetID) {sheetName = s;break;}
    log("entry: sheetID: "+sheetID+" & sheetName: "+sheetName);
    if (!sheetName || !sheetID) return;
    scrapeWithName(doc, sheetID, sheetName);
}
function scrapeWithName(doc, sheetID, sheetName) {
    var thisPrefix = "Sheet_"+sheetID;
    // parse overrides first
    //log('sending to parse: '+$(doc).find('textarea[title="Notes"]').val());
    var attributes; var myHash = parseOverrides( $(doc).find('textarea[title="Notes"]').val() );
    if (myHash['attributes']) attributes = myHash['attributes']; else attributes = defaultAttributes;

    // forget the shit
    var oldList = GM_listValues();
    for (var k in oldList) if (oldList[k].startsWith(thisPrefix)) GM_deleteValue(oldList[k]);

    // get the junk we need
    for (var i in attributes) myHash[attributes[i]] = $(doc).find("input[title='"+attributes[i]+"']").val(); // this will put "" into attributes for empty MW boxes which may be desirable

    // replace any temp abilities   
    for (var a in abils) {
      if ($(doc).find('input[title="'+abils[a]+'Temp"]').val()!="") {
          myHash[abils[a]+"Mod"] = $(doc).find('input[title="'+abils[a]+'TempMod"]').val();
      }
    }

    // get the attacks
    var attacks = [];
    for (var i =1;i<5;i++)  {
        var nam = $(doc).find("input[name='Weapon"+i+"']").val();
        if (!nam) continue;
        var h={"Name": nam};
        log("scraping attack: '"+nam+"'");
        for (var j in props) h[props[j]]=$(doc).find("input[name='Weapon"+i+props[j]+"']").val();
        attacks.push(h);
    }
    attacks=cleanArray(attacks);
    myHash["attacks"] = attacks;
    log("total attacks found: "+attacks.length+" for "+sheetName);


    // get the items
    var s="0",m=35;
    if (!knownGear) knownGear=loadVal('knownGear',[]);
    // knownGear=[];
    // GM_deleteValue('knownGear');
    if ($(doc).find("input[name='Gear43']").length>0) m=44; // pathfinder sheets have more backpack room 
    for(var i=1;i<m;i++){
        if (i==10) s="";
        var nam = $(doc).find("input[name='Gear"+s+i+"']").val().trim();
        if (!nam) continue;
        var wtBox = $(doc).find("input[name='Gear"+s+i+"W']").val().trim(),cost=null;
        if ((!wtBox||wtBox=="")&&(/\d\s?lb/.test(nam))) wtBox = nam.replace(/.*\D+(\d+\.?\d?\s?lb).*/,'$1');
        if (/\d\s?[pgsc]p/.test(nam)) cost = nam.replace(/.*\D*(\d+\.?\d?\s?[pgsc]p).*/,'$1');
        var obj = {label:nam,weight:wtBox}; if (cost!=null) obj.cost = cost;
        var exists = $.inArray(nam,knownGear.map(function(x){return x.label;}));
        if (-1==exists) knownGear.push(obj); // storing array of objects
        else {
            if (obj.weight&&obj.weight!="") knownGear[exists].weight=obj.weight;
            if (obj.cost&&obj.cost!="") knownGear[exists].cost=obj.cost;
        }
    } 
    saveVal('knownGear',knownGear);
    log("total items found (all time, not just this run): "+Object.keys(knownGear).length);

    // get the feats
    var knownFeats = loadVal('knownFeats',[]);
    $(doc).find("input[name*='Feat']").each(function (){var v = $(this).val(); if (v&&v!=""&&-1==$.inArray(v,knownFeats)) knownFeats.push(v);})
    saveVal('knownFeats',knownFeats);

    // get the skills
    var trained=[], skills = {}, skillAbs={}, s="0";
    for(var i=1;i<52;i++){
        if (i==10) s="";
        var nam = $(doc).find("input[name='Skill"+s+i+"']").val().replace(/^\#/,'').replace(/\*\s*$/g,'');
        if (!nam) continue;
        skills[nam] = $(doc).find("input[name='Skill"+s+i+"Mod']").val(); // storing bonuses by name
    } 
    myHash["skills"] = skills;
    log("total skills found: "+Object.keys(skills).length+" for "+sheetName);

    // get the spells
    var spells = {}; s="0";
    if (!knownSpells) knownSpells=loadVal('knownSpells',[]);
    for(var i=1;i<67;i++){
        if (i==10) s="";
        var nam = $(doc).find("input[name='Spell"+s+i+"']").val();
        if (!nam) continue;
        spells[nam] = $(doc).find("input[name='Spell"+s+i+"Cast']").val(); // storing spells by prep/cast
        if (-1==$.inArray(nam,knownSpells)) knownSpells.push(nam); // storing array of objects
    } 
    saveVal('knownSpells',knownSpells);
    myHash["spells"] = spells;
    log("total spells found: "+Object.keys(spells).length+" for "+sheetName);

    saveVal(thisPrefix,sheetName); 

    if (!loadedSheets) loadedSheets = loadVal("loadedSheets",{});
    loadedSheets[sheetName] = sheetID;
    log("added "+sheetName+" to loadedSheets");
    saveVal("loadedSheets",(loadedSheets));

    saveVal(thisPrefix+"_hash",myHash);
    if ($('#progress').length>-1) {$('#progressText').html("Done! Changing to "+sheetName); $('#progress').val(100); $('#MWGoldSheetSelector').trigger('change');}
    log("return: '"+sheetID+"' to '"+thisPrefix+"_hash'");}
function parseOverrides(text)
{
    var saveConditionals=[],skillConditionals={},attackConditionals=[],unarmedDamageString,buffBools={},extraAttacks={},attributes=[];
    var overrideCharacterID = '!';
    var lines = text.split('\n');
    log("entry: overrideCharacterID: "+overrideCharacterID+" & line count: "+lines.length);
    var returnHash = {};
    for (var l in lines)
    {
        if (lines[l][0]!=overrideCharacterID) continue;
        var line = lines[l].slice(1);
        if (!line.includes(':')) continue; else log("found override line: "+lines[l]);
        var actionType = line.split(':')[0].trim().toLowerCase();
        switch (actionType)
        {
            case "attributes": var as=line.split(':').slice(1).join(':').trim().split(',');
                for (var a in as) 
                    {
                        var attr = as[a].trim();
                        if (attr[0]=='!') attributes = $.grep(attributes, function(value) {return value != attr.slice(1);});
                        else if ($.inArray(attr,attributes)==-1) attributes.push(attr);
                    }
                returnHash['attributes']=attributes;
                break;
            case "buff": 
                var restOfLine=line.split(':').slice(1).join(':').trim();
                var buffName=restOfLine.split(':')[0].trim();
                if (buffName[0]=='!') delete buffBools[buffName.replace(/^\!/,'')];
                else
                {
                    var h = {}, d=restOfLine.split(':').slice(1);
                    if (d.length%2) {log("could not parse buff: could not find a key for each value: "+line); continue;}
                    for (var i = 0, l = d.length; i < l; i+=2) 
                    {
                      var k = d[i].trim().toLowerCase();
                      var v = d[i + 1].trim();
                      if (k=='attacks') k='attack';
                      h[k]=v;
                    }
                    buffBools[buffName]=h;
                }
                returnHash['buffBools']=buffBools;
                break;
            case "saveconditional":
                saveConditionals.push(line.split(':').slice(1).join(':').trim());
                returnHash['saveConditionals']=saveConditionals;
                break;
            case "attackconditional":
                attackConditionals.push(line.split(':').slice(1).join(':').trim());
                returnHash['attackConditionals']=attackConditionals;
                break;
            case "skillconditional": var skillName = line.split(':')[1].trim();
                var skillCond = line.split(':').slice(2).join(':').trim();
                if (skillConditionals[skillName]) skillConditionals[skillName].push(skillCond);
                else skillConditionals[skillName] = [skillCond];
                returnHash['skillConditionals']=skillConditionals;
                break;
            case "unarmeddamage": unarmedDamageString=line.split(':').slice(1).join(':').trim(); 
                returnHash['unarmedDamageString']=unarmedDamageString;
                break;
            case "attack": 
                var attackName = line.split(':')[1].trim(), d = line.split(':').slice(2), h = {"Name":attackName};
                if (d.length%2) {log("Could not parse attack: could not find a key for each value: "+line); continue;}
                for (var i = 0, l = d.length; i < l; i+=2) 
                {
                  var k = d[i].trim().toLowerCase();
                  var v = d[i + 1].trim();
                  if (k=="attack") k="AB";
                  h[k[0].toUpperCase() + k.substring(1)]=v;
                }
                extraAttacks[attackName]=h; 
                returnHash['extraAttacks']=extraAttacks;
                break;
            default: log("Unable to parse: "+actionType);
        }
    }
    // after the lines have been processed
    return returnHash;
}
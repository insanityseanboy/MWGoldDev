function isBuffed(attr)
{
    var tot = 0;
    var bs = getBuffs(attr);
    for (var b in bs) tot+=parseInt(bs[b]);
    log('returning '+tot);
    return tot; 
}
function whichBuffs(attr)
{ var b=getBuffs(attr); if (b=={}) return ""; else return Object.keys(b).join(', ');}
function getBuffs(attr)
{
    var tot = {};
    if (Array.isArray(attr))
        for (var a in attr) $.extend(tot,getBuffs(attr[a]));
    else
        if (buffHash[attr]) tot=buffHash[attr];
    log('returning '+JSON.stringify(tot));
    return tot; 
}
function buffsOn(key,data)
{
    for (var k in data)
        {if (!buffHash[k]) buffHash[k] = {};
        buffHash[k][key] = data[k];}
    log("buffHash: "+JSON.stringify(buffHash));
}
function buffsOff(key){
    for (var k in buffHash) if (buffHash[k][key]) delete buffHash[k][key];
    log('removed '+key);
    log("buffHash: "+JSON.stringify(buffHash));
}
function clearBuffs(){
    var x=Object.keys(buffHash).length;
    buffHash={};
    log("cleared buffHash of "+x+" buffs");
}
function makeRollString (title,rollString) { 
    return "[roll="+title+"]"+rollString.replace(/\+\-/g,'-')+"z[/roll]";}
function makeAttackRollString(givenName, attackHash){
    if (!attackHash) return "error: attached hash not an attack hash";

    var type = attackHash["Type"];
    if (type&&type.length==1) type = {"P":"Piercing","B":"Bludgeoning","S":"Slashing"}[type.toUpperCase()];

    var prettyName = givenName.replace(/(\+.*\b)/g,'').trim();
    var buffs = whichBuffs(['attack','damage']);
    var returnString = "[roll="+prettyName+" attack;"+(attackHash["Special"]&&attackHash["Special"].length>0?attackHash["Special"].replace(/\[/g,'(').replace(/\]/g,')')+", ":"")+"crit:"+attackHash["Crit"]+(buffs.length>0?" with "+buffs:"")+"]";
    var atks = attackHash["AB"].replace(/[a-z]/gi,'').split(/[\/,\s]+|\sor\s|\sand\s/);
    for (var a in atks) returnString += buffRoll("1d20"+atks[a],'attack')+"z ";
    returnString = returnString.trim();
    returnString += "[/roll] and [roll="+prettyName+" damage"+(type?";"+type:"")+"]";
    for (var i in attackHash["AB"].split("/")) returnString+=buffRoll(attackHash["Damage"],'damage')+"z ";
    return returnString.trim()+"[/roll]";}
function buffRoll(dmgString,what) 
{
    var tot = isBuffed(what.toLowerCase());
    if (tot==0) return dmgString;
    var rString = dmgString;
    if (dmgString.includes('+'))
    {
        var theRest = dmgString.replace(/[^+-\d]/g,'').split('+').slice(1);
        for (var r in theRest){
            tot += parseInt(theRest[r].split('-')[0]);
            if (theRest[r].includes('-')) 
                {var negs = theRest[r].split('-').slice(1); 
                for (var n in negs) tot-=parseInt(negs[n]);}
        }
        rString = dmgString.split('+')[0];
    }else if (dmgString.includes('-'))
    {
        var negs = dmgString.replace(/[^-\d]/g,'').split('-').slice(1); 
        for (var n in negs) tot-=parseInt(negs[n]);
        rString = dmgString.split('-')[0];
    }
    return rString+(tot==0?"":(tot>0?'+'+tot:tot));
}
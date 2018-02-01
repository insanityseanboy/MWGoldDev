
function printAnalForUser (where, userID) { 
    log("entry");
    if (!analysisHash) analysisHash = loadVal("analysisHash",{});
    if (!analysisHash["Users"] || !analysisHash["Users"][userID] || !analysisHash["Users"][userID]["Posts"]) return;
    log("passed checks");

    if ($('#analResults').length) $('#analResults').html("<legend>New results</legend>");
    else $(where).append("<fieldset id='analResults'><legend>Results</legend></fieldset>"); 
    $('#analResults').append("<b>Misc:</b></br><ul id='analList1'></ul>");
    
    log("constructed fieldset");
    for (var key in analysisHash["Users"][userID])
    {
        if (key=="Posts" || key=="MW") continue;
        $('#analList1').append('<li><span class="shade">'+key+':</span> '+analysisHash["Users"][userID][key]+'</li>');
        log("pasted: "+key+': '+analysisHash["Users"][userID][key]);
    }
    $('#analResults').append("<b>MW's stuff:</b></br><ul id='analList2'></ul>");
    for (var key in analysisHash["Users"][userID]["MW"])
    {
        $('#analList2').append('<li><span class="shade">'+key+':</span> '+analysisHash["Users"][userID]["MW"][key]+'</li>');
        log("pasted MW: "+key+': '+analysisHash["Users"][userID]["MW"][key]);
    }
    $('#analResults').append("<b>Posts by Forum:</b></br><ul id='analList3'></ul>");
    for (var key in analysisHash["Users"][userID]["Posts"])
    {
        $('#analList3').append('<li><span class="shade"><a href="'+knownURLS["showThreadURL"]+"?t="+key+'">Forum '+key+'</a>:</span> '+analysisHash["Users"][userID]["Posts"][key].length+'posts, most recent: '+analysisHash["Users"][userID]["Posts"][key][0]+'</li>');        
        log("pasted Posts: "+key+': '+analysisHash["Users"][userID]["Posts"][key].length);
    }}
function analysePost (text) { 
    if (text.includes('[img'))
    {
        if (!imageHash) imageHash = loadVal('imageHash',{});
        var list1 = text.split('[img').slice(1);
        for (var l in list1)
        {
            var src = list1[l].split("[/img")[0].replace(/^[^\]]*\]/,'');
            if (imageHash[src]) imageHash[src].count+=1; else imageHash[src]={count:1};
            if (list1[l].startsWith('2')) //it's img2
            {                
                var sized = list1[l].split("]")[0].replace(/2=/,'');
                imageHash[src].size=sized;
            }
        }
        saveVal('imageHash',imageHash);
    }
}
function analyseUser (userID) { 
    // validity checks etc
    if (!analysisHash) analysisHash = loadVal("analysisHash",{});
    if (!analysisHash["Users"]) analysisHash["Users"] = {};
    if (!analysisHash["Users"][userID]) analysisHash["Users"][userID] = {};
    if (!analysisHash["Users"][userID]["Posts"]) analysisHash["Users"][userID]["Posts"] = {};
    analysisHash["Users"][userID]["totalPosts"]=0;

    $.get("https://www.myth-weavers.com/search.php?do=finduser&u="+userID,function (data){
        var searchID = $(data).find('div.pagination > a:first').attr('href').split('=')[1].replace(/\D/g,"");
        log('(get 1): calling scrapeDatesNShit with searchID='+searchID+' and page=1');

        if (searchID)
        {        
            scrapeDatesNShit(searchID, 1);
            scrapeDatesNShit(searchID, 2);
            scrapeDatesNShit(searchID, 3);
        }
    });
    if (!analysisHash["Users"][userID]["MW"]) analysisHash["Users"][userID]["MW"] = {};
    $.get(memberURL+"?u="+userID,function (data){
        $(data).find('fieldset.statistics_group > ul > li:has(span)').each(function () {
            var whatWeGot = $(this).find('span').html().replace(/\:/,'').trim();
            if (whatWeGot=="Last Activity" || whatWeGot=="Current Activity") analysisHash["Users"][userID]["MW"][whatWeGot]=$(this).find('span:last').html();
            else analysisHash["Users"][userID]["MW"][whatWeGot]=$(this).html().split('\>').slice(-1)[0].trim();
            log('(get 2): storing analysisHash["Users"][userID]["MW"]['
                +whatWeGot+']='+analysisHash["Users"][userID]["MW"][whatWeGot]);
        });
        saveVal("analysisHash",(analysisHash));
    });}
function scrapeDatesNShit (searchID, pageNo) { 
    $.get("https://www.myth-weavers.com/search.php?searchid="+searchID+"&pp=200&page="+pageNo,function (data){

        $(data).find('td.thead').each(function () {
            if ($(this).html().includes("Go to Page...")) {log("discarding this: "+$(this).html()); return;}
            var forumID = $(this).find('a').attr('href').split('=')[1];
            var date = reorderDate($(this).html().split('\>').slice(-1)[0].trim());
            
            log("forumID: "+forumID+" & date: "+date);
            if (!analysisHash["Users"][userID]["Posts"][forumID]) analysisHash["Users"][userID]["Posts"][forumID] = [date];
            else if (!analysisHash["Users"][userID]["Posts"][forumID].includes(date)) analysisHash["Users"][userID]["Posts"][forumID].push(date);
        }).promise().done(function () {
            var totalPosts = 0;
            for (var fID in analysisHash["Users"][userID]["Posts"]) totalPosts += analysisHash["Users"][userID]["Posts"][fID].length;
            if (!analysisHash["Users"][userID]["totalPosts"]) analysisHash["Users"][userID]["totalPosts"] = totalPosts;
            else analysisHash["Users"][userID]["totalPosts"] += totalPosts;

            saveVal("analysisHash",(analysisHash));
            printAnalForUser(userID);
        });
    });}
function analyseThread () { 
    var threadID = getThreadID();
    if (threadID)    
        $.get("https://www.myth-weavers.com/dt.php?t="+threadID, function (data)
        {
            var authors = {}, startDate, endDate, totalPosts=0, daysAlive, lines = data.toString().split('\n');
            for (var l in lines) 
            {
                var line = lines[l];
                if (line.startsWith('Started at '))
                {// beginning line
                    log("setting startDate to: "+reorderDate(line.replace(/^Started at /,'').split(' by ')[0]));
                    startDate = new Date(reorderDate(line.replace(/^Started at /,'').split(' by ')[0]));
                    if (startDate.toString()=="Invalid Date" && debugMode)  log("Unable to parse thread's starting date");
                }
                else if (line.startsWith('Author : '))
                {// author line:
                    
                    totalPosts++;
                    var thisAuthor = line.split(':')[1].trim();
                    if (!authors[thisAuthor]) {authors[thisAuthor]=1;  log("adding unique Author: "+thisAuthor);}
                    else authors[thisAuthor]++;
                }
                else if (line.startsWith("Downloaded from Myth-Weavers (http"))
                {
                    line = line.split(' at ')[1];//.replace(/\.$/,'');
                    log("setting endDate to: "+reorderDate(line.substr(0,line.length-2)));
                    endDate = new Date(reorderDate(line.substr(0,line.length-2)));
                    if (endDate.toString()=="Invalid Date" && debugMode)  log("Unable to parse thread's scraping date");
                }
            }
            // date manipulations:
            daysAlive = Math.abs(endDate.getTime() - startDate.getTime())/(1000*3600*24);
            for (var a in authors)
            {
                authors[a] = {  "name": a, 
                                "totalPosts": authors[a], 
                                "percentagePosts":parseFloat(authors[a]/totalPosts*100).toFixed(2),
                                "postsPerDay": parseFloat(authors[a]/daysAlive).toFixed(2),
                                "Thread": threadID
                                };
            }
            if (!analysisHash) analysisHash = loadVal("analysisHash",{});
            if (!analysisHash["Threads"]) analysisHash["Threads"]={};
            analysisHash["Threads"][threadID] = {"authors":authors,"startDate":startDate,"endDate":endDate,"daysAlive":daysAlive};

            saveVal("analysisHash",(analysisHash));
            printThreadAnalysis(threadID);

            // update the thing if it exists
            if ($('#pmenucontent').length>0){
                $('#pmenucontent').html("");
                for (var u in authors) 
                {if (authors[u]['name']!=uName) 
                    $('#pmenucontent').append("<div style='display:inline-block; background-color:#aaa; padding: 2px;'><input type='checkbox' "+(toggleHash["Private recipients checked by default"]?"checked":"")+" data-key='"
                        +authors[u]['name']+"'>"+authors[u]['name']+"</input></div>");
                }
                // $('#pmenucontent').slideDown();
            }   
        });
    
    else log("Unable to determine threadID for thread");}
function printThreadAnalysis (threadID) { 
    if (!analysisHash) analysisHash = loadVal("analysisHash",{});
    if (!analysisHash["Threads"] || !analysisHash["Threads"][threadID]) return;

    // set up the output space:
    $('#statContainer').remove();
    var theEnd = new Date(analysisHash["Threads"][threadID]["endDate"]);
    $('#breadcrumb').parent().prepend("<div id='statContainer' style='background: url(https://static.myth-weavers.com/images/sonata/misc/buttonbarbg.jpg)'>Stats as of: "+theEnd.getFullYear()+"/"+(theEnd.getMonth()+1)+"/"+theEnd.getDate()+"<br/><ul id='stats'></ul></div>");

    // dump analysis
    for (var a in analysisHash["Threads"][threadID]["authors"])
    {
        $('#stats').append('<li>'+analysisHash["Threads"][threadID]["authors"][a]["name"]+': '+analysisHash["Threads"][threadID]["authors"][a]["totalPosts"]+'posts, '+analysisHash["Threads"][threadID]["authors"][a]["percentagePosts"]+'% of total posts and <b>'+analysisHash["Threads"][threadID]["authors"][a]["postsPerDay"]+'</b> posts per day.</li>');
    }
}
function reorderDate (MWDateString) { 
    var today = new Date();
    var yesterday = new Date(); 
    yesterday.setDate(today.getDate()-1);
    
    //MW Dates look like: Dec 13 '16 8:17pm
    var legitDateString = MWDateString.replace(/ '/,', 20').replace(/(p|a)m/,':00 GMT');
    
    legitDateString.replace(/Today/,(today.getMonth()+1)+" "+today.getDate()+", "+today.getFullYear());
    legitDateString.replace(/Yesterday/,(yesterday.getMonth()+1)+" "+yesterday.getDate()+", "+today.getFullYear());
    
    if (MWDateString.includes('pm'))
    {
        var tmp = legitDateString.split(':');
        var hrs = parseInt(tmp[0].slice(tmp[0].length-2).trim());
        legitDateString = tmp[0].substr(0,tmp[0].length-2).trim()+" "+(12+hrs)+':'+tmp.slice(1).join(':');
    }
    
    return legitDateString; // we want them to look like: Dec 25, 1995 or Mon, 25 Dec 1995 13:30:00 GMT
  }
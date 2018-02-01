
var defaultAttributes =  ["Fort", "Reflex", "Will",
                          "Init", "MBAB", "RBAB", "CMB","CasterLevel",
                          "StrMod", "DexMod", "ConMod", "IntMod", "WisMod", "ChaMod"
                         ];
var debugMode = false, showMemStuff=false;

//--------------------------------------------------------------------------------------//
//------------------ DON'T EDIT JUNK BELOW THIS LINE (OR IT MIGHT BREAK) ---------------//
//--------------------------------------------------------------------------------------//
var abils = ["Str", "Dex", "Con", "Int", "Wis", "Cha"], props = ["Special","AB","Damage","Type","Crit","Range","Ammo"];
var uNum, uName, sheetHash, myGames, nonBoolSettings,subbedThreads,knownGear,sheetCollectorHash,knownSpells,knownFeats, pinnedThreads, curSheet, curByGame, onlineFriends, curAttributes, imageHash, loadedSheets, subscribedForumLinks, toggleHash, sitewideHash, sitewideCounter, gamewideHash, gamewideCounter, analysisHash, newMessagesLastTime=0,sheetCopyPasteHash,widescreen_firstpass=true; 
var refreshThisStuff = ["#collapseobj_usercp_forums","#notifications","#timenow"];
var knownURLS ={"userCPURL":"https://www.myth-weavers.com/usercp.php",
                "pmURL":"https://www.myth-weavers.com/private.php",
                "portalURL":"https://www.myth-weavers.com/",
                "showThreadURL":"https://www.myth-weavers.com/showthread.php",
                "sheetListURL":"https://www.myth-weavers.com/sheets",
                "sheetURL":"https://www.myth-weavers.com/sheet.html#id=",
                "newReplyURL":"https://www.myth-weavers.com/newreply.php",
                "editPostURL":"https://www.myth-weavers.com/editpost.php",
                "forumDisplayURL":"https://www.myth-weavers.com/forumdisplay.php",
                "memberURL":"https://www.myth-weavers.com/member.php",
                "newThreadURL":"https://www.myth-weavers.com/newthread.php",
                "pbURL":"https://www.myth-weavers.com/pointbuy.html",
                "npcgenURL":"https://www.myth-weavers.com/generate_npc.php?",
                "lootgenURL":"https://www.myth-weavers.com/generate_treasure.php?",
                "searchURL":"https://www.myth-weavers.com/search.php"};
var nonBoolDefaults = { "Number of feat columns":{'global':16,'local':8},
                        "Number of spell sheets":{'global':4,'local':4},
                        "Number of item backpacks":{'global':6,'local':4}
                      };
var toggleDefaults = {"Show game-wide templates":true,"Show site-wide templates":false, "Rearrange front page":true,'Auto-load sheet on visit':false,'Show featstore':false,'Show spell sheets':true,'Show item backpacks':true,'Show feat suggestions':true,'Show item suggestions':true,'Show spell suggestions':true,
                      "Keep time current":true, "Show online friends":true, "Audio notify when new messages are received": false, "Hide signatures":true,'Add extra buttons to threads':true,
                      "Show who is browsing subscribed games":true, "Show dice composer":true, "Widescreen":false,"WidescreenPortal":true, 'Tally gold spent in Currency box':false,
                      "Show past thread analyses":false, /*TODO:*/"Show user analyses in hover":true, "Auto-analyse thread on thread visit":false,'Quench auto-crossclassing when skill name changes':true,
                      "Show shop button":false , "Show footer":false, "Show toolkit": true, "Remind me of unread messages":false, 'Tally gold spent in Currency box':true, 'Auto-save copy of PMs':true,
                      "Private recipients checked by default":false, "Show resize controls on front page":false,"Use weight column for item costs":false,'Replace Site Tools with pop ups':true,'Show search box':false };
var sheetToggleList = ["Use weight column for item costs",'Auto-load sheet on visit','Tally gold spent in Currency box','Quench auto-crossclassing when skill name changes','Show featstore','Show spell sheets','Show item backpacks','Show feat suggestions','Show item suggestions','Show spell suggestions'];
var defaultNewMessageURL = "https://hydra-media.cursecdn.com/dota2.gamepedia.com/e/e3/Announcer_intl2012_usher_02.mp3";
var buffHash={};
var staticNewMessageImage = "//static.myth-weavers.com/images/sonata/statusicon/thread_new.gif";

var prettyAttributes = {  "Fort":"Fort save", "Reflex":"Reflex save", "Will":"Will save",
                          "Init":"Initiative", "MBAB":"Melee attack", "RBAB":"Ranged attack", "CMB":"Combat Manoeuvre","CasterLevel":"Caster level check",
                          "StrMod":"Strength check",
                          "DexMod":"Dexterity check", "ConMod":"Constitution check", "IntMod":"Intelligence check", 
                          "WisMod":"Wisdom check", "ChaMod":"Charisma check"
                        };
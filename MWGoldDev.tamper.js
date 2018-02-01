// ==UserScript==
// @name        MWGoldDev
// @namespace   http://seanlithgow.com.au/scripts
// @description Myth-Weavers Gold
// @include     /^https?://www\.myth-weavers\.com/
// @exclude     /^https?://www\.myth-weavers\.com/wiki/
// @exclude     /^https?://www\.myth-weavers\.com/map\.html/ 
// @version     9.9.9
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require     MWGold.head.js
// @require     MWGold.lib.buffs.js
// @require     MWGold.lib.live.js
// @require     MWGold.lib.util.js
// @require     MWGold.lib.scrape.js
// @require     MWGold.lib.editor.js
// @require     MWGold.lib.anal.js
// @require     MWGold.lib.portal.js
// @require     MWGold.lib.glue.js
// @require     MWGold.lib.dialogs.js
// @require     MWGold.lib.sheets.js
// @require     MWGold.main.js
// ==/UserScript==
//v=1.17.5
debugMode = true; showMemStuff=true;

makeAwesome();
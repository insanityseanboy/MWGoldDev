function cleanArray (actual) { 
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i] && actual[i].length!=0) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}
function saveVal (key, val) { //todo: save to uNum+"_"+key
    switch (typeof val)
    {
        case "undefined": log("setting undefined value to key:"+key);
        break;
        case "boolean": GM_setValue(key,val); GM_setValue(key+"_type", typeof(val));
        break;
        case "string": GM_setValue(key,val); GM_setValue(key+"_type", typeof(val));
        break;
        case "number": GM_setValue(key,val); GM_setValue(key+"_type", typeof(val));
        break;
        case "object": GM_setValue(key,JSON.stringify(val)); GM_setValue(key+"_type", typeof(val));
        break;
        default: log("setting unknown value ("+value+") to key:"+key);
    }
}
function loadVal (key,defaultVal) {  //todo: load from uNum+"_"+key
    var thing=defaultVal;
    var type = GM_getValue(key+"_type", null);
    if (type==null) {
    return defaultVal;}
    switch (type)
    {
        case "undefined": log("found undefined value for key:"+key);
        break;
        case "boolean": thing = GM_getValue(key,defaultVal); 
        break;
        case "string": thing = GM_getValue(key,defaultVal); 
        break;
        case "number": thing = GM_getValue(key,defaultVal);
        break;
        case "object": thing = JSON.parse(GM_getValue(key,JSON.stringify(defaultVal)));
        break;
        default: log("found peculiar value for key:"+key);
    }
    return thing;
}
var fauxButton = "-moz-appearance: button; color:white; background-image: linear-gradient(to bottom, #08c, #04c); background-repeat: repeat-x; max-width: 100px; text-align: center; padding: 1px; cursor:pointer; display:inline-block; ";
function printFauxButton(id,text,mouseOver) {
    //return "<button class='smalltext btn btn-primary' title='"+mouseOver+"' id='"+id+"'>"+text+"</button>"; //style='"+fauxButton+"' 
    return "<div class='smalltext' title='"+mouseOver+"' style='"+fauxButton+"' id='"+id+"'>"+text+"</div>"; //background-color:navy; 
}

function getSelection(textArea) {
    var a = $('#'+textArea)[0].selectionStart, b = $('#'+textArea)[0].selectionEnd;
    log("found selection '"+$('#'+textArea).val().substr(a,b-a)+"'");
    return $('#'+textArea).val().substr(a,b-a);}

function putAnAlertSomewhere (message, where) { 
    $('#tempDiv').remove();
    // if (!$('#alerts').length) $("<div id='alerts'></div>").prependTo('body');
    // $("<div class='ui-dialog ui-state-error'></div>").append('<div class="ui-dialog-content" style="padding: 0 .7em;"><button class="close" data-dismiss="alert">x</button><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span><strong>'+message+'</strong></div>').appendTo('#alerts');
    $(where).append("<div id='tempDiv'>"+message+"</div>");
    $('#tempDiv').fadeOut(3000).promise().done(function () {
        $(this).remove();
    });
}

jQuery.expr[":"].CoNTains = jQuery.expr.createPseudo(function(arg) {
    return function( elem ) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
function insertAtCaret (areaId, text) { 
    var txtarea = document.getElementById(areaId);
    if (!txtarea) { return; }

    var scrollPos = txtarea.scrollTop;
    var strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0, strPos);
    var back = (txtarea.value).substring(strPos, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos = strPos + text.length;

    txtarea.selectionStart = strPos;
    txtarea.selectionEnd = strPos;
    txtarea.focus();

    txtarea.scrollTop = scrollPos;}
function overwrite (areaId, text) { 
    var txtarea = document.getElementById(areaId);
    if (!txtarea) { return; }

    var scrollPos = txtarea.scrollTop;
    var strPos1 = txtarea.selectionStart;
    var strPos2 = txtarea.selectionEnd;
    if (strPos1==strPos2) {insertAtCaret(areaId,text); return;}

    var front = (txtarea.value).substring(0, strPos1);
    var back = (txtarea.value).substring(strPos2, txtarea.value.length);
    txtarea.value = front + text + back;
    strPos2 = strPos1 + text.length;

    txtarea.selectionStart = strPos1;
    txtarea.selectionEnd = strPos2;
    txtarea.focus();

    txtarea.scrollTop = scrollPos;}
    
function getErrorObject(){try { throw Error('') } catch(err) { return err; }}
function getLineNumber(){return getErrorObject().stack.split("\n")[3].replace(/.*:(\d+:\d+)$/,'$1');}//split("/").slice(-1).
function log(s){if (!debugMode) return; if (log.caller==null) console.log("main@"+getLineNumber()+": "+s); else console.log(log.caller.name+"@"+getLineNumber()+": "+s);}

/*!!
 * Title Alert 0.7
 * 
 * Copyright (c) 2009 ESN | http://esn.me
 * Jonatan Heyman | http://heyman.info
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 */
 
/* 
 * @name jQuery.titleAlert
 * @projectDescription Show alert message in the browser title bar
 * @author Jonatan Heyman | http://heyman.info
 * @version 0.7.0
 * @license MIT License
 * 
 * @id jQuery.titleAlert
 * @param {String} text The text that should be flashed in the browser title
 * @param {Object} settings Optional set of settings.
 *   @option {Number} interval The flashing interval in milliseconds (default: 500).
 *   @option {Number} originalTitleInterval Time in milliseconds that the original title is diplayed for. If null the time is the same as interval (default: null).
 *   @option {Number} duration The total lenght of the flashing before it is automatically stopped. Zero means infinite (default: 0).
 *   @option {Boolean} stopOnFocus If true, the flashing will stop when the window gets focus (default: true).
 *   @option {Boolean} stopOnMouseMove If true, the flashing will stop when the browser window recieves a mousemove event. (default:false).
 *   @option {Boolean} requireBlur Experimental. If true, the call will be ignored unless the window is out of focus (default: false).
 *                                 Known issues: Firefox doesn't recognize tab switching as blur, and there are some minor IE problems as well.
 *
 * @example $.titleAlert("Hello World!", {requireBlur:true, stopOnFocus:true, duration:10000, interval:500});
 * @desc Flash title bar with text "Hello World!", if the window doesn't have focus, for 10 seconds or until window gets focused, with an interval of 500ms
 */
;(function($){  
    $.titleAlert = function(text, settings) {
        // check if it currently flashing something, if so reset it
        if ($.titleAlert._running)
            $.titleAlert.stop();
        
        // override default settings with specified settings
        $.titleAlert._settings = settings = $.extend( {}, $.titleAlert.defaults, settings);
        
        // if it's required that the window doesn't have focus, and it has, just return
        if (settings.requireBlur && $.titleAlert.hasFocus)
            return;
        
        // originalTitleInterval defaults to interval if not set
        settings.originalTitleInterval = settings.originalTitleInterval || settings.interval;
        
        $.titleAlert._running = true;
        $.titleAlert._initialText = document.title;
        document.title = text;
        var showingAlertTitle = true;
        var switchTitle = function() {
            // WTF! Sometimes Internet Explorer 6 calls the interval function an extra time!
            if (!$.titleAlert._running)
                return;
            
            showingAlertTitle = !showingAlertTitle;
            document.title = (showingAlertTitle ? text : $.titleAlert._initialText);
            $.titleAlert._intervalToken = setTimeout(switchTitle, (showingAlertTitle ? settings.interval : settings.originalTitleInterval));
        }
        $.titleAlert._intervalToken = setTimeout(switchTitle, settings.interval);
        
        if (settings.stopOnMouseMove) {
            $(document).mousemove(function(event) {
                $(this).unbind(event);
                $.titleAlert.stop();
            });
        }
        
        // check if a duration is specified
        if (settings.duration > 0) {
            $.titleAlert._timeoutToken = setTimeout(function() {
                $.titleAlert.stop();
            }, settings.duration);
        }
    };
    
    // default settings
    $.titleAlert.defaults = {
        interval: 500,
        originalTitleInterval: null,
        duration:0,
        stopOnFocus: true,
        requireBlur: true,
        stopOnMouseMove: false
    };
    
    // stop current title flash
    $.titleAlert.stop = function() {
        clearTimeout($.titleAlert._intervalToken);
        clearTimeout($.titleAlert._timeoutToken);
        document.title = $.titleAlert._initialText;
        
        $.titleAlert._timeoutToken = null;
        $.titleAlert._intervalToken = null;
        $.titleAlert._initialText = null;
        $.titleAlert._running = false;
        $.titleAlert._settings = null;
    }
    
    $.titleAlert.hasFocus = true;
    $.titleAlert._running = false;
    $.titleAlert._intervalToken = null;
    $.titleAlert._timeoutToken = null;
    $.titleAlert._initialText = null;
    $.titleAlert._settings = null;
    
    
    $.titleAlert._focus = function () {
        $.titleAlert.hasFocus = true;
        
        if ($.titleAlert._running && $.titleAlert._settings.stopOnFocus) {
            var initialText = $.titleAlert._initialText;
            $.titleAlert.stop();
            
            // ugly hack because of a bug in Chrome which causes a change of document.title immediately after tab switch
            // to have no effect on the browser title
            setTimeout(function() {
                if ($.titleAlert._running)
                    return;
                document.title = ".";
                document.title = initialText;
            }, 1000);
        }
    };
    $.titleAlert._blur = function () {
        $.titleAlert.hasFocus = false;
    };
    
    // bind focus and blur event handlers
    $(window).bind("focus", $.titleAlert._focus);
    $(window).bind("blur", $.titleAlert._blur);
})(jQuery);

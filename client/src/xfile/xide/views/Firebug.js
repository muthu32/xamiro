//>>built
define("xide/views/Firebug",["dojo/_base/declare","xide/layout/ContentPane","dojo/text!./templates/Firebug.html","dojo/dom-geometry"],function(e,f,g,h){return e([f],{delegate:null,cssClass:"layoutContainer",owner:null,scriptUrl:"../../client/lib/external/firebug-dev/build/firebug-lite-debug.js",title:"Log",resize:function(){this.inherited(arguments);"undefined"!==typeof Firebug&&Firebug.chrome&&Firebug.chrome.draw()},onLoaded:function(d,c){d.initialize();var a=this;setTimeout(function(){var b=dojo.byId("fbUIDiv");
b&&dojo.place(b,a.containerNode);window.xlog=function(a,b){Firebug.Console.log(a,b)};window.xlog=function(a,b,c){null!=c&&Firebug.Console.openGroup(c);Firebug.Console.log(a,b);null!=c&&Firebug.Console.closeGroup(c)};window.xwarn=function(a,b){Firebug.Console.warn(a,b)};window.xerror=function(a,b){Firebug.Console.error(a,b)};window.xtrace=function(a,b){Firebug.Console.trace(a,b)}},1E3)},loadFirebug:function(){var d=this;window.FirebugTemplate=g;window.getFirebugSize=function(){var a=h.getMarginBox(d.containerNode);
return{width:a.w-16,height:a.h-8}};window.onFirebugReady=function(a,b){d.onLoaded(a,b)};var c=this.scriptUrl,c=c+"#enableTrace\x3dtrue,overrideConsole\x3dfalse,startOpened\x3dtrue,ignoreFirebugElements\x3dfalse";-1==window.location.href.indexOf("isDesktop")&&(c=c.replace("overrideConsole\x3dtrue","overrideConsole\x3dfalse"));(function(a){if(!a)return!1;var b=document.createElement("script");b.type="text/javascript";b.src=a;b.onload=function(){setTimeout(function(){},2E3)};document.getElementsByTagName("head")[0].appendChild(b);
return!0})(c)},startup:function(){this.inherited(arguments);this.loadFirebug()}})});
//# sourceMappingURL=Firebug.js.map
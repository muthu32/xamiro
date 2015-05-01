//>>built
define("xide/views/CodeMirrorEditor","dojo/_base/declare dojo/_base/array dojo/_base/html dojo/_base/connect dojo/dom-construct xide/utils xide/layout/ContentPane xide/factory xfile/types".split(" "),function(l,k,q,g,h,f,m,n,p){return l("xide.views.CodeMirrorEditor",[m],{wFloatingPane:null,closeable:!0,moduleView:null,didStartup:!1,editorRoot:null,aceEditor:null,editorControlsRoot:null,btnSave:null,title:null,dataItem:null,value:null,titleWidget:null,ctrlDown:!1,hasSaveButton:!0,attachACEditor:!0,
root:null,toolbar:null,pane:null,content:null,editorFrame:null,rootPrefix:"",templateString:"\x3cdiv\x3e\x3cdiv class\x3d'aceCSSEditor' data-dojo-type\x3d'dijit.layout.ContentPane' title\x3d'${!title}' closable\x3d'true' data-dojo-attach-point\x3d'pane' style\x3d'padding:5px'\x3e\x3cdiv data-dojo-attach-point\x3d'editorControlsRoot'\x3e\x3c/div\x3e\x3cbr/\x3e\x3cdiv data-dojo-attach-point\x3d'editorRoot' style\x3d'height:inherit;width: 100%'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e",getPermaLink:function(){if(this.params&&
this.params.filePath)return encodeURIComponent(this.params.filePath)},onShow:function(a){this.inherited(arguments);try{this.codeMirror&&this.content&&this.codeMirror.refresh()}catch(b){debugger}},focus:function(){this.inherited(arguments);var a=this;this.parentContainer&&this.parentContainer.selectChild&&this.parentContainer.selectChild(this);this.domNode.tabindex=1;this.containerNode.tabindex=1;setTimeout(function(){a.domNode.focus();a.containerNode.focus()},0);var b=a.codeMirror;setTimeout(function(){b&&
b.display&&b.display.input&&b.display.input.focus&&(b.display.input.tabindex=1,b.display.input.focus())},500)},createEditorControls:function(){},onFullscreen:function(a){this.codeMirror.setOption("fullScreen",!this.codeMirror.getOption("fullScreen"))},getContent:function(){return this.codeMirror.getValue()},onSave:function(a){var b=this;try{var c=this.codeMirror.getValue();c&&this.delegate.setFileContent(this.filePath,c,function(a){n.createEvent(p.EVENTS.ON_FILE_CONTENT_CHANGED,{path:b.filePath},
b)})}catch(d){console.error("error saving")}},setContent:function(a){this.content=a;this.codeMirror.setValue(a);this.codeMirror.refresh()},loadContent:function(a){var b=this;this.delegate.getFileContent(a,function(a){if(null!=a){var d=b.codeMirror;this.content=a;b.codeMirror.setValue(a);if(a=b.parentContainer)a.resize(),b.codeMirror.refresh();setTimeout(function(){d&&d.display&&d.display.input&&d.display.input.focus&&d.display.input.focus()},500)}});if(a=this.parentContainer)a.resize(),this.codeMirror.refresh()},
setDefaults:function(){return{stylesheet:["/lib/codemirror.css"],path:""+this.rootPrefix+"/lib/external/codemirror-3.20/",autofocus:!0,parserfile:[],basefiles:["addon/mode/loadmode.js"],iframeClass:null,passDelay:200,passTime:50,lineNumberDelay:200,lineNumberTime:50,continuousScanning:!1,saveFunction:null,mode:"javascript",onLoad:function(){debugger},onChange:null,undoDepth:50,undoDelay:800,disableSpellcheck:!0,textWrapping:!0,readOnly:!1,width:"",height:"400px",minHeight:100,autoMatchParens:!1,parserConfig:null,
tabMode:"indent",enterMode:"indent",electricChars:!0,reindentOnLoad:!1,activeTokens:null,onCursorActivity:null,lineNumbers:!1,firstLineNumber:1,onLineNumberClick:null,indentUnit:2,domain:null,noScriptCaching:!1}},frameHTML:function(a){"string"==typeof a.parserfile&&(a.parserfile=[a.parserfile]);"string"==typeof a.basefiles&&(a.basefiles=[a.basefiles]);"string"==typeof a.stylesheet&&(a.stylesheet=[a.stylesheet]);var b=['\x3c!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"\x3e\x3chtml\x3e\x3chead\x3e'];
b.push('\x3cmeta http-equiv\x3d"X-UA-Compatible" content\x3d"IE\x3dEmulateIE7"/\x3e');var c=this.rootPrefix+"/lib/external/codemirror-3.20/",d=a.noScriptCaching?"?nocache\x3d"+(new Date).getTime().toString(16):"";k.forEach(a.stylesheet,function(a){b.push('\x3clink rel\x3d"stylesheet" type\x3d"text/css" href\x3d"'+c+a+d+'"/\x3e')});k.forEach(a.basefiles.concat(a.parserfile),function(c){/^https?:/.test(c)||(c=a.path+c);b.push('\x3cscript type\x3d"text/javascript" src\x3d"'+c+d+'"\x3e\x3c/script\x3e')});
b.push('\x3cscript type\x3d"text/javascript"\x3evar dst \x3d document.getElementById(\'editbox\');var cm \x3d new CodeMirror(null,document.options);cm.setOption("mode", "javascript");debugger;\x3c/script\x3e');b.push('\x3c/head\x3e\x3cbody style\x3d"border-width: 0;" id\x3d"editbox" class\x3d"editbox" spellcheck\x3d"'+(a.disableSpellcheck?"false":"true")+'"\x3e\x3cscript type\x3d"text/javascript"\x3evar dst \x3d document.getElementById(\'editbox\');var cm \x3d new CodeMirror(null,document.options);cm.setOption("mode", "javascript");debugger;\x3c/script\x3e\x3c/body\x3e\x3c/html\x3e');
return b.join("")},initCodeMirror2:function(a,b){this.editorFrame=h.create("iframe",{src:"javascript:;"},dojo.doc.createElement("div"));var c=this.options=this.setDefaults(),d=this.editorFrame;d.frameBorder=0;d.style.border="0";d.style.width="100%";d.style.height="100%";d.style.display="block";var e=this.wrapping=h.create("div");e.style.position="relative";e.className="CodeMirror-wrapping";e.style.width=c.width;e.style.height="dynamic"==c.height?c.minHeight+"px":c.height;c=this.textareaHack=h.create("textarea");
e.appendChild(c);c.style.position="absolute";c.style.left="-10000px";c.style.width="10px";c.tabIndex=1E5;this.containerNode.appendChild(e);e.appendChild(d);this.options.textWrapping=this.textWrapping;this.options.lineNumbers=this.lineNumbers;this.win=d.contentWindow;this.win.document.open();this.win.document.write("asdfasdfasdf asdfsdf");this.win.document.close()},initCodeMirror:function(a,b){var c=this;this.codeMirror=new CodeMirror(this.containerNode,{lineNumbers:!0,matchBrackets:!0,stylesheet:[],
path:"",iframeClass:"iframeclass",passDelay:200,passTime:50,lineNumberDelay:200,lineNumberTime:50,continuousScanning:!1,saveFunction:null,onLoad:null,onChange:null,undoDepth:50,undoDelay:800,disableSpellcheck:!0,textWrapping:!0,width:"",height:"300px",minHeight:100,autoMatchParens:!1,parserConfig:null,tabMode:"indent",enterMode:"indent",electricChars:!0,reindentOnLoad:!1,activeTokens:null,onCursorActivity:null,firstLineNumber:1,onLineNumberClick:null,domain:null,noScriptCaching:!0,mode:"application/x-httpd-php",
indentUnit:4,readOnly:!1,foldGutter:!0,gutters:["CodeMirror-linenumbers","CodeMirror-foldgutter"],extraKeys:{F11:function(a){a.setOption("fullScreen",!c.codeMirror.getOption("fullScreen"))},Esc:function(a){c.codeMirror.getOption("fullScreen")&&c.codeMirror.setOption("fullScreen",!1)}}});var d=f.getFileExtension(b);"html"===d&&(d="htmlmixed");"js"===d&&(d="javascript");"json"===d&&(d="javascript");"sh"===d&&(d="shell");"cp"===d&&(d="xml");"less"===d&&(d="less");this.codeMirror.setOption("mode",d);
CodeMirror.autoLoadMode(this.codeMirror,d);this.loadContent(b)},onOpen:function(a){CodeMirror.modeURL=this.root+"/mode/%N/%N.js";a=f.getFileExtension(a);var b,c,d={};switch(a){case "js":case "json":b=["tokenizejavascript.js","parsejavascript.js"];c="plugins/editor.codemirror/CodeMirror/css/jscolors.css";"json"==a&&(d.json=!0);break;case "xml":b="parsexml.js";c="plugins/editor.codemirror/CodeMirror/css/xmlcolors.css";break;case "css":b="parsecss.js";c="plugins/editor.codemirror/CodeMirror/css/csscolors.css";
break;case "html":b=["parsexml.js","parsecss.js","tokenizejavascript.js","parsejavascript.js","parsehtmlmixed.js"];c=["plugins/editor.codemirror/CodeMirror/css/xmlcolors.css","plugins/editor.codemirror/CodeMirror/css/jscolors.css","plugins/editor.codemirror/CodeMirror/css/csscolors.css"];break;case "sparql":b="parsesparql.js";c="plugins/editor.codemirror/CodeMirror/css/sparqlcolors.css";break;case "php":case "phtml":b="parsexml.js parsecss.js tokenizejavascript.js parsejavascript.js ../contrib/php/js/tokenizephp.js ../contrib/php/js/parsephp.js ../contrib/php/js/parsephphtmlmixed.js".split(" ");
c=["plugins/editor.codemirror/CodeMirror/css/xmlcolors.css","plugins/editor.codemirror/CodeMirror/css/jscolors.css","plugins/editor.codemirror/CodeMirror/css/csscolors.css","plugins/editor.codemirror/CodeMirror//contrib/php/css/phpcolors.css"];break;case "py":b="../contrib/python/js/parsepython.js";c="plugins/editor.codemirror/CodeMirror/contrib/python/css/pythoncolors.css";ResourcesManager.prototype.loadCSSResource("plugins/editor.codemirror/css/linenumbers-py.css");break;case "lua":b="../contrib/lua/js/parselua.js";
c="plugins/editor.codemirror/CodeMirror/contrib/python/css/luacolors.css";break;case "c#":b=["../contrib/csharp/js/tokenizecsharp.js","../contrib/csharp/js/parsecsharp.js"];c="plugins/editor.codemirror/CodeMirror/contrib/csharp/css/csharpcolors.css";break;case "java":case "jsp":b=["../contrib/java/js/tokenizejava.js","../contrib/java/js/parsejava.js"];c="plugins/editor.codemirror/CodeMirror/contrib/java/css/javacolors.css";break;case "sql":b="../contrib/sql/js/parsesql.js";c="plugins/editor.codemirror/CodeMirror/contrib/sql/css/sqlcolors.css";
break;case "xquery":b=["../contrib/xquery/js/tokenizexquery.js","../contrib/xquery/js/parsexquery.js"];c="plugins/editor.codemirror/CodeMirror/contrib/xquery/css/xquerycolors.css";break;default:b="parsedummy.js",c="plugins/editor.codemirror/CodeMirror/../css/dummycolors.css"}this.options={path:"plugins/editor.codemirror/CodeMirror/js/",parserfile:b,stylesheet:c,parserConfig:d}},onHide:function(){},onClose2:function(){f.destroyWidget(this.codeMirror);this.inherited(arguments);f.destroyWidget(this.id);
dijit.byId("topTabs").removeChild(this)},destroy:function(){},dataRecievedJSON:function(a){this.content=a.description;this.title=a.title;this.titleWidget.value=this.title;this.attachCKEditor()},saveContentCB:function(a,b){console.error("content saved")},saveContent:function(){var a=this.aceEditor.get("value");sctx.getStyleManager().updateSheet(sctx.getSession().getUUID(),sctx.getSession().getAppId(),f.toString(this.dataItem.path),a);sctx.getWorkflowManager().onCSSEditorChange(this.dataItem,a)},startup:function(){if(!this.didStartup){this.set("closable",
!0);this.inherited(arguments);this.didStartup=!0;var a=this;this.createEditorControls();this.onOpen(this.filePath);a.initCodeMirror(!1,a.filePath);g.connect(this.containerNode,"onclick",function(b){a.focus()});g.connect(this.domNode,"onkeyup",function(b){17==b.keyCode&&(a.ctrlDown=!1)});g.connect(this.domNode,"onkeydown",function(b){17==b.keyCode&&(a.ctrlDown=!0);a.ctrlDown&&83==b.keyCode&&(b.preventDefault(),a.onSave())})}}})});
//# sourceMappingURL=CodeMirrorEditor.js.map
//>>built
define("Shell/views/ShellView","xide/widgets/TemplatedWidgetBase xide/widgets/_CSSMixin xide/widgets/_StyleMixin xide/widgets/_InsertionMixin xide/utils xide/types xide/factory dojo/cookie dojo/json ./ShellRunView".split(" "),function(g,h,k,l,c,d,m,e,f,n){return dojo.declare("Shell.xfile.views.ShellView",[g,h,k,l],{config:null,ctx:null,cssClass:"mainView XShellView",layoutMain:null,layoutTop:null,layoutLeft:null,layoutCenter:null,layoutRight:null,layoutBottom:null,panelManager:null,leftPanel:null,
centerPanel:null,tabContainer:null,bottomTabContainer:null,logPanel:null,preview:null,cookieName:null,topics:null,panels:null,templateString:"\x3cdiv\x3e\x3cdiv data-dojo-attach-point\x3d'layoutMain' data-dojo-type\x3d'xide.layout.BorderContainer' data-dojo-props\x3d\"design:'sidebar',cookieName:'${!cookieName}'\" class\x3d'layoutMain ui-widget-content'\x3e\x3cdiv data-dojo-attach-point\x3d'layoutCenter' style\x3d'padding:0px;' data-dojo-type\x3d'dijit.layout.ContentPane' data-dojo-props\x3d\"region:'center',splitter:'false'\" class\x3d'layoutCenter'\x3e\x3c/div\x3e\x3cdiv data-dojo-attach-point\x3d'layoutRight' data-dojo-type\x3d'dijit.layout.ContentPane' data-dojo-props\x3d\"region:'right',splitter:'true',minSize:'200',toggleSplitterState:'full',toggleSplitterFullSize:'200px' \" class\x3d'layoutRight filePropertyPanel ui-state-default'\x3e\x3c/div\x3e\x3cdiv data-dojo-attach-point\x3d'layoutBottom' data-dojo-type\x3d'dijit.layout.ContentPane' data-dojo-props\x3d\"region:'bottom',splitter:'true',toggleSplitterState:'closed',toggleSplitterClosedSize:'0px',toggleSplitterFullSize:'150px'\" class\x3d'layoutBottom ui-state-default'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e",
prepareLayout:function(a){a.LAYOUT_PRESET==d.LAYOUT_PRESET.SINGLE&&this.layoutMain.removeChild(this.layoutLeft);null!=a.PANEL_OPTIONS&&!1===a.PANEL_OPTIONS.ALLOW_INFO_VIEW&&this.layoutMain.removeChild(this.layoutRight);!this.layoutTop||null==a.PANEL_OPTIONS||!1!==a.PANEL_OPTIONS.ALLOW_BREADCRUMBS&&0!==a.PANEL_OPTIONS.ALLOW_BREADCRUMBS||null!=a.ACTION_TOOLBAR_MODE&&"self"==a.ACTION_TOOLBAR_MODE?this.layoutTop&&this.layoutTop._splitterWidget&&(c.destroyWidget(this.layoutTop._splitterWidget),this.layoutTop._splitterWidget=
null):this.layoutMain.removeChild(this.layoutTop);null!=a.PANEL_OPTIONS&&!1===a.PANEL_OPTIONS.ALLOW_LOG_VIEW?this.layoutMain.removeChild(this.layoutBottom):this.layoutBottom._splitterWidget&&(this.layoutBottom._splitterWidget.fullSize="150px",this.layoutBottom._splitterWidget.collapsedSize=null,this.bottomTabContainer||(this.bottomTabContainer=this._createBottomTabContainer(),this.logPanel=new dijit.layout.ContentPane({className:"bottomTabLog",title:"Log",style:"padding:0;background-color: transparent;"},
dojo.doc.createElement("div")),this.bottomTabContainer.addChild(this.logPanel)))},getPanelManager:function(){return this.panelManager},createShellPanel:function(a,b,c){b=new n({title:c,closable:!1,delegate:this,type:b,style:"padding:0px;margin:0px;height:inherit",className:"runView"},dojo.doc.createElement("div"));a.addChild(b)},initWithConfig:function(a){try{this.prepareLayout(a);var b=this.createTabContainer(this.layoutCenter);this.panels.push(this.createShellPanel(b,"sh","Bash"));this.panels.push(this.createShellPanel(b,
"js","Javascript"))}catch(c){debugger}this.resize()},removeEmptyContainers:function(){c.destroyIfEmpty(this.layoutRight);c.destroyIfEmpty(this.layoutCenter);c.destroyIfEmpty(this.layoutLeft);c.destroyIfEmpty(this.layoutTop);c.destroyIfEmpty(this.layoutBottom)},_resizeContainer:function(a,b){try{a&&a.domNode&&a.resize()}catch(c){}},resize:function(){this.inherited(arguments);this.layoutMain&&this._resizeContainer(this.layoutMain,"main");this.layoutLeft&&this._resizeContainer(this.layoutLeft,"left");
this.layoutTop&&this._resizeContainer(this.layoutTop,"top");this.layoutCenter&&this._resizeContainer(this.layoutCenter,"center");this.layoutRight&&this._resizeContainer(this.layoutRight,"right");this.layoutLeft&&this._resizeContainer(this.layoutLeft,"left");this.layoutBottom&&this._resizeContainer(this.layoutBottom,"bottom")},onStartupPost:function(){var a=this;dojo.connect(null,void 0!==dojo.global.onorientationchange?"onorientationchange":"onresize",this,function(){a.resize()});this.removeEmptyContainers();
this.resize()},postCreate:function(){this.inherited(arguments)},buildRendering:function(){this.inherited(arguments)},_createBottomTabContainer:function(){var a=new dijit.layout.TabContainer({tabStrip:!0,tabPosition:"bottom",region:"bottom",attachParent:!0,style:"width:100%"},dojo.doc.createElement("div"));this.layoutBottom.containerNode.appendChild(a.domNode);a.startup();return a},destroy:function(){this.toolbar=null;c.destroyWidget(this.preview);c.destroyWidget(this.leftPanel);this.preview=null;
dojo.forEach(this.topics,dojo.unsubscribe)},startup:function(){this.inherited(arguments);this.panels=[];this.toolbar&&(this.toolbar.delegate=this);this.topics=[m.subscribe(d.EVENTS.IMAGE_LOADED,this.resize,this)]},loadPreferences:function(){var a=e(this.cookiePrefix+"_items_");return a=a?f.parse(a):[]},savePreferences:function(){try{for(var a=[],b=0;b<this.panels.length;b++)this.panels[b].item&&this.panels[b].item.path&&a.push(this.panels[b].item.path);e(this.cookiePrefix+"_items_",f.stringify(a))}catch(c){debugger}},
onEditorClose:function(a){this.panels.remove(a);this.savePreferences()},addItem:function(a){var b=this.getNewAlternateTarget(this.layoutLeft);a=this.ctx.getScriptManager().openFile(a,b,this);this.panels.push(a);b.selectChild(a);this.savePreferences()},createTabContainer:function(a){if(!this.tabContainer){var b=new dijit.layout.TabContainer({tabStrip:!0,tabPosition:"left",splitter:!0,region:"center",attachParent:!0,style:"width:100%;height:100%"},dojo.doc.createElement("div"));a.containerNode.appendChild(b.domNode);
b.startup();this.tabContainer=b}return this.tabContainer},onConsoleEnter:function(a,b){this.delegate.onConsoleCommand(a,b)}})});
//# sourceMappingURL=ShellView.js.map
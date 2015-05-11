//>>built
require({
    cache: {
        "JSONEditor/History": function () {
            define(["dojo/_base/declare", "./util"], function (p, g) {
                function l(g) {
                    this.editor = g;
                    this.clear();
                    this.actions = {
                        editField: {
                            undo: function (b) {
                                b.node.updateField(b.oldValue)
                            }, redo: function (b) {
                                b.node.updateField(b.newValue)
                            }
                        }, editValue: {
                            undo: function (b) {
                                b.node.updateValue(b.oldValue)
                            }, redo: function (b) {
                                b.node.updateValue(b.newValue)
                            }
                        }, appendNode: {
                            undo: function (b) {
                                b.parent.removeChild(b.node)
                            }, redo: function (b) {
                                b.parent.appendChild(b.node)
                            }
                        }, insertBeforeNode: {
                            undo: function (b) {
                                b.parent.removeChild(b.node)
                            },
                            redo: function (b) {
                                b.parent.insertBefore(b.node, b.beforeNode)
                            }
                        }, insertAfterNode: {
                            undo: function (b) {
                                b.parent.removeChild(b.node)
                            }, redo: function (b) {
                                b.parent.insertAfter(b.node, b.afterNode)
                            }
                        }, removeNode: {
                            undo: function (b) {
                                var d = b.parent;
                                d.insertBefore(b.node, d.childs[b.index] || d.append)
                            }, redo: function (b) {
                                b.parent.removeChild(b.node)
                            }
                        }, duplicateNode: {
                            undo: function (b) {
                                b.parent.removeChild(b.clone)
                            }, redo: function (b) {
                                b.parent.insertAfter(b.clone, b.node)
                            }
                        }, changeType: {
                            undo: function (b) {
                                b.node.changeType(b.oldType)
                            },
                            redo: function (b) {
                                b.node.changeType(b.newType)
                            }
                        }, moveNode: {
                            undo: function (b) {
                                b.startParent.moveTo(b.node, b.startIndex)
                            }, redo: function (b) {
                                b.endParent.moveTo(b.node, b.endIndex)
                            }
                        }, sort: {
                            undo: function (b) {
                                var d = b.node;
                                d.hideChilds();
                                d.sort = b.oldSort;
                                d.childs = b.oldChilds;
                                d.showChilds()
                            }, redo: function (b) {
                                var d = b.node;
                                d.hideChilds();
                                d.sort = b.newSort;
                                d.childs = b.newChilds;
                                d.showChilds()
                            }
                        }
                    }
                }

                l.prototype.onChange = function () {
                };
                l.prototype.add = function (g, b) {
                    this.index++;
                    this.history[this.index] = {
                        action: g, params: b,
                        timestamp: new Date
                    };
                    this.index < this.history.length - 1 && this.history.splice(this.index + 1, this.history.length - this.index - 1);
                    this.onChange()
                };
                l.prototype.clear = function () {
                    this.history = [];
                    this.index = -1;
                    this.onChange()
                };
                l.prototype.canUndo = function () {
                    return 0 <= this.index
                };
                l.prototype.canRedo = function () {
                    return this.index < this.history.length - 1
                };
                l.prototype.undo = function () {
                    if (this.canUndo()) {
                        var f = this.history[this.index];
                        if (f) {
                            var b = this.actions[f.action];
                            b && b.undo ? (b.undo(f.params), f.params.oldSelection &&
                            this.editor.setSelection(f.params.oldSelection)) : g.log('Error: unknown action "' + f.action + '"')
                        }
                        this.index--;
                        this.onChange()
                    }
                };
                l.prototype.redo = function () {
                    if (this.canRedo()) {
                        this.index++;
                        var f = this.history[this.index];
                        if (f) {
                            var b = this.actions[f.action];
                            b && b.redo ? (b.redo(f.params), f.params.newSelection && this.editor.setSelection(f.params.newSelection)) : g.log('Error: unknown action "' + f.action + '"')
                        }
                        this.onChange()
                    }
                };
                return l
            })
        }, "JSONEditor/JSONEditor": function () {
            define("dojo/_base/declare dojo/_base/lang ./util ./TreeMode xide/mixins/EventedMixin xide/mixins/ReloadMixin xide/types xide/utils xide/bean/Action xide/widgets/_InsertionMixin xide/widgets/TemplatedWidgetBase xide/widgets/_CSSMixin".split(" "),
                function (p, g, l, f, b, d, a, c, k, e, h, q, n, m, r, t, u) {
                    return p("JSONEditor.JSONEditor", [h, q, f, e, b, d], {
                        baseClass: "jsoneditor_widget",
                        templateString: '\x3cdiv style\x3d"height: inherit;width: inherit;overflow: hidden"\x3e\x3c/div\x3e',
                        options: null,
                        emits: {visit: !0, setEditable: !0, render: !0, renderNode: !0, onAction: !0, event: !0},
                        preserveExpandState: !0,
                        _expanded: null,
                        preserveSelectedState: !0,
                        _selected: null,
                        insertTemplates: null,
                        renderTemplates: null,
                        _visitedNodes: {},
                        readOnlyNodes: {},
                        hiddenFields: {},
                        modes: {},
                        __create: function (a,
                                            c, b) {
                            this.container = a;
                            this.options = c || {};
                            this.json = b || {};
                            this.setMode(this.options.mode || "tree")
                        },
                        setMode: function (a) {
                            var c = this.container, b = l.extend({}, this.options), k, e;
                            b.mode = a;
                            try {
                                e = this.getName(), k = {}, this._create(c, b), this.setName(e), this.setData(k)
                            } catch (d) {
                                debugger;
                                this._onError(d)
                            }
                        },
                        _onError: function (a) {
                            this._emit("error", a)
                        },
                        onReloaded: function () {
                            this.insertTemplates = [];
                            this._createInsertTemplate("New Command", "blocks", "{test:2}", "commands", !0, !0)
                        },
                        _createInsertTemplate: function (a, c, b, k,
                                                         e, d) {
                            this.insertTemplates.push({
                                label: a,
                                path: c,
                                value: b,
                                newNodeTemplate: k,
                                collapse: e,
                                select: d
                            })
                        },
                        getItemActions: function () {
                            var c = this, b = [], e = a.ACTION_VISIBILITY, d = function (d) {
                                var h = k.create(d.label, "fa-magic", "Edit/Insert " + d.label, !1, null, a.ITEM_TYPE.TEXT, "insertAction", null, !1, function () {
                                    c.insert(d.value, d.path, d.newNodeTemplate, d.collapse)
                                }, {}).setVisibility(e.ACTION_TOOLBAR, {label: "", widgetArgs: {style: "float:right"}});
                                b.push(h)
                            };
                            this.insertTemplates && (b.push(k.createDefault("New", "fa-magic", "Edit/Insert",
                                "insertAction", null, {dummy: !0}).setVisibility(e.ACTION_TOOLBAR, {label: ""}).setVisibility(e.CONTEXT_MENU, null)), b[0]._on(e.ACTION_TOOLBAR + "_WIDGET_CREATED", function (a) {
                                a.widget.placeAt(c.menu, "last")
                            }), _.each(this.insertTemplates, function (a) {
                                d(a)
                            }, this));
                            return b
                        },
                        insert: function (a, b, k, e, d) {
                            d = this.getData() || {};
                            var h = c.getAt(d, b);
                            h || (k = c.fromJson(k) || [], h = c.ensureAt(d, b, k));
                            null != h && (_.isArray(h) ? h.push(c.fromJson(a)) : c.setAt(h, b, c.fromJson(a)));
                            e && this.preserveExpandState && (this._expanded[b] = !0);
                            this.setData(d)
                        },
                        getDefaultOptions: function () {
                            var a = this;
                            return {
                                editable: function (c) {
                                    return 0 == a._emit("setEditable", c) ? !1 : !(c.path.join(".")in a.readOnlyNodes)
                                }
                            }
                        },
                        onAction: function (a) {
                            var b = a.params.node, k = b.path().join("."), e = a.action;
                            this._emit("on" + c.capitalize(a.action), {node: b, params: a.params});
                            switch (a.action) {
                                case "editValue":
                                case "editField":
                                case "removeNode":
                                    b = b.parent ? b.parent : b;
                                    if (this.getRenderTemplates(b.path()))this.onRenderNode(b, !0, a.params.newValue);
                                    break;
                                case "collapse":
                                case "expand":
                                    this._expanded["" +
                                    k] = "expand" == e
                            }
                        },
                        _matches: function (a, c) {
                        },
                        getRenderTemplates: function (a) {
                            function c(a, b) {
                                return "function" === typeof b && !0 === b(a) || b.test && b.test(a) || b === a
                            }

                            for (var b = [], k = this.renderTemplates, e = 0; e < k.length; e++) {
                                var d = k[e], h = d.match;
                                if (_.isArray(h))for (var g = 0; g < h.length; g++)h[g].test(a), c(a, h[g]) && b.push(d); else c(a, h) && b.push(d)
                            }
                            return b
                        },
                        onRenderNode: function (a, b, k) {
                            if (this.renderTemplates) {
                                var e = a.path().join("."), d = "_" + this.id;
                                this._visitedNodes[e] = a;
                                a[d] = !0;
                                if (d = a.dom) {
                                    var h = this.getRenderTemplates(e);
                                    if (h)for (var g = 0; g < h.length; g++) {
                                        var f = h[g], q = c.getAt(d, f.nodeValuePath, null) || "";
                                        1 == b && (c.setAt(d, f.nodeValuePath, ""), q = k || "");
                                        f.nodeValueTransform && (q = f.nodeValueTransform(q));
                                        var m = c.getAt(this.data, e, {}), q = {nodeValue: q}, n;
                                        for (n in m)q[n] = m[n];
                                        if (f.variables)for (n in f.variables)q[n] = f.variables[n];
                                        m = c.replace(f.replaceWith, null, q, {begin: "{", end: "}"});
                                        c.setAt(d, f.nodeValuePath, m)
                                    }
                                }
                                this.preserveExpandState && !0 === this._expanded["" + e] && a.expand(!1)
                            }
                        },
                        onAddNode: function (a) {
                            return !0
                        },
                        startup: function () {
                            this.inherited(arguments);
                            var a = this.options || {}, b = this;
                            g.mixin(a, this.getDefaultOptions());
                            g.mixin(this, a);
                            this._on("renderNode", function (a) {
                                b.onRenderNode(a)
                            });
                            this._on("onAction", function (a) {
                                b.onAction(a)
                            });
                            this._on("event", function (a) {
                            });
                            this._visitedNodes = {};
                            this._expanded = {};
                            this.renderTemplates = [{
                                nodeValuePath: "field.innerHTML",
                                match: [/^variables[\s]?\.(\d+)$/, /^blocks[\s]?\.(\d+)$/],
                                replaceWith: "{nodeValue} - {title}",
                                variables: null,
                                nodeValueTransform: function (a) {
                                    return c.capitalize(a)
                                },
                                insertIfMatch: {}
                            }];
                            this.__create(this.domNode,
                                a, this.data);
                            this.initReload()
                        }
                    })
                })
        }, "JSONEditor/TreeMode": function () {
            define("dojo/_base/declare ./util ./Highlighter ./History ./SearchBox ./Node".split(" "), function (p, g, l, f, b, d) {
                return p("xide.json.TreeMode", null, {
                    focusNode: void 0, domFocus: null, _create: function (a, c) {
                        if (!a)throw Error("No container element provided.");
                        this.container = a;
                        this.dom = {};
                        this.highlighter = new l;
                        this.selection = void 0;
                        this._setOptions(c);
                        this.options.history && "view" !== this.options.mode && (this.history = new f(this));
                        this._createFrame();
                        this._createTable()
                    }, _delete: function () {
                        this.frame && this.container && this.frame.parentNode == this.container && this.container.removeChild(this.frame)
                    }, _setOptions: function (a) {
                        this.options = {search: !0, history: !0, mode: "tree", name: void 0};
                        if (a)for (var c in a)a.hasOwnProperty(c) && (this.options[c] = a[c])
                    }, setData: function (a, c) {
                        this.data = a;
                        this._setsData = !0;
                        c && (g.log('Warning: second parameter "name" is deprecated. Use setName(name) instead.'), this.options.name = c);
                        if (a instanceof Function || void 0 === a)this.clear();
                        else {
                            this.content.removeChild(this.table);
                            var b = new d(this, {field: this.options.name, value: a});
                            this._setRoot(b);
                            this.node.expand(!1);
                            this.content.appendChild(this.table)
                        }
                        this.history && this.history.clear();
                        this._setsData = !1
                    }, getData: function () {
                        this.focusNode && this.focusNode.blur();
                        if (this.node)return this.node.getValue()
                    }, getText: function () {
                        return JSON.stringify(this.get())
                    }, setText: function (a) {
                        this.set(g.parse(a))
                    }, setName: function (a) {
                        this.options.name = a;
                        this.node && this.node.updateField(this.options.name)
                    },
                    getName: function () {
                        return this.options.name
                    }, focus: function () {
                        var a = this.content.querySelector("[contenteditable\x3dtrue]");
                        a ? a.focus() : this.node.dom.expand ? this.node.dom.expand.focus() : this.node.dom.menu ? this.node.dom.menu.focus() : (a = this.frame.querySelector("button")) && a.focus()
                    }, clear: function () {
                        this.node && (this.node.collapse(null, !0), this.tbody.removeChild(this.node.getDom()), delete this.node)
                    }, _setRoot: function (a) {
                        this.clear();
                        this.node = a;
                        this.tbody.appendChild(a.getDom())
                    }, search: function (a) {
                        this.node ?
                            (this.content.removeChild(this.table), a = this.node.search(a), this.content.appendChild(this.table)) : a = [];
                        return a
                    }, expandAll: function () {
                        this.node && (this.content.removeChild(this.table), this.node.expand(), this.content.appendChild(this.table))
                    }, collapseAll: function () {
                        this.node && (this.content.removeChild(this.table), this.node.collapse(), this.content.appendChild(this.table))
                    }, _onAction: function (a, c) {
                        this.history && this.history.add(a, c);
                        if (this.options.change)try {
                            this.options.change()
                        } catch (b) {
                            g.log("Error in change callback: ",
                                b)
                        }
                        this._emit("onAction", {action: a, params: c});
                        this.onAction({action: a, params: c})
                    }, startAutoScroll: function (a) {
                        var c = this, b = this.content, e = g.getAbsoluteTop(b), d = b.clientHeight, f = e + d;
                        (this.autoScrollStep = a < e + 24 && 0 < b.scrollTop ? (e + 24 - a) / 3 : a > f - 24 && d + b.scrollTop < b.scrollHeight ? (f - 24 - a) / 3 : void 0) ? this.autoScrollTimer || (this.autoScrollTimer = setInterval(function () {
                            c.autoScrollStep ? b.scrollTop -= c.autoScrollStep : c.stopAutoScroll()
                        }, 50)) : this.stopAutoScroll()
                    }, stopAutoScroll: function () {
                        this.autoScrollTimer &&
                        (clearTimeout(this.autoScrollTimer), delete this.autoScrollTimer);
                        this.autoScrollStep && delete this.autoScrollStep
                    }, setSelection: function (a) {
                        a && ("scrollTop"in a && this.content && (this.content.scrollTop = a.scrollTop), a.range && g.setSelectionOffset(a.range), a.dom && a.dom.focus())
                    }, getSelection: function () {
                        return {
                            dom: this.domFocus,
                            scrollTop: this.content ? this.content.scrollTop : 0,
                            range: g.getSelectionOffset()
                        }
                    }, scrollTo: function (a, c) {
                        var b = this.content;
                        if (b) {
                            var e = this;
                            e.animateTimeout && (clearTimeout(e.animateTimeout),
                                delete e.animateTimeout);
                            e.animateCallback && (e.animateCallback(!1), delete e.animateCallback);
                            var d = b.clientHeight, g = b.scrollHeight - d, f = Math.min(Math.max(a - d / 4, 0), g), m = function () {
                                var a = f - b.scrollTop;
                                3 < Math.abs(a) ? (b.scrollTop += a / 3, e.animateCallback = c, e.animateTimeout = setTimeout(m, 50)) : (c && c(!0), b.scrollTop = f, delete e.animateTimeout, delete e.animateCallback)
                            };
                            m()
                        } else c && c(!1)
                    }, _createFrame: function () {
                        function a(a) {
                            c._onEvent(a);
                            c._emit("event", a)
                        }

                        this.frame = document.createElement("div");
                        this.frame.className =
                            "jsoneditor";
                        this.container.appendChild(this.frame);
                        var c = this;
                        this.frame.onclick = function (c) {
                            var b = c.target;
                            a(c);
                            "BUTTON" == b.nodeName && c.preventDefault()
                        };
                        this.frame.oninput = a;
                        this.frame.onchange = a;
                        this.frame.onkeydown = a;
                        this.frame.onkeyup = a;
                        this.frame.oncut = a;
                        this.frame.onpaste = a;
                        this.frame.onmousedown = a;
                        this.frame.onmouseup = a;
                        this.frame.onmouseover = a;
                        this.frame.onmouseout = a;
                        g.addEventListener(this.frame, "focus", a, !0);
                        g.addEventListener(this.frame, "blur", a, !0);
                        this.frame.onfocusin = a;
                        this.frame.onfocusout =
                            a;
                        this.menu = document.createElement("div");
                        this.menu.className = "ui-state-default dijitToolbar";
                        this.frame.appendChild(this.menu);
                        var k = document.createElement("span");
                        k.className = "fa-expand actionToolbarButtonElusive dijitButtonContents dijitButton dijitIcon";
                        k.title = "Expand all fields";
                        k.onclick = function () {
                            c.expandAll()
                        };
                        this.menu.appendChild(k);
                        k = document.createElement("span");
                        k.title = "Collapse all fields";
                        k.className = "fa-compress actionToolbarButtonElusive dijitButtonContents dijitButton dijitIcon";
                        k.onclick = function () {
                            c.collapseAll()
                        };
                        this.menu.appendChild(k);
                        if (this.history) {
                            var e = document.createElement("span");
                            e.className = "fa-undo actionToolbarButtonElusive dijitButtonContents dijitButton dijitIcon";
                            e.title = "Undo last action (Ctrl+Z)";
                            e.onclick = function () {
                                c._onUndo()
                            };
                            this.menu.appendChild(e);
                            this.dom.undo = e;
                            var d = document.createElement("span");
                            d.className = "fa-repeat actionToolbarButtonElusive dijitButtonContents dijitButton dijitIcon";
                            d.title = "Redo (Ctrl+Shift+Z)";
                            d.onclick = function () {
                                c._onRedo()
                            };
                            this.menu.appendChild(d);
                            this.dom.redo = d;
                            this.history.onChange = function () {
                                e.disabled = !c.history.canUndo();
                                d.disabled = !c.history.canRedo()
                            };
                            this.history.onChange()
                        }
                        this.options && this.options.modes && this.options.modes.length && (k = modeswitcher.create(this, this.options.modes, this.options.mode), this.menu.appendChild(k), this.dom.modeBox = k);
                        this.options.search && (this.searchBox = new b(this, this.menu))
                    }, _onUndo: function () {
                        this.history && (this.history.undo(), this.options.change && this.options.change())
                    }, _onRedo: function () {
                        this.history &&
                        (this.history.redo(), this.options.change && this.options.change())
                    }, _onEvent: function (a) {
                        var c = a.target;
                        "keydown" == a.type && this._onKeyDown(a);
                        "focus" == a.type && (this.domFocus = c);
                        if (c = d.getNodeFromTarget(c))c.onEvent(a)
                    }, _onKeyDown: function (a) {
                        var c = a.which || a.keyCode, b = a.ctrlKey, d = a.shiftKey, h = !1;
                        9 == c && setTimeout(function () {
                            g.selectContentEditable(this.domFocus)
                        }, 0);
                        if (this.searchBox)if (b && 70 == c)this.searchBox.dom.search.focus(), this.searchBox.dom.search.select(), h = !0; else if (114 == c || b && 71 == c)d ? this.searchBox.previous(!0) :
                            this.searchBox.next(!0), h = !0;
                        this.history && (b && !d && 90 == c ? (this._onUndo(), h = !0) : b && d && 90 == c && (this._onRedo(), h = !0));
                        h && (a.preventDefault(), a.stopPropagation())
                    }, _createTable: function () {
                        var a = document.createElement("div");
                        a.className = "outer";
                        this.contentOuter = a;
                        this.content = document.createElement("div");
                        this.content.className = "tree";
                        a.appendChild(this.content);
                        this.table = document.createElement("table");
                        this.table.className = "tree";
                        this.content.appendChild(this.table);
                        var c;
                        this.colgroupContent = document.createElement("colgroup");
                        "tree" === this.options.mode && (c = document.createElement("col"), c.width = "24px", this.colgroupContent.appendChild(c));
                        c = document.createElement("col");
                        c.width = "24px";
                        this.colgroupContent.appendChild(c);
                        c = document.createElement("col");
                        this.colgroupContent.appendChild(c);
                        this.table.appendChild(this.colgroupContent);
                        this.tbody = document.createElement("tbody");
                        this.table.appendChild(this.tbody);
                        this.frame.appendChild(a)
                    }
                })
            })
        }, "JSONEditor/Node": function () {
            define(["dojo/_base/declare", "./util", "./ContextMenu",
                "./appendNodeFactory"], function (p, g, l, f) {
                function b(a, c) {
                    this.editor = a;
                    this.dom = {};
                    this.expanded = !1;
                    c && c instanceof Object ? (this.setField(c.field, c.fieldEditable), this.setValue(c.value, c.type)) : (this.setField(""), this.setValue(null))
                }

                b.prototype._updateEditability = function () {
                    this.editable = {field: !0, value: !0};
                    if (this.editor && (this.editable.field = "tree" === this.editor.options.mode, this.editable.value = "view" !== this.editor.options.mode, "tree" === this.editor.options.mode && "function" === typeof this.editor.options.editable)) {
                        var a =
                            this.editor.options.editable({
                                field: this.field,
                                value: this.value,
                                path: this.path(),
                                node: this
                            });
                        "boolean" === typeof a ? (this.editable.field = a, this.editable.value = a) : ("boolean" === typeof a.field && (this.editable.field = a.field), "boolean" === typeof a.value && (this.editable.value = a.value))
                    }
                };
                b.prototype.path = function () {
                    for (var a = this, c = []; a;) {
                        var b = void 0 != a.field ? a.field : a.index;
                        void 0 !== b && c.unshift(b);
                        a = a.parent
                    }
                    return c
                };
                b.prototype.getPath = function () {
                    return this.path().join(".")
                };
                b.prototype.setParent = function (a) {
                    this.parent =
                        a
                };
                b.prototype.setField = function (a, c) {
                    this.field = a;
                    this.fieldEditable = !0 === c
                };
                b.prototype.getField = function () {
                    void 0 === this.field && this._getDomField();
                    return this.field
                };
                b.prototype.setValue = function (a, c) {
                    var k;
                    if (k = this.childs)for (; k.length;)this.removeChild(k[0]);
                    this.type = this._getType(a);
                    if (c && c != this.type)if ("string" == c && "auto" == this.type)this.type = c; else throw Error('Type mismatch: cannot cast value of type "' + this.type + ' to the specified type "' + c + '"');
                    if ("array" == this.type) {
                        this.childs = [];
                        for (var d = 0, h = a.length; d < h; d++)k = a[d], void 0 === k || k instanceof Function || (k = new b(this.editor, {value: k}), this.appendChild(k));
                        this.value = ""
                    } else if ("object" == this.type) {
                        this.childs = [];
                        for (d in a)a.hasOwnProperty(d) && (k = a[d], void 0 === k || k instanceof Function || !0 === this.editor.hiddenFields[d] || !1 === this.editor.onAddNode({
                            parent: this,
                            field: d,
                            value: k
                        }) || (k = new b(this.editor, {field: d, value: k}), this.appendChild(k)));
                        this.value = ""
                    } else this.childs = void 0, this.value = a
                };
                b.prototype.getValue = function () {
                    if ("array" ==
                        this.type) {
                        var a = [];
                        this.childs.forEach(function (c) {
                            a.push(c.getValue())
                        });
                        return a
                    }
                    if ("object" == this.type) {
                        var c = {};
                        this.childs.forEach(function (a) {
                            c[a.getField()] = a.getValue()
                        });
                        return c
                    }
                    void 0 === this.value && this._getDomValue();
                    return this.value
                };
                b.prototype.getLevel = function () {
                    return this.parent ? this.parent.getLevel() + 1 : 0
                };
                b.prototype.clone = function () {
                    var a = new b(this.editor);
                    a.type = this.type;
                    a.field = this.field;
                    a.fieldInnerText = this.fieldInnerText;
                    a.fieldEditable = this.fieldEditable;
                    a.value = this.value;
                    a.valueInnerText = this.valueInnerText;
                    a.expanded = this.expanded;
                    if (this.childs) {
                        var c = [];
                        this.childs.forEach(function (b) {
                            b = b.clone();
                            b.setParent(a);
                            c.push(b)
                        });
                        a.childs = c
                    } else a.childs = void 0;
                    return a
                };
                b.prototype.expand = function (a) {
                    this.childs && (this.expanded = !0, this.dom.expand && (this.dom.expand.className = "expanded"), this.showChilds(), !1 !== a && this.childs.forEach(function (c) {
                        c.expand(a)
                    }), this.editor.onAction({action: "expand", params: {node: this, parent: this.parent}}))
                };
                b.prototype.collapse = function (a,
                                                 c) {
                    if (this.childs && (this.hideChilds(), !1 !== a && this.childs.forEach(function (b) {
                            b.collapse(a, c)
                        }), this.dom.expand && (this.dom.expand.className = "collapsed"), this.expanded = !1, !0 !== c))this.editor.onAction({
                        action: "collapse",
                        params: {node: this, parent: this.parent}
                    })
                };
                b.prototype.showChilds = function () {
                    if (this.childs && this.expanded) {
                        var a = this.dom.tr, c = a ? a.parentNode : void 0;
                        if (c) {
                            var b = this.getAppend();
                            (a = a.nextSibling) ? c.insertBefore(b, a) : c.appendChild(b);
                            this.childs.forEach(function (a) {
                                c.insertBefore(a.getDom(),
                                    b);
                                a.showChilds()
                            })
                        }
                    }
                };
                b.prototype.hide = function () {
                    var a = this.dom.tr, c = a ? a.parentNode : void 0;
                    c && c.removeChild(a);
                    this.hideChilds()
                };
                b.prototype.hideChilds = function () {
                    if (this.childs && this.expanded) {
                        var a = this.getAppend();
                        a.parentNode && a.parentNode.removeChild(a);
                        this.childs.forEach(function (a) {
                            a.hide()
                        })
                    }
                };
                b.prototype.appendChild = function (a) {
                    if (this._hasChilds()) {
                        a.setParent(this);
                        a.fieldEditable = "object" == this.type;
                        "array" == this.type && (a.index = this.childs.length);
                        this.childs.push(a);
                        if (this.expanded) {
                            var c =
                                a.getDom(), b = this.getAppend(), d = b ? b.parentNode : void 0;
                            b && d && d.insertBefore(c, b);
                            a.showChilds()
                        }
                        this.updateDom({updateIndexes: !0});
                        a.updateDom({recurse: !0})
                    }
                };
                b.prototype.moveBefore = function (a, c) {
                    if (this._hasChilds()) {
                        var b = this.dom.tr ? this.dom.tr.parentNode : void 0;
                        if (b) {
                            var e = document.createElement("tr");
                            e.style.height = b.clientHeight + "px";
                            b.appendChild(e)
                        }
                        a.parent && a.parent.removeChild(a);
                        c instanceof d ? this.appendChild(a) : this.insertBefore(a, c);
                        b && b.removeChild(e)
                    }
                };
                b.prototype.moveTo = function (a,
                                               c) {
                    a.parent == this && this.childs.indexOf(a) < c && c++;
                    this.moveBefore(a, this.childs[c] || this.append)
                };
                b.prototype.insertBefore = function (a, c) {
                    if (this._hasChilds()) {
                        if (c == this.append)a.setParent(this), a.fieldEditable = "object" == this.type, this.childs.push(a); else {
                            var b = this.childs.indexOf(c);
                            if (-1 == b)throw Error("Node not found");
                            a.setParent(this);
                            a.fieldEditable = "object" == this.type;
                            this.childs.splice(b, 0, a)
                        }
                        if (this.expanded) {
                            var b = a.getDom(), d = c.getDom(), h = d ? d.parentNode : void 0;
                            d && h && h.insertBefore(b, d);
                            a.showChilds()
                        }
                        this.updateDom({updateIndexes: !0});
                        a.updateDom({recurse: !0})
                    }
                };
                b.prototype.insertAfter = function (a, c) {
                    if (this._hasChilds()) {
                        var b = this.childs.indexOf(c);
                        (b = this.childs[b + 1]) ? this.insertBefore(a, b) : this.appendChild(a)
                    }
                };
                b.prototype.search = function (a) {
                    var c = [], b, d = a ? a.toLowerCase() : void 0;
                    delete this.searchField;
                    delete this.searchValue;
                    void 0 != this.field && (b = String(this.field).toLowerCase().indexOf(d), -1 != b && (this.searchField = !0, c.push({
                        node: this,
                        elem: "field"
                    })), this._updateDomField());
                    if (this._hasChilds()) {
                        if (this.childs) {
                            var h = [];
                            this.childs.forEach(function (c) {
                                h = h.concat(c.search(a))
                            });
                            c = c.concat(h)
                        }
                        void 0 != d && (0 == h.length ? this.collapse(!1) : this.expand(!1))
                    } else void 0 != this.value && (b = String(this.value).toLowerCase().indexOf(d), -1 != b && (this.searchValue = !0, c.push({
                        node: this,
                        elem: "value"
                    }))), this._updateDomValue();
                    return c
                };
                b.prototype.scrollTo = function (a) {
                    if (!this.dom.tr || !this.dom.tr.parentNode)for (var c = this.parent; c;)c.expand(!1), c = c.parent;
                    this.dom.tr && this.dom.tr.parentNode &&
                    this.editor.scrollTo(this.dom.tr.offsetTop, a)
                };
                b.focusElement = void 0;
                b.prototype.focus = function (a) {
                    b.focusElement = a;
                    if (this.dom.tr && this.dom.tr.parentNode) {
                        var c = this.dom;
                        switch (a) {
                            case "drag":
                                c.drag ? c.drag.focus() : c.menu.focus();
                                break;
                            case "menu":
                                c.menu.focus();
                                break;
                            case "expand":
                                this._hasChilds() ? c.expand.focus() : c.field && this.fieldEditable ? (c.field.focus(), g.selectContentEditable(c.field)) : c.value && !this._hasChilds() ? (c.value.focus(), g.selectContentEditable(c.value)) : c.menu.focus();
                                break;
                            case "field":
                                c.field &&
                                this.fieldEditable ? (c.field.focus(), g.selectContentEditable(c.field)) : c.value && !this._hasChilds() ? (c.value.focus(), g.selectContentEditable(c.value)) : this._hasChilds() ? c.expand.focus() : c.menu.focus();
                                break;
                            default:
                                c.value && !this._hasChilds() ? (c.value.focus(), g.selectContentEditable(c.value)) : c.field && this.fieldEditable ? (c.field.focus(), g.selectContentEditable(c.field)) : this._hasChilds() ? c.expand.focus() : c.menu.focus()
                        }
                    }
                };
                b.select = function (a) {
                    setTimeout(function () {
                        g.selectContentEditable(a)
                    }, 0)
                };
                b.prototype.blur =
                    function () {
                        this._getDomValue(!1);
                        this._getDomField(!1)
                    };
                b.prototype._duplicate = function (a) {
                    var c = a.clone();
                    this.insertAfter(c, a);
                    return c
                };
                b.prototype.containsNode = function (a) {
                    if (this == a)return !0;
                    var c = this.childs;
                    if (c)for (var b = 0, d = c.length; b < d; b++)if (c[b].containsNode(a))return !0;
                    return !1
                };
                b.prototype._move = function (a, c) {
                    if (a != c) {
                        if (a.containsNode(this))throw Error("Cannot move a field into a child of itself");
                        a.parent && a.parent.removeChild(a);
                        var b = a.clone();
                        a.clearDom();
                        c ? this.insertBefore(b,
                            c) : this.appendChild(b)
                    }
                };
                b.prototype.removeChild = function (a) {
                    if (this.childs) {
                        var c = this.childs.indexOf(a);
                        if (-1 != c)return a.hide(), delete a.searchField, delete a.searchValue, a = this.childs.splice(c, 1)[0], this.updateDom({updateIndexes: !0}), a
                    }
                };
                b.prototype._remove = function (a) {
                    this.removeChild(a)
                };
                b.prototype.changeType = function (a) {
                    var c = this.type;
                    if (c != a) {
                        if ("string" != a && "auto" != a || "string" != c && "auto" != c) {
                            var b = this.dom.tr ? this.dom.tr.parentNode : void 0, d;
                            d = (d = this.expanded ? this.getAppend() : this.getDom()) &&
                            d.parentNode ? d.nextSibling : void 0;
                            this.hide();
                            this.clearDom();
                            this.type = a;
                            if ("object" == a) {
                                if (this.childs || (this.childs = []), this.childs.forEach(function (a, c) {
                                        a.clearDom();
                                        delete a.index;
                                        a.fieldEditable = !0;
                                        void 0 == a.field && (a.field = "")
                                    }), "string" == c || "auto" == c)this.expanded = !0
                            } else if ("array" == a) {
                                if (this.childs || (this.childs = []), this.childs.forEach(function (a, c) {
                                        a.clearDom();
                                        a.fieldEditable = !1;
                                        a.index = c
                                    }), "string" == c || "auto" == c)this.expanded = !0
                            } else this.expanded = !1;
                            b && (d ? b.insertBefore(this.getDom(),
                                d) : b.appendChild(this.getDom()));
                            this.showChilds()
                        } else this.type = a;
                        if ("auto" == a || "string" == a)this.value = "string" == a ? String(this.value) : this._stringCast(String(this.value)), this.focus();
                        this.updateDom({updateIndexes: !0})
                    }
                };
                b.prototype._getDomValue = function (a) {
                    this.dom.value && "array" != this.type && "object" != this.type && (this.valueInnerText = g.getInnerText(this.dom.value));
                    if (void 0 != this.valueInnerText)try {
                        var c;
                        if ("string" == this.type)c = this._unescapeHTML(this.valueInnerText); else {
                            var b = this._unescapeHTML(this.valueInnerText);
                            c = this._stringCast(b)
                        }
                        if (c !== this.value) {
                            var d = this.value;
                            this.value = c;
                            this.editor._onAction("editValue", {
                                node: this,
                                oldValue: d,
                                newValue: c,
                                oldSelection: this.editor.selection,
                                newSelection: this.editor.getSelection()
                            })
                        }
                    } catch (h) {
                        if (this.value = void 0, !0 !== a)throw h;
                    }
                };
                b.prototype._updateDomValue = function () {
                    var a = this.dom.value;
                    if (a) {
                        var c = this.value, b = "auto" == this.type ? g.type(c) : this.type, d = "string" == b && g.isUrl(c), h = "", h = d && !this.editable.value ? "" : "string" == b ? "green" : "number" == b ? "red" : "boolean" == b ? "darkorange" :
                            this._hasChilds() ? "" : null === c ? "#004ED0" : "black";
                        a.style.color = h;
                        "" == String(this.value) && "array" != this.type && "object" != this.type ? g.addClassName(a, "empty") : g.removeClassName(a, "empty");
                        d ? g.addClassName(a, "url") : g.removeClassName(a, "url");
                        "array" == b || "object" == b ? a.title = this.type + " containing " + (this.childs ? this.childs.length : 0) + " items" : "string" == b && g.isUrl(c) ? this.editable.value && (a.title = "Ctrl+Click or Ctrl+Enter to open url in new window") : a.title = "";
                        this.searchValueActive ? g.addClassName(a, "highlight-active") :
                            g.removeClassName(a, "highlight-active");
                        this.searchValue ? g.addClassName(a, "highlight") : g.removeClassName(a, "highlight");
                        g.stripFormatting(a)
                    }
                };
                b.prototype._updateDomField = function () {
                    var a = this.dom.field;
                    a && ("" == String(this.field) && "array" != this.parent.type ? g.addClassName(a, "empty") : g.removeClassName(a, "empty"), this.searchFieldActive ? g.addClassName(a, "highlight-active") : g.removeClassName(a, "highlight-active"), this.searchField ? g.addClassName(a, "highlight") : g.removeClassName(a, "highlight"), g.stripFormatting(a))
                };
                b.prototype._getDomField = function (a) {
                    this.dom.field && this.fieldEditable && (this.fieldInnerText = g.getInnerText(this.dom.field));
                    if (void 0 != this.fieldInnerText)try {
                        var c = this._unescapeHTML(this.fieldInnerText);
                        if (c !== this.field) {
                            var b = this.field;
                            this.field = c;
                            this.editor._onAction("editField", {
                                node: this,
                                oldValue: b,
                                newValue: c,
                                oldSelection: this.editor.selection,
                                newSelection: this.editor.getSelection()
                            })
                        }
                    } catch (d) {
                        if (this.field = void 0, !0 !== a)throw d;
                    }
                };
                b.prototype.clearDom = function () {
                    this.dom = {}
                };
                b.prototype.getDom =
                    function () {
                        var a = this.dom;
                        if (a.tr)return a.tr;
                        this._updateEditability();
                        a.tr = document.createElement("tr");
                        a.tr.node = this;
                        if ("tree" === this.editor.options.mode) {
                            var c = document.createElement("td");
                            if (this.editable.field && this.parent) {
                                var b = document.createElement("button");
                                a.drag = b;
                                b.className = "dragarea";
                                b.title = "Drag to move this field (Alt+Shift+Arrows)";
                                c.appendChild(b)
                            }
                            a.tr.appendChild(c);
                            c = document.createElement("td");
                            b = document.createElement("button");
                            a.menu = b;
                            b.className = "contextmenu";
                            b.title =
                                "Click to open the actions menu (Ctrl+M)";
                            c.appendChild(a.menu);
                            a.tr.appendChild(c)
                        }
                        c = document.createElement("td");
                        a.tr.appendChild(c);
                        a.tree = this._createDomTree();
                        c.appendChild(a.tree);
                        this.updateDom({updateIndexes: !0});
                        this.editor._emit("renderNode", this);
                        return a.tr
                    };
                b.prototype._onDragStart = function (a) {
                    var c = this;
                    this.mousemove || (this.mousemove = g.addEventListener(document, "mousemove", function (a) {
                        c._onDrag(a)
                    }));
                    this.mouseup || (this.mouseup = g.addEventListener(document, "mouseup", function (a) {
                        c._onDragEnd(a)
                    }));
                    this.editor.highlighter.lock();
                    this.drag = {
                        oldCursor: document.body.style.cursor,
                        startParent: this.parent,
                        startIndex: this.parent.childs.indexOf(this),
                        mouseX: a.pageX,
                        level: this.getLevel()
                    };
                    document.body.style.cursor = "move";
                    a.preventDefault()
                };
                b.prototype._onDrag = function (a) {
                    var c = a.pageY, k = a.pageX, e, h, f, n, m, l, p = !1;
                    e = this.dom.tr;
                    h = g.getAbsoluteTop(e);
                    n = e.offsetHeight;
                    if (c < h) {
                        h = e;
                        do h = h.previousSibling, m = b.getNodeFromTarget(h), l = h ? g.getAbsoluteTop(h) : 0; while (h && c < l);
                        m && !m.parent && (m = void 0);
                        m || (h = (e = e.parentNode.firstChild) ?
                            e.nextSibling : void 0, m = b.getNodeFromTarget(h), m == this && (m = void 0));
                        m && (l = (h = m.dom.tr) ? g.getAbsoluteTop(h) : 0, c > l + n && (m = void 0));
                        m && (m.parent.moveBefore(this, m), p = !0)
                    } else if (e = (n = this.expanded && this.append ? this.append.getDom() : this.dom.tr) ? n.nextSibling : void 0) {
                        l = g.getAbsoluteTop(e);
                        f = e;
                        do e = b.getNodeFromTarget(f), f && (m = f.nextSibling ? g.getAbsoluteTop(f.nextSibling) : 0, m = f ? m - l : 0, 1 == e.parent.childs.length && e.parent.childs[0] == this && (h += 23)), f = f.nextSibling; while (f && c > h + m);
                        if (e && e.parent) {
                            h = Math.round((k -
                            this.drag.mouseX) / 24 / 2);
                            l = this.drag.level + h;
                            f = e.getLevel();
                            for (h = e.dom.tr.previousSibling; f < l && h;) {
                                m = b.getNodeFromTarget(h);
                                if (m != this && !m._isChildOf(this))if (m instanceof d)if (m = m.parent.childs, 1 < m.length || 1 == m.length && m[0] != this)e = b.getNodeFromTarget(h), f = e.getLevel(); else break; else break;
                                h = h.previousSibling
                            }
                            n.nextSibling != e.dom.tr && (e.parent.moveBefore(this, e), p = !0)
                        }
                    }
                    p && (this.drag.mouseX = k, this.drag.level = this.getLevel());
                    this.editor.startAutoScroll(c);
                    a.preventDefault()
                };
                b.prototype._onDragEnd =
                    function (a) {
                        var c = {
                            node: this,
                            startParent: this.drag.startParent,
                            startIndex: this.drag.startIndex,
                            endParent: this.parent,
                            endIndex: this.parent.childs.indexOf(this)
                        };
                        c.startParent == c.endParent && c.startIndex == c.endIndex || this.editor._onAction("moveNode", c);
                        document.body.style.cursor = this.drag.oldCursor;
                        this.editor.highlighter.unlock();
                        delete this.drag;
                        this.mousemove && (g.removeEventListener(document, "mousemove", this.mousemove), delete this.mousemove);
                        this.mouseup && (g.removeEventListener(document, "mouseup",
                            this.mouseup), delete this.mouseup);
                        this.editor.stopAutoScroll();
                        a.preventDefault()
                    };
                b.prototype._isChildOf = function (a) {
                    for (var c = this.parent; c;) {
                        if (c == a)return !0;
                        c = c.parent
                    }
                    return !1
                };
                b.prototype._createDomField = function () {
                    return document.createElement("div")
                };
                b.prototype.setHighlight = function (a) {
                    this.dom.tr && (this.dom.tr.className = a ? "highlight" : "", this.append && this.append.setHighlight(a), this.childs && this.childs.forEach(function (c) {
                        c.setHighlight(a)
                    }))
                };
                b.prototype.updateValue = function (a) {
                    this.value =
                        a;
                    this.updateDom()
                };
                b.prototype.updateField = function (a) {
                    this.field = a;
                    this.updateDom()
                };
                b.prototype.updateDom = function (a) {
                    var c = this.dom.tree;
                    c && (c.style.marginLeft = 24 * this.getLevel() + "px");
                    if (c = this.dom.field) {
                        this.fieldEditable ? (c.contentEditable = this.editable.field, c.spellcheck = !1, c.className = "field") : c.className = "readonly";
                        var b;
                        b = void 0 != this.index ? this.index : void 0 != this.field ? this.field : this._hasChilds() ? this.type : "";
                        c.innerHTML = this._escapeHTML(b)
                    }
                    if (c = this.dom.value)b = this.childs ? this.childs.length :
                        0, c.innerHTML = "array" == this.type ? "[" + b + "]" : "object" == this.type ? "{" + b + "}" : this._escapeHTML(this.value);
                    this._updateDomField();
                    this._updateDomValue();
                    a && !0 === a.updateIndexes && this._updateDomIndexes();
                    a && !0 === a.recurse && this.childs && this.childs.forEach(function (c) {
                        c.updateDom(a)
                    });
                    this.append && this.append.updateDom()
                };
                b.prototype._updateDomIndexes = function () {
                    var a = this.childs;
                    this.dom.value && a && ("array" == this.type ? a.forEach(function (a, b) {
                        a.index = b;
                        var d = a.dom.field;
                        d && (d.innerHTML = b)
                    }) : "object" == this.type &&
                    a.forEach(function (a) {
                        void 0 != a.index && (delete a.index, void 0 == a.field && (a.field = ""))
                    }))
                };
                b.prototype._createDomValue = function () {
                    var a;
                    "array" == this.type ? (a = document.createElement("div"), a.className = "readonly", a.innerHTML = "[...]") : "object" == this.type ? (a = document.createElement("div"), a.className = "readonly", a.innerHTML = "{...}") : (!this.editable.value && g.isUrl(this.value) ? (a = document.createElement("a"), a.className = "value", a.href = this.value, a.target = "_blank") : (a = document.createElement("div"), a.contentEditable =
                        this.editable.value, a.spellcheck = !1, a.className = "value"), a.innerHTML = this._escapeHTML(this.value));
                    return a
                };
                b.prototype._createDomExpandButton = function () {
                    var a = document.createElement("button");
                    this._hasChilds() ? (a.className = this.expanded ? "expanded" : "collapsed", a.title = "Click to expand/collapse this field (Ctrl+E). \nCtrl+Click to expand/collapse including all childs.") : (a.className = "invisible", a.title = "");
                    return a
                };
                b.prototype._createDomTree = function () {
                    var a = this.dom, c = document.createElement("table"),
                        b = document.createElement("tbody");
                    c.style.borderCollapse = "collapse";
                    c.className = "values";
                    c.appendChild(b);
                    var d = document.createElement("tr");
                    b.appendChild(d);
                    b = document.createElement("td");
                    b.className = "tree";
                    d.appendChild(b);
                    a.expand = this._createDomExpandButton();
                    b.appendChild(a.expand);
                    a.tdExpand = b;
                    b = document.createElement("td");
                    b.className = "tree";
                    d.appendChild(b);
                    a.field = this._createDomField();
                    b.appendChild(a.field);
                    a.tdField = b;
                    b = document.createElement("td");
                    b.className = "tree";
                    d.appendChild(b);
                    "object" != this.type && "array" != this.type && (b.appendChild(document.createTextNode(":")), b.className = "separator");
                    a.tdSeparator = b;
                    b = document.createElement("td");
                    b.className = "tree";
                    d.appendChild(b);
                    a.value = this._createDomValue();
                    b.appendChild(a.value);
                    a.tdValue = b;
                    return c
                };
                b.prototype.onEvent = function (a) {
                    var b = a.type, d = a.target || a.srcElement, e = this.dom, h = this, f = this._hasChilds();
                    if (d == e.drag || d == e.menu)"mouseover" == b ? this.editor.highlighter.highlight(this) : "mouseout" == b && this.editor.highlighter.unhighlight();
                    "mousedown" == b && d == e.drag && this._onDragStart(a);
                    if ("click" == b && d == e.menu) {
                        var n = h.editor.highlighter;
                        n.highlight(h);
                        n.lock();
                        g.addClassName(e.menu, "selected");
                        this.showContextMenu(e.menu, function () {
                            g.removeClassName(e.menu, "selected");
                            n.unlock();
                            n.unhighlight()
                        })
                    }
                    "click" == b && d == e.expand && f && this._onExpand(a.ctrlKey);
                    var m = e.value;
                    if (d == m)switch (b) {
                        case "blur":
                        case "change":
                            this._getDomValue(!0);
                            this._updateDomValue();
                            this.value && (m.innerHTML = this._escapeHTML(this.value));
                            break;
                        case "input":
                            this._getDomValue(!0);
                            this._updateDomValue();
                            break;
                        case "keydown":
                        case "mousedown":
                            this.editor.selection = this.editor.getSelection();
                            break;
                        case "click":
                            (a.ctrlKey || !this.editable.value) && g.isUrl(this.value) && window.open(this.value, "_blank");
                            break;
                        case "keyup":
                            this._getDomValue(!0);
                            this._updateDomValue();
                            break;
                        case "cut":
                        case "paste":
                            setTimeout(function () {
                                h._getDomValue(!0);
                                h._updateDomValue()
                            }, 1)
                    }
                    var l = e.field;
                    if (d == l)switch (b) {
                        case "blur":
                        case "change":
                            this._getDomField(!0);
                            this._updateDomField();
                            this.field && (l.innerHTML =
                                this._escapeHTML(this.field));
                            break;
                        case "input":
                            this._getDomField(!0);
                            this._updateDomField();
                            break;
                        case "keydown":
                        case "mousedown":
                            this.editor.selection = this.editor.getSelection();
                            break;
                        case "keyup":
                            this._getDomField(!0);
                            this._updateDomField();
                            break;
                        case "cut":
                        case "paste":
                            setTimeout(function () {
                                h._getDomField(!0);
                                h._updateDomField()
                            }, 1)
                    }
                    if (d == e.tree.parentNode)switch (b) {
                        case "click":
                            (void 0 != a.offsetX ? a.offsetX < 24 * (this.getLevel() + 1) : a.pageX < g.getAbsoluteLeft(e.tdSeparator)) || f ? l && (g.setEndOfContentEditable(l),
                                l.focus()) : m && (g.setEndOfContentEditable(m), m.focus())
                    }
                    if (d == e.tdExpand && !f || d == e.tdField || d == e.tdSeparator)switch (b) {
                        case "click":
                            l && (g.setEndOfContentEditable(l), l.focus())
                    }
                    if ("keydown" == b)this.onKeyDown(a)
                };
                b.prototype.onKeyDown = function (a) {
                    var c = a.which || a.keyCode, k = a.target || a.srcElement, e = a.ctrlKey, h = a.shiftKey, f = a.altKey, n = !1, m = "tree" === this.editor.options.mode;
                    13 == c ? k == this.dom.value ? this.editable.value && !a.ctrlKey || !g.isUrl(this.value) || (window.open(this.value, "_blank"), n = !0) : k == this.dom.expand &&
                    this._hasChilds() && (this._onExpand(a.ctrlKey), k.focus(), n = !0) : 68 == c ? e && m && (this._onDuplicate(), n = !0) : 69 == c ? e && (this._onExpand(h), k.focus(), n = !0) : 77 == c && m ? e && (this.showContextMenu(k), n = !0) : 46 == c && m ? e && (this._onRemove(), n = !0) : 45 == c && m ? e && !h ? (this._onInsertBefore(), n = !0) : e && h && (this._onInsertAfter(), n = !0) : 35 == c ? f && ((n = this._lastNode()) && n.focus(b.focusElement || this._getElementName(k)), n = !0) : 36 == c ? f && ((n = this._firstNode()) && n.focus(b.focusElement || this._getElementName(k)), n = !0) : 37 == c ? f && !h ? ((k = this._previousElement(k)) &&
                    this.focus(this._getElementName(k)), n = !0) : f && h && m && (this.expanded ? e = (c = this.getAppend()) ? c.nextSibling : void 0 : (c = this.getDom(), e = c.nextSibling), e && (c = b.getNodeFromTarget(e), e = e.nextSibling, e = b.getNodeFromTarget(e), c && c instanceof d && 1 != this.parent.childs.length && e && e.parent && (e.parent.moveBefore(this, e), this.focus(b.focusElement || this._getElementName(k))))) : 38 == c ? f && !h ? ((c = this._previousNode()) && c.focus(b.focusElement || this._getElementName(k)), n = !0) : f && h && ((c = this._previousNode()) && c.parent && (c.parent.moveBefore(this,
                        c), this.focus(b.focusElement || this._getElementName(k))), n = !0) : 39 == c ? f && !h ? ((k = this._nextElement(k)) && this.focus(this._getElementName(k)), n = !0) : f && h && (c = this.getDom(), (c = c.previousSibling) && (c = b.getNodeFromTarget(c)) && c.parent && c instanceof d && !c.isVisible() && (c.parent.moveBefore(this, c), this.focus(b.focusElement || this._getElementName(k)))) : 40 == c && (f && !h ? ((c = this._nextNode()) && c.focus(b.focusElement || this._getElementName(k)), n = !0) : f && h && m && (e = (c = this.expanded ? this.append ? this.append._nextNode() : void 0 :
                        this._nextNode()) ? c.getDom() : void 0, e = 1 == this.parent.childs.length ? e : e ? e.nextSibling : void 0, (e = b.getNodeFromTarget(e)) && e.parent && (e.parent.moveBefore(this, e), this.focus(b.focusElement || this._getElementName(k))), n = !0));
                    n && (a.preventDefault(), a.stopPropagation())
                };
                b.prototype._onExpand = function (a) {
                    if (a) {
                        var b = this.dom.tr.parentNode, d = b.parentNode, e = d.scrollTop;
                        d.removeChild(b)
                    }
                    this.expanded ? this.collapse(a) : this.expand(a);
                    a && (d.appendChild(b), d.scrollTop = e)
                };
                b.prototype._onRemove = function () {
                    this.editor.highlighter.unhighlight();
                    var a = this.parent.childs, b = a.indexOf(this), d = this.editor.getSelection();
                    a[b + 1] ? a[b + 1].focus() : a[b - 1] ? a[b - 1].focus() : this.parent.focus();
                    a = this.editor.getSelection();
                    this.parent._remove(this);
                    this.editor._onAction("removeNode", {
                        node: this,
                        parent: this.parent,
                        index: b,
                        oldSelection: d,
                        newSelection: a
                    })
                };
                b.prototype._onDuplicate = function () {
                    var a = this.editor.getSelection(), b = this.parent._duplicate(this);
                    b.focus();
                    var d = this.editor.getSelection();
                    this.editor._onAction("duplicateNode", {
                        node: this, clone: b, parent: this.parent,
                        oldSelection: a, newSelection: d
                    })
                };
                b.prototype._onInsertBefore = function (a, c, d) {
                    var e = this.editor.getSelection();
                    a = new b(this.editor, {field: void 0 != a ? a : "", value: void 0 != c ? c : "", type: d});
                    a.expand(!0);
                    this.parent.insertBefore(a, this);
                    this.editor.highlighter.unhighlight();
                    a.focus("field");
                    c = this.editor.getSelection();
                    this.editor._onAction("insertBeforeNode", {
                        node: a,
                        beforeNode: this,
                        parent: this.parent,
                        oldSelection: e,
                        newSelection: c
                    })
                };
                b.prototype._onInsertAfter = function (a, c, d) {
                    var e = this.editor.getSelection();
                    a = new b(this.editor, {field: void 0 != a ? a : "", value: void 0 != c ? c : "", type: d});
                    a.expand(!0);
                    this.parent.insertAfter(a, this);
                    this.editor.highlighter.unhighlight();
                    a.focus("field");
                    c = this.editor.getSelection();
                    this.editor._onAction("insertAfterNode", {
                        node: a,
                        afterNode: this,
                        parent: this.parent,
                        oldSelection: e,
                        newSelection: c
                    })
                };
                b.prototype._onAppend = function (a, c, d) {
                    var e = this.editor.getSelection();
                    a = new b(this.editor, {field: void 0 != a ? a : "", value: void 0 != c ? c : "", type: d});
                    a.expand(!0);
                    this.parent.appendChild(a);
                    this.editor.highlighter.unhighlight();
                    a.focus("field");
                    c = this.editor.getSelection();
                    this.editor._onAction("appendNode", {
                        node: a,
                        parent: this.parent,
                        oldSelection: e,
                        newSelection: c
                    })
                };
                b.prototype._onChangeType = function (a) {
                    var b = this.type;
                    if (a != b) {
                        var d = this.editor.getSelection();
                        this.changeType(a);
                        var e = this.editor.getSelection();
                        this.editor._onAction("changeType", {
                            node: this,
                            oldType: b,
                            newType: a,
                            oldSelection: d,
                            newSelection: e
                        })
                    }
                };
                b.prototype._onSort = function (a) {
                    if (this._hasChilds()) {
                        var b = "desc" == a ? -1 : 1, d = "array" == this.type ? "value" : "field";
                        this.hideChilds();
                        a = this.childs;
                        var e = this.sort;
                        this.childs = this.childs.concat();
                        this.childs.sort(function (a, e) {
                            return a[d] > e[d] ? b : a[d] < e[d] ? -b : 0
                        });
                        this.sort = 1 == b ? "asc" : "desc";
                        this.editor._onAction("sort", {
                            node: this,
                            oldChilds: a,
                            oldSort: e,
                            newChilds: this.childs,
                            newSort: this.sort
                        });
                        this.showChilds()
                    }
                };
                b.prototype.getAppend = function () {
                    this.append || (this.append = new d(this.editor), this.append.setParent(this));
                    return this.append.getDom()
                };
                b.getNodeFromTarget = function (a) {
                    for (; a;) {
                        if (a.node)return a.node;
                        a = a.parentNode
                    }
                };
                b.prototype._previousNode = function () {
                    var a = null, c = this.getDom();
                    if (c && c.parentNode) {
                        do c = c.previousSibling, a = b.getNodeFromTarget(c); while (c && a instanceof d && !a.isVisible())
                    }
                    return a
                };
                b.prototype._nextNode = function () {
                    var a = null, c = this.getDom();
                    if (c && c.parentNode) {
                        do c = c.nextSibling, a = b.getNodeFromTarget(c); while (c && a instanceof d && !a.isVisible())
                    }
                    return a
                };
                b.prototype._firstNode = function () {
                    var a = null, c = this.getDom();
                    c && c.parentNode && (a = b.getNodeFromTarget(c.parentNode.firstChild));
                    return a
                };
                b.prototype._lastNode = function () {
                    var a = null, c = this.getDom();
                    if (c && c.parentNode)for (c = c.parentNode.lastChild, a = b.getNodeFromTarget(c); c && a instanceof d && !a.isVisible();)c = c.previousSibling, a = b.getNodeFromTarget(c);
                    return a
                };
                b.prototype._previousElement = function (a) {
                    var b = this.dom;
                    switch (a) {
                        case b.value:
                            if (this.fieldEditable)return b.field;
                        case b.field:
                            if (this._hasChilds())return b.expand;
                        case b.expand:
                            return b.menu;
                        case b.menu:
                            if (b.drag)return b.drag;
                        default:
                            return null
                    }
                };
                b.prototype._nextElement =
                    function (a) {
                        var b = this.dom;
                        switch (a) {
                            case b.drag:
                                return b.menu;
                            case b.menu:
                                if (this._hasChilds())return b.expand;
                            case b.expand:
                                if (this.fieldEditable)return b.field;
                            case b.field:
                                if (!this._hasChilds())return b.value;
                            default:
                                return null
                        }
                    };
                b.prototype._getElementName = function (a) {
                    var b = this.dom, d;
                    for (d in b)if (b.hasOwnProperty(d) && b[d] == a)return d;
                    return null
                };
                b.prototype._hasChilds = function () {
                    return "array" == this.type || "object" == this.type
                };
                b.TYPE_TITLES = {
                    auto: 'Field type "auto". The field type is automatically determined from the value and can be a string, number, boolean, or null.',
                    object: 'Field type "object". An object contains an unordered set of key/value pairs.',
                    array: 'Field type "array". An array contains an ordered collection of values.',
                    string: 'Field type "string". Field type is not determined from the value, but always returned as string.'
                };
                b.prototype.showContextMenu = function (a, c) {
                    var d = this, e = b.TYPE_TITLES, h = [];
                    this.editable.value && h.push({
                        text: "Type",
                        title: "Change the type of this field",
                        className: "type-" + this.type,
                        submenu: [{
                            text: "Auto", className: "type-auto" + ("auto" ==
                            this.type ? " selected" : ""), title: e.auto, click: function () {
                                d._onChangeType("auto")
                            }
                        }, {
                            text: "Array",
                            className: "type-array" + ("array" == this.type ? " selected" : ""),
                            title: e.array,
                            click: function () {
                                d._onChangeType("array")
                            }
                        }, {
                            text: "Object",
                            className: "type-object" + ("object" == this.type ? " selected" : ""),
                            title: e.object,
                            click: function () {
                                d._onChangeType("object")
                            }
                        }, {
                            text: "String",
                            className: "type-string" + ("string" == this.type ? " selected" : ""),
                            title: e.string,
                            click: function () {
                                d._onChangeType("string")
                            }
                        }]
                    });
                    if (this._hasChilds()) {
                        var f =
                            "asc" == this.sort ? "desc" : "asc";
                        h.push({
                            text: "Sort",
                            title: "Sort the childs of this " + this.type,
                            className: "sort-" + f,
                            click: function () {
                                d._onSort(f)
                            },
                            submenu: [{
                                text: "Ascending",
                                className: "sort-asc",
                                title: "Sort the childs of this " + this.type + " in ascending order",
                                click: function () {
                                    d._onSort("asc")
                                }
                            }, {
                                text: "Descending",
                                className: "sort-desc",
                                title: "Sort the childs of this " + this.type + " in descending order",
                                click: function () {
                                    d._onSort("desc")
                                }
                            }]
                        })
                    }
                    if (this.parent && this.parent._hasChilds()) {
                        h.length && h.push({type: "separator"});
                        var g = d.parent.childs;
                        d == g[g.length - 1] && h.push({
                            text: "Append",
                            title: "Append a new field with type 'auto' after this field (Ctrl+Shift+Ins)",
                            submenuTitle: "Select the type of the field to be appended",
                            className: "append",
                            click: function () {
                                d._onAppend("", "", "auto")
                            },
                            submenu: [{
                                text: "Auto", className: "type-auto", title: e.auto, click: function () {
                                    d._onAppend("", "", "auto")
                                }
                            }, {
                                text: "Array", className: "type-array", title: e.array, click: function () {
                                    d._onAppend("", [])
                                }
                            }, {
                                text: "Object", className: "type-object", title: e.object,
                                click: function () {
                                    d._onAppend("", {})
                                }
                            }, {
                                text: "String", className: "type-string", title: e.string, click: function () {
                                    d._onAppend("", "", "string")
                                }
                            }]
                        });
                        h.push({
                            text: "Insert",
                            title: "Insert a new field with type 'auto' before this field (Ctrl+Ins)",
                            submenuTitle: "Select the type of the field to be inserted",
                            className: "insert",
                            click: function () {
                                d._onInsertBefore("", "", "auto")
                            },
                            submenu: [{
                                text: "Auto", className: "type-auto", title: e.auto, click: function () {
                                    d._onInsertBefore("", "", "auto")
                                }
                            }, {
                                text: "Array", className: "type-array",
                                title: e.array, click: function () {
                                    d._onInsertBefore("", [])
                                }
                            }, {
                                text: "Object", className: "type-object", title: e.object, click: function () {
                                    d._onInsertBefore("", {})
                                }
                            }, {
                                text: "String", className: "type-string", title: e.string, click: function () {
                                    d._onInsertBefore("", "", "string")
                                }
                            }]
                        });
                        this.editable.field && (h.push({
                            text: "Duplicate",
                            title: "Duplicate this field (Ctrl+D)",
                            className: "duplicate",
                            click: function () {
                                d._onDuplicate()
                            }
                        }), h.push({
                            text: "Remove",
                            title: "Remove this field (Ctrl+Del)",
                            className: "remove",
                            click: function () {
                                d._onRemove()
                            }
                        }))
                    }
                    (new l(h,
                        {close: c})).show(a)
                };
                b.prototype._getType = function (a) {
                    return a instanceof Array ? "array" : a instanceof Object ? "object" : "string" == typeof a && "string" != typeof this._stringCast(a) ? "string" : "auto"
                };
                b.prototype._stringCast = function (a) {
                    var b = a.toLowerCase(), d = Number(a), e = parseFloat(a);
                    return "" == a ? "" : "null" == b ? null : "true" == b ? !0 : "false" == b ? !1 : isNaN(d) || isNaN(e) ? a : d
                };
                b.prototype._escapeHTML = function (a) {
                    a = String(a).replace(/</g, "\x26lt;").replace(/>/g, "\x26gt;").replace(/  /g, " \x26nbsp;").replace(/^ /, "\x26nbsp;").replace(/ $/,
                        "\x26nbsp;");
                    a = JSON.stringify(a);
                    return a.substring(1, a.length - 1)
                };
                b.prototype._unescapeHTML = function (a) {
                    a = '"' + this._escapeJSON(a) + '"';
                    return g.parse(a).replace(/&lt;/g, "\x3c").replace(/&gt;/g, "\x3e").replace(/&nbsp;|\u00A0/g, " ")
                };
                b.prototype._escapeJSON = function (a) {
                    for (var b = "", d = 0, e = a.length; d < e;) {
                        var h = a.charAt(d);
                        "\n" == h ? b += "\\n" : "\\" == h ? (b += h, d++, h = a.charAt(d), -1 == '"\\/bfnrtu'.indexOf(h) && (b += "\\"), b += h) : b = '"' == h ? b + '\\"' : b + h;
                        d++
                    }
                    return b
                };
                var d = f(b);
                return b
            })
        }, "JSONEditor/SearchBox": function () {
            define(["dojo/_base/declare",
                "./util"], function (p, g) {
                function l(f, b) {
                    var d = this;
                    this.editor = f;
                    this.timeout = void 0;
                    this.delay = 200;
                    this.lastText = void 0;
                    this.dom = {};
                    this.dom.container = b;
                    var a = document.createElement("table");
                    this.dom.table = a;
                    a.className = "search";
                    b.appendChild(a);
                    var c = document.createElement("tbody");
                    this.dom.tbody = c;
                    a.appendChild(c);
                    a = document.createElement("tr");
                    c.appendChild(a);
                    c = document.createElement("td");
                    a.appendChild(c);
                    var k = document.createElement("div");
                    this.dom.results = k;
                    k.className = "results";
                    c.appendChild(k);
                    c = document.createElement("td");
                    a.appendChild(c);
                    a = document.createElement("div");
                    this.dom.input = a;
                    a.className = "frame";
                    a.title = "Search fields and values";
                    c.appendChild(a);
                    c = document.createElement("table");
                    a.appendChild(c);
                    k = document.createElement("tbody");
                    c.appendChild(k);
                    a = document.createElement("tr");
                    k.appendChild(a);
                    k = document.createElement("button");
                    k.className = "refresh";
                    c = document.createElement("td");
                    c.appendChild(k);
                    a.appendChild(c);
                    var e = document.createElement("input");
                    this.dom.search = e;
                    e.oninput =
                        function (a) {
                            d._onDelayedSearch(a)
                        };
                    e.onchange = function (a) {
                        d._onSearch(a)
                    };
                    e.onkeydown = function (a) {
                        d._onKeyDown(a)
                    };
                    e.onkeyup = function (a) {
                        d._onKeyUp(a)
                    };
                    k.onclick = function (a) {
                        e.select()
                    };
                    c = document.createElement("td");
                    c.appendChild(e);
                    a.appendChild(c);
                    k = document.createElement("button");
                    k.title = "Next result (Enter)";
                    k.className = "next";
                    k.onclick = function () {
                        d.next()
                    };
                    c = document.createElement("td");
                    c.appendChild(k);
                    a.appendChild(c);
                    k = document.createElement("button");
                    k.title = "Previous result (Shift+Enter)";
                    k.className = "previous";
                    k.onclick = function () {
                        d.previous()
                    };
                    c = document.createElement("td");
                    c.appendChild(k);
                    a.appendChild(c)
                }

                l.prototype.next = function (f) {
                    if (void 0 != this.results) {
                        var b = void 0 != this.resultIndex ? this.resultIndex + 1 : 0;
                        b > this.results.length - 1 && (b = 0);
                        this._setActiveResult(b, f)
                    }
                };
                l.prototype.previous = function (f) {
                    if (void 0 != this.results) {
                        var b = this.results.length - 1, d = void 0 != this.resultIndex ? this.resultIndex - 1 : b;
                        0 > d && (d = b);
                        this._setActiveResult(d, f)
                    }
                };
                l.prototype._setActiveResult = function (f,
                                                         b) {
                    if (this.activeResult) {
                        var d = this.activeResult.node;
                        "field" == this.activeResult.elem ? delete d.searchFieldActive : delete d.searchValueActive;
                        d.updateDom()
                    }
                    if (this.results && this.results[f]) {
                        this.resultIndex = f;
                        var a = this.results[this.resultIndex].node, c = this.results[this.resultIndex].elem;
                        "field" == c ? a.searchFieldActive = !0 : a.searchValueActive = !0;
                        this.activeResult = this.results[this.resultIndex];
                        a.updateDom();
                        a.scrollTo(function () {
                            b && a.focus(c)
                        })
                    } else this.activeResult = this.resultIndex = void 0
                };
                l.prototype._clearDelay =
                    function () {
                        void 0 != this.timeout && (clearTimeout(this.timeout), delete this.timeout)
                    };
                l.prototype._onDelayedSearch = function (f) {
                    this._clearDelay();
                    var b = this;
                    this.timeout = setTimeout(function (d) {
                        b._onSearch(d)
                    }, this.delay)
                };
                l.prototype._onSearch = function (f, b) {
                    this._clearDelay();
                    var d = this.dom.search.value, d = 0 < d.length ? d : void 0;
                    if (d != this.lastText || b)if (this.lastText = d, this.results = this.editor.search(d), this._setActiveResult(void 0), void 0 != d)switch (d = this.results.length, d) {
                        case 0:
                            this.dom.results.innerHTML =
                                "no\x26nbsp;results";
                            break;
                        case 1:
                            this.dom.results.innerHTML = "1\x26nbsp;result";
                            break;
                        default:
                            this.dom.results.innerHTML = d + "\x26nbsp;results"
                    } else this.dom.results.innerHTML = ""
                };
                l.prototype._onKeyDown = function (f) {
                    var b = f.which;
                    27 == b ? (this.dom.search.value = "", this._onSearch(f), f.preventDefault(), f.stopPropagation()) : 13 == b && (f.ctrlKey ? this._onSearch(f, !0) : f.shiftKey ? this.previous() : this.next(), f.preventDefault(), f.stopPropagation())
                };
                l.prototype._onKeyUp = function (f) {
                    var b = f.keyCode;
                    27 != b && 13 != b && this._onDelayedSearch(f)
                };
                return l
            })
        }, "JSONEditor/util": function () {
            define(["module", "exports"], function (p) {
                var g = {
                    parse: function (b) {
                        try {
                            return JSON.parse(b)
                        } catch (d) {
                            throw g.validate(b), d;
                        }
                    }, sanitize: function (b) {
                        function d() {
                            return b.charAt(h)
                        }

                        function a() {
                            for (var a = h - 1; 0 <= a;) {
                                var c = b.charAt(a);
                                if ("{" === c)return !0;
                                if (" " === c || "\n" === c || "\r" === c)a--; else break
                            }
                            return !1
                        }

                        function c(a) {
                            e.push('"');
                            h++;
                            for (var c = d(); h < b.length && c !== a;)'"' === c && "\\" !== b.charAt(h - 1) && e.push("\\"), "\\" === c && (h++, c = d(), "'" !== c && e.push("\\")), e.push(c),
                                h++, c = d();
                            c === a && (e.push('"'), h++)
                        }

                        function k() {
                            for (var a = "", b = d(), c = /[a-zA-Z_$\d]/; c.test(b);)a += b, h++, b = d();
                            -1 === ["null", "true", "false"].indexOf(a) ? e.push('"' + a + '"') : e.push(a)
                        }

                        var e = [], h = 0, f = b.match(/^\s*(\/\*(.|[\r\n])*?\*\/)?\s*[\da-zA-Z_$]+\s*\(([\s\S]*)\)\s*;?\s*$/);
                        for (f && (b = f[3]); h < b.length;)if (f = d(), "/" === f && "*" === b.charAt(h + 1)) {
                            for (h += 2; h < b.length && ("*" !== d() || "/" !== b.charAt(h + 1));)h++;
                            h += 2
                        } else"'" === f || '"' === f ? c(f) : /[a-zA-Z_$]/.test(f) && a() ? k() : (e.push(f), h++);
                        return e.join("")
                    }, validate: function (b) {
                        "undefined" != typeof jsonlint ? jsonlint.parse(b) : JSON.parse(b)
                    }, extend: function (b, d) {
                        for (var a in d)d.hasOwnProperty(a) && (b[a] = d[a]);
                        return b
                    }, clear: function (b) {
                        for (var d in b)b.hasOwnProperty(d) && delete b[d];
                        return b
                    }, log: function (b) {
                        "undefined" !== typeof console && "function" === typeof console.log && console.log.apply(console, arguments)
                    }, type: function (b) {
                        return null === b ? "null" : void 0 === b ? "undefined" : b instanceof Number || "number" === typeof b ? "number" : b instanceof String || "string" === typeof b ? "string" : b instanceof Boolean ||
                        "boolean" === typeof b ? "boolean" : b instanceof RegExp || "regexp" === typeof b ? "regexp" : g.isArray(b) ? "array" : "object"
                    }
                }, l = /^https?:\/\/\S+$/;
                g.isUrl = function (b) {
                    return ("string" == typeof b || b instanceof String) && l.test(b)
                };
                g.isArray = function (b) {
                    return "[object Array]" === Object.prototype.toString.call(b)
                };
                g.getAbsoluteLeft = function (b) {
                    return b.getBoundingClientRect().left + window.pageXOffset || document.scrollLeft || 0
                };
                g.getAbsoluteTop = function (b) {
                    return b.getBoundingClientRect().top + window.pageYOffset || document.scrollTop ||
                    0
                };
                g.addClassName = function (b, d) {
                    var a = b.className.split(" ");
                    -1 == a.indexOf(d) && (a.push(d), b.className = a.join(" "))
                };
                g.removeClassName = function (b, d) {
                    var a = b.className.split(" "), c = a.indexOf(d);
                    -1 != c && (a.splice(c, 1), b.className = a.join(" "))
                };
                g.stripFormatting = function (b) {
                    b = b.childNodes;
                    for (var d = 0, a = b.length; d < a; d++) {
                        var c = b[d];
                        c.style && c.removeAttribute("style");
                        var k = c.attributes;
                        if (k)for (var e = k.length - 1; 0 <= e; e--) {
                            var f = k[e];
                            !0 === f.specified && c.removeAttribute(f.name)
                        }
                        g.stripFormatting(c)
                    }
                };
                g.setEndOfContentEditable =
                    function (b) {
                        var d;
                        document.createRange && (d = document.createRange(), d.selectNodeContents(b), d.collapse(!1), b = window.getSelection(), b.removeAllRanges(), b.addRange(d))
                    };
                g.selectContentEditable = function (b) {
                    if (b && "DIV" == b.nodeName) {
                        var d;
                        window.getSelection && document.createRange && (d = document.createRange(), d.selectNodeContents(b), b = window.getSelection(), b.removeAllRanges(), b.addRange(d))
                    }
                };
                g.getSelection = function () {
                    if (window.getSelection) {
                        var b = window.getSelection();
                        if (b.getRangeAt && b.rangeCount)return b.getRangeAt(0)
                    }
                    return null
                };
                g.setSelection = function (b) {
                    if (b && window.getSelection) {
                        var d = window.getSelection();
                        d.removeAllRanges();
                        d.addRange(b)
                    }
                };
                g.getSelectionOffset = function () {
                    var b = g.getSelection();
                    return b && "startOffset"in b && "endOffset"in b && b.startContainer && b.startContainer == b.endContainer ? {
                        startOffset: b.startOffset,
                        endOffset: b.endOffset,
                        container: b.startContainer.parentNode
                    } : null
                };
                g.setSelectionOffset = function (b) {
                    if (document.createRange && window.getSelection && window.getSelection()) {
                        var d = document.createRange();
                        d.setStart(b.container.firstChild,
                            b.startOffset);
                        d.setEnd(b.container.firstChild, b.endOffset);
                        g.setSelection(d)
                    }
                };
                g.getInnerText = function (b, d) {
                    void 0 == d && (d = {
                        text: "", flush: function () {
                            var a = this.text;
                            this.text = "";
                            return a
                        }, set: function (a) {
                            this.text = a
                        }
                    });
                    if (b.nodeValue)return d.flush() + b.nodeValue;
                    if (b.hasChildNodes()) {
                        for (var a = b.childNodes, c = "", f = 0, e = a.length; f < e; f++) {
                            var h = a[f];
                            if ("DIV" == h.nodeName || "P" == h.nodeName) {
                                var l = a[f - 1];
                                (l = l ? l.nodeName : void 0) && "DIV" != l && "P" != l && "BR" != l && (c += "\n", d.flush());
                                c += g.getInnerText(h, d);
                                d.set("\n")
                            } else"BR" ==
                            h.nodeName ? (c += d.flush(), d.set("\n")) : c += g.getInnerText(h, d)
                        }
                        return c
                    }
                    return "P" == b.nodeName && -1 != g.getInternetExplorerVersion() ? d.flush() : ""
                };
                g.getInternetExplorerVersion = function () {
                    if (-1 == f) {
                        var b = -1;
                        "Microsoft Internet Explorer" == navigator.appName && null != /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent) && (b = parseFloat(RegExp.$1));
                        f = b
                    }
                    return f
                };
                g.isFirefox = function () {
                    return -1 != navigator.userAgent.indexOf("Firefox")
                };
                var f = -1;
                g.addEventListener = function (b, d, a, c) {
                    if (b.addEventListener)return void 0 ===
                    c && (c = !1), "mousewheel" === d && g.isFirefox() && (d = "DOMMouseScroll"), b.addEventListener(d, a, c), a;
                    if (b.attachEvent)return c = function () {
                        return a.call(b, window.event)
                    }, b.attachEvent("on" + d, c), c
                };
                g.removeEventListener = function (b, d, a, c) {
                    b.removeEventListener ? (void 0 === c && (c = !1), "mousewheel" === d && g.isFirefox() && (d = "DOMMouseScroll"), b.removeEventListener(d, a, c)) : b.detachEvent && b.detachEvent("on" + d, a)
                };
                return g
            })
        }, "JSONEditor/run": function () {
            require({
                packages: [{
                    name: "JSONEditor", location: "../../../plugins/JSONEditor/client/xfile/",
                    packageMap: {}
                }], cache: {}
            }, ["JSONEditor"])
        }, "JSONEditor/JSONEditorManager": function () {
            define("dojo/_base/declare xide/utils xide/types xide/factory xide/manager/ManagerBase xide/layout/ContentPane xide/views/SplitEditor ./JSONEditor".split(" "), function (p, g, l, f, b, d, a, c) {
                return p("JSONEditor.JSONEditorManager", [b], {
                    mainView: null,
                    ctx: null,
                    config: null,
                    panelManager: null,
                    fileManager: null,
                    currentItem: null,
                    didRegister: !1,
                    getMainView: function () {
                        return this.mainView || this.panelManager.rootView
                    },
                    onItemSelected: function (a) {
                        a &&
                        a.item && a.item._S && (this.currentItem = a.item)
                    },
                    registerEditor: function () {
                        this.didRegister || (this.didRegister = !0, this.ctx.registerEditorExtension("JSON Editor", "json", "fa-code", this, !1, null, a, {
                            updateOnSelection: !1,
                            leftLayoutContainer: this.ctx.mainView.leftLayoutContainer,
                            ctx: this.ctx
                        }, {
                            createLeftView: function (a, b, d) {
                                a = f.createPane("", "", a, {}, null);
                                var l = a.editor = g.addWidget(c, {}, this, a.containerNode, !0);
                                a.getItemActions = function () {
                                    return l.getItemActions()
                                };
                                a.setValue = function (a) {
                                    a = dojo.fromJson(a);
                                    l.setData(a)
                                };
                                a.getValue = function () {
                                    return JSON.stringify(l.getData(), null, 2)
                                };
                                return a
                            }, createRightView: function (a, b, c) {
                                a = this.ctx.getScriptManager().onFileClicked(c, a, {
                                    region: "bottom",
                                    splitter: !0,
                                    style: "height:40%;padding:0px;overflow:hidden;",
                                    emits: {onViewShow: !1, onItemSelected: !1},
                                    autoSelect: !1
                                }, !1);
                                var d = this;
                                a._on("setFirstContent", function (a) {
                                    d.setLeftValue(a.value)
                                });
                                return a
                            }, startup: function () {
                                this.inherited(arguments)
                            }
                        }))
                    },
                    _registerListeners: function () {
                        this.inherited(arguments);
                        this.subscribe([l.EVENTS.ITEM_SELECTED,
                            l.EVENTS.ON_MAIN_VIEW_READY])
                    },
                    _constructor: function () {
                        this.id = g.createUUID();
                        this._registerListeners()
                    },
                    init: function () {
                        try {
                            this.registerEditor()
                        } catch (a) {
                            console.error("error in json-editor : " + a, a)
                        }
                    }
                })
            })
        }, "JSONEditor/Highlighter": function () {
            define(["dojo/_base/declare", "./util"], function (p, g) {
                function l() {
                    this.locked = !1
                }

                l.prototype.highlight = function (f) {
                    this.locked || (this.node != f && (this.node && this.node.setHighlight(!1), this.node = f, this.node.setHighlight(!0)), this._cancelUnhighlight())
                };
                l.prototype.unhighlight =
                    function () {
                        if (!this.locked) {
                            var f = this;
                            this.node && (this._cancelUnhighlight(), this.unhighlightTimer = setTimeout(function () {
                                f.node.setHighlight(!1);
                                f.node = void 0;
                                f.unhighlightTimer = void 0
                            }, 0))
                        }
                    };
                l.prototype._cancelUnhighlight = function () {
                    this.unhighlightTimer && (clearTimeout(this.unhighlightTimer), this.unhighlightTimer = void 0)
                };
                l.prototype.lock = function () {
                    this.locked = !0
                };
                l.prototype.unlock = function () {
                    this.locked = !1
                };
                return l
            })
        }, "JSONEditor/appendNodeFactory": function () {
            define(["dojo/_base/declare", "./util",
                "./ContextMenu"], function (p, g, l) {
                return function (f) {
                    function b(b) {
                        this.editor = b;
                        this.dom = {}
                    }

                    b.prototype = new f;
                    b.prototype.getDom = function () {
                        var b = this.dom;
                        if (b.tr)return b.tr;
                        this._updateEditability();
                        var a = document.createElement("tr");
                        a.node = this;
                        b.tr = a;
                        if (this.editable.field) {
                            b.tdDrag = document.createElement("td");
                            var c = document.createElement("td");
                            b.tdMenu = c;
                            var f = document.createElement("button");
                            f.className = "contextmenu";
                            f.title = "Click to open the actions menu (Ctrl+M)";
                            b.menu = f;
                            c.appendChild(b.menu)
                        }
                        c =
                            document.createElement("td");
                        f = document.createElement("div");
                        f.innerHTML = "(empty)";
                        f.className = "readonly";
                        c.appendChild(f);
                        b.td = c;
                        b.text = f;
                        this.updateDom();
                        return a
                    };
                    b.prototype.updateDom = function () {
                        var b = this.dom, a = b.td;
                        a && (a.style.paddingLeft = 24 * this.getLevel() + 26 + "px");
                        var c = b.text;
                        c && (c.innerHTML = "(empty " + this.parent.type + ")");
                        c = b.tr;
                        this.isVisible() ? b.tr.firstChild || (b.tdDrag && c.appendChild(b.tdDrag), b.tdMenu && c.appendChild(b.tdMenu), c.appendChild(a)) : b.tr.firstChild && (b.tdDrag && c.removeChild(b.tdDrag),
                        b.tdMenu && c.removeChild(b.tdMenu), c.removeChild(a))
                    };
                    b.prototype.isVisible = function () {
                        return 0 == this.parent.childs.length
                    };
                    b.prototype.showContextMenu = function (b, a) {
                        var c = this, g = f.TYPE_TITLES;
                        (new l([{
                            text: "Append",
                            title: "Append a new field with type 'auto' (Ctrl+Shift+Ins)",
                            submenuTitle: "Select the type of the field to be appended",
                            className: "insert",
                            click: function () {
                                c._onAppend("", "", "auto")
                            },
                            submenu: [{
                                text: "Auto", className: "type-auto", title: g.auto, click: function () {
                                    c._onAppend("", "", "auto")
                                }
                            }, {
                                text: "Array",
                                className: "type-array", title: g.array, click: function () {
                                    c._onAppend("", [])
                                }
                            }, {
                                text: "Object", className: "type-object", title: g.object, click: function () {
                                    c._onAppend("", {})
                                }
                            }, {
                                text: "String", className: "type-string", title: g.string, click: function () {
                                    c._onAppend("", "", "string")
                                }
                            }]
                        }], {close: a})).show(b)
                    };
                    b.prototype.onEvent = function (b) {
                        var a = b.type, c = b.target || b.srcElement, f = this.dom;
                        c == f.menu && ("mouseover" == a ? this.editor.highlighter.highlight(this.parent) : "mouseout" == a && this.editor.highlighter.unhighlight());
                        if ("click" == a && c == f.menu) {
                            var e = this.editor.highlighter;
                            e.highlight(this.parent);
                            e.lock();
                            g.addClassName(f.menu, "selected");
                            this.showContextMenu(f.menu, function () {
                                g.removeClassName(f.menu, "selected");
                                e.unlock();
                                e.unhighlight()
                            })
                        }
                        if ("keydown" == a)this.onKeyDown(b)
                    };
                    return b
                }
            })
        }, "JSONEditor/ContextMenu": function () {
            define(["dojo/_base/declare", "./util"], function (p, g) {
                function l(f, b) {
                    function d(b, c, e) {
                        e.forEach(function (e) {
                            if ("separator" == e.type) {
                                var f = document.createElement("div");
                                f.className = "separator";
                                k = document.createElement("li");
                                k.appendChild(f);
                                b.appendChild(k)
                            } else {
                                var g = {}, k = document.createElement("li");
                                b.appendChild(k);
                                f = document.createElement("button");
                                f.className = e.className;
                                g.button = f;
                                e.title && (f.title = e.title);
                                e.click && (f.onclick = function () {
                                    a.hide();
                                    e.click()
                                });
                                k.appendChild(f);
                                if (e.submenu) {
                                    var l = document.createElement("div");
                                    l.className = "icon";
                                    f.appendChild(l);
                                    f.appendChild(document.createTextNode(e.text));
                                    var n;
                                    e.click ? (f.className += " default", f = document.createElement("button"), g.buttonExpand =
                                        f, f.className = "expand", f.innerHTML = '\x3cdiv class\x3d"expand"\x3e\x3c/div\x3e', k.appendChild(f), e.submenuTitle && (f.title = e.submenuTitle)) : (l = document.createElement("div"), l.className = "expand", f.appendChild(l));
                                    n = f;
                                    n.onclick = function () {
                                        a._onExpandItem(g);
                                        n.focus()
                                    };
                                    f = [];
                                    g.subItems = f;
                                    l = document.createElement("ul");
                                    g.ul = l;
                                    l.className = "menu";
                                    l.style.height = "0";
                                    k.appendChild(l);
                                    d(l, f, e.submenu)
                                } else f.innerHTML = '\x3cdiv class\x3d"icon"\x3e\x3c/div\x3e' + e.text;
                                c.push(g)
                            }
                        })
                    }

                    this.dom = {};
                    var a = this, c = this.dom;
                    this.anchor = void 0;
                    this.items = f;
                    this.eventListeners = {};
                    this.visibleSubmenu = this.selection = void 0;
                    this.onClose = b ? b.close : void 0;
                    var g = document.createElement("div");
                    g.className = "jsoneditor-contextmenu";
                    c.menu = g;
                    var e = document.createElement("ul");
                    e.className = "menu";
                    g.appendChild(e);
                    c.list = e;
                    c.items = [];
                    g = document.createElement("button");
                    c.focusButton = g;
                    c = document.createElement("li");
                    c.style.overflow = "hidden";
                    c.style.height = "0";
                    c.appendChild(g);
                    e.appendChild(c);
                    d(e, this.dom.items, f);
                    this.maxHeight = 0;
                    f.forEach(function (b) {
                        a.maxHeight =
                            Math.max(a.maxHeight, 24 * (f.length + (b.submenu ? b.submenu.length : 0)))
                    })
                }

                l.prototype._getVisibleButtons = function () {
                    var f = [], b = this;
                    this.dom.items.forEach(function (d) {
                        f.push(d.button);
                        d.buttonExpand && f.push(d.buttonExpand);
                        d.subItems && d == b.expandedItem && d.subItems.forEach(function (a) {
                            f.push(a.button);
                            a.buttonExpand && f.push(a.buttonExpand)
                        })
                    });
                    return f
                };
                l.visibleMenu = void 0;
                l.prototype.show = function (f) {
                    this.hide();
                    var b = window.innerHeight, d = b + (window.pageYOffset || document.scrollTop || 0), a = f.offsetHeight,
                        c = this.maxHeight, k = g.getAbsoluteLeft(f), e = g.getAbsoluteTop(f);
                    e + a + c < d ? (this.dom.menu.style.left = k + "px", this.dom.menu.style.top = e + a + "px", this.dom.menu.style.bottom = "") : (this.dom.menu.style.left = k + "px", this.dom.menu.style.top = "", this.dom.menu.style.bottom = b - e + "px");
                    document.body.appendChild(this.dom.menu);
                    var h = this, p = this.dom.list;
                    this.eventListeners.mousedown = g.addEventListener(document, "mousedown", function (a) {
                        var b = a.target;
                        b == p || h._isChildOf(b, p) || (h.hide(), a.stopPropagation(), a.preventDefault())
                    });
                    this.eventListeners.mousewheel = g.addEventListener(document, "mousewheel", function (a) {
                        a.stopPropagation();
                        a.preventDefault()
                    });
                    this.eventListeners.keydown = g.addEventListener(document, "keydown", function (a) {
                        h._onKeyDown(a)
                    });
                    this.selection = g.getSelection();
                    this.anchor = f;
                    setTimeout(function () {
                        h.dom.focusButton.focus()
                    }, 0);
                    l.visibleMenu && l.visibleMenu.hide();
                    l.visibleMenu = this
                };
                l.prototype.hide = function () {
                    if (this.dom.menu.parentNode && (this.dom.menu.parentNode.removeChild(this.dom.menu), this.onClose))this.onClose();
                    for (var f in this.eventListeners)if (this.eventListeners.hasOwnProperty(f)) {
                        var b = this.eventListeners[f];
                        b && g.removeEventListener(document, f, b);
                        delete this.eventListeners[f]
                    }
                    l.visibleMenu == this && (l.visibleMenu = void 0)
                };
                l.prototype._onExpandItem = function (f) {
                    var b = this, d = f == this.expandedItem, a = this.expandedItem;
                    a && (a.ul.style.height = "0", a.ul.style.padding = "", setTimeout(function () {
                        b.expandedItem != a && (a.ul.style.display = "", g.removeClassName(a.ul.parentNode, "selected"))
                    }, 300), this.expandedItem = void 0);
                    if (!d) {
                        var c = f.ul;
                        c.style.display = "block";
                        setTimeout(function () {
                            b.expandedItem == f && (c.style.height = 24 * c.childNodes.length + "px", c.style.padding = "5px 10px")
                        }, 0);
                        g.addClassName(c.parentNode, "selected");
                        this.expandedItem = f
                    }
                };
                l.prototype._onKeyDown = function (f) {
                    var b = f.target, d = f.which, a = !1;
                    27 == d ? (this.selection && g.setSelection(this.selection), this.anchor && this.anchor.focus(), this.hide(), a = !0) : 9 == d ? f.shiftKey ? (d = this._getVisibleButtons(), b = d.indexOf(b), 0 == b && (d[d.length - 1].focus(), a = !0)) : (d = this._getVisibleButtons(),
                        b = d.indexOf(b), b == d.length - 1 && (d[0].focus(), a = !0)) : 37 == d ? ("expand" == b.className && (d = this._getVisibleButtons(), b = d.indexOf(b), (a = d[b - 1]) && a.focus()), a = !0) : 38 == d ? (d = this._getVisibleButtons(), b = d.indexOf(b), (a = d[b - 1]) && "expand" == a.className && (a = d[b - 2]), a || (a = d[d.length - 1]), a && a.focus(), a = !0) : 39 == d ? (d = this._getVisibleButtons(), b = d.indexOf(b), (a = d[b + 1]) && "expand" == a.className && a.focus(), a = !0) : 40 == d && (d = this._getVisibleButtons(), b = d.indexOf(b), (a = d[b + 1]) && "expand" == a.className && (a = d[b + 2]), a || (a = d[0]), a &&
                    a.focus(), a = !0);
                    a && (f.stopPropagation(), f.preventDefault())
                };
                l.prototype._isChildOf = function (f, b) {
                    for (var d = f.parentNode; d;) {
                        if (d == b)return !0;
                        d = d.parentNode
                    }
                    return !1
                };
                return l
            })
        }
    }
});
define("JSONEditor/main", ["dojo/_base/lang", "dojo/_base/declare", "./JSONEditorManager", "xide/types", "xide/model/Component"], function (p, g, l, f, b) {
    return g([b], {
        run: function () {
            var b = this.inherited(arguments);
            this.subscribe(f.EVENTS.ON_PLUGIN_READY, function (a) {
                if ("JSONEditor" === a.name) {
                    var b = {};
                    p.mixin(b, a);
                    (new l(b)).init()
                }
            });
            this.publish(f.EVENTS.ON_PLUGIN_LOADED, {name: "JSONEditor"});
            return b
        }
    })
});
//# sourceMappingURL=main.js.map
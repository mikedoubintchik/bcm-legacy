(function() {
    function Ba(a) {
        switch (a) {
            case "'":
                return "\x26#39;";
            case "\x26":
                return "\x26amp;";
            case "\x3c":
                return "\x26lt;";
            case "\x3e":
                return "\x26gt;";
            case '"':
                return "\x26quot;";
            case "\u00a9":
                return "\x26copy;";
            case "\u2028":
                return "\x3cbr\x3e";
            case "\u2029":
                return "\x3cp\x3e";
            default:
                return a
        }
    }

    function l() {}

    function t() {}

    function la(a) {
        l.prototype.init.call(this, a, l.TYPE.STANDARD)
    }

    function ma(a) {
        k[a] || (k[a] = new la(a));
        return k[a]
    }

    function S(a, b) {
        l.prototype.init.call(this, b + "_" + a, l.TYPE.AGENT)
    }

    function L(a,
        b) {
        var c = b + "_" + a;
        if (!k[c]) {
            var e = new S(a, b),
                d;
            k[a] && (d = k[a], d.endpoint && e.setEndpoint(d.endpoint), d.prechat && e.setPrechat(d.prechat), d.language && e.setLanguage(d.language), e.setOnlineState(d.onlineState));
            k[c] = e
        }
        return k[c]
    }

    function T(a, b) {
        t.prototype.init.call(this, a, b)
    }

    function U(a, b) {
        t.prototype.init.call(this, a, b)
    }

    function n(a) {
        l.prototype.init.call(this, a, l.TYPE.INVITE);
        this.active = !1;
        this.filterLogic = null;
        this.rules = {};
        this.autoRejectTimeout = this.inviteTimeout = this.inviteDelay = this.ruleTree =
            null
    }

    function u(a) {
        k[a] || (k[a] = new n(a));
        return k[a]
    }

    function A(a, b, c, e, d, g, C, y) {
        t.prototype.init.call(this, a, b);
        this.hasInviteAfterAccept = g;
        this.hasInviteAfterReject = C;
        this.rejectTime = y;
        null !== f.getCssAnimation(b) || "Custom" == c ? this.renderer = new n.RENDERER[c].renderClass(a, b, n.START_POSITION[e], n.END_POSITION[d]) : this.renderer = new n.RENDERER.Appear.renderClass(a, b, n.START_POSITION[e], n.END_POSITION[d])
    }

    function D(a) {
        return u(a) ? u(a).getTracker() : null
    }

    function r() {}

    function J(a, b, c, e) {
        r.prototype.init.call(this,
            a, b, c, e)
    }

    function K(a, b, c, e) {
        r.prototype.init.call(this, a, b, null, e)
    }

    function M(a, b, c, e) {
        r.prototype.init.call(this, a, b, null, e)
    }

    function E(a, b, c, e) {
        E.prototype.init.call(this, a, b, null, null)
    }

    function h() {}

    function N(a, b, c, e, d) {
        h.prototype.init.call(this, a, b, c, e, d)
    }

    function O(a, b, c, e, d) {
        h.prototype.init.call(this, a, b, c, e, d)
    }

    function V(a, b, c, e, d) {
        h.prototype.init.call(this, a, b, c, e, d)
    }

    function F(a) {
        na++;
        if (1E3 < na) throw Error("Error processing rule filter logic, preventing recursion");
        for (var b = 0, c = 0, e =
                0; e < a.length; e++) "(" == a.charAt(e) ? c++ : ")" == a.charAt(e) && c--, "," == a.charAt(e) && 1 == c && (b = e);
        if (0 == a.indexOf("AND(")) return c = F(a.substring(4, b)), a = F(a.substring(b + 1, a.length - 1)), new W(c, a);
        if (0 == a.indexOf("OR(")) return c = F(a.substring(3, b)), a = F(a.substring(b + 1, a.length - 1)), new X(c, a);
        if (0 == a.indexOf("NOT(")) return c = F(a.substring(4, a.length - 1)), new Y(c);
        if (!isNaN(parseInt(a, 10))) return new Z(parseInt(a, 10));
        throw Error("Encountered unexpected character in filter logic");
    }

    function z() {}

    function Z(a) {
        this.ruleId =
            a;
        z.prototype.init.call(this, null, null)
    }

    function W(a, b) {
        z.prototype.init.call(this, a, b)
    }

    function X(a, b) {
        z.prototype.init.call(this, a, b)
    }

    function Y(a) {
        z.prototype.init.call(this, a, null)
    }

    function Ca(a, b, c, e) {
        var d = document.createElement("div");
        d.id = "liveagent_invite_button_" + a;
        var g = document.createElement("img");
        g.style.cursor = "pointer";
        g.style.position = "absolute";
        g.style.right = "-20px";
        g.style.top = "-20px";
        g.src = f.addPrefixToURL(m.contentServerUrl, m.urlPrefix, !0) + "/images/x.png";
        f.addEventListener(g,
            "click",
            function() {
                p.rejectChat(a)
            });
        d.appendChild(g);
        g = document.createElement("img");
        g.style.cursor = "pointer";
        g.style.clear = "right";
        g.src = b;
        g.width = c;
        g.height = e;
        f.addEventListener(g, "click", function() {
            p.startChat(a)
        });
        d.appendChild(g);
        document.body.appendChild(d);
        return d
    }

    function oa(a, b, c) {
        "undefined" == typeof c && (c = !0);
        this.getLabel = function() {
            return a
        };
        this.getValue = function() {
            return b
        };
        this.getDisplayToAgent = function() {
            return c
        };
        var e = new aa;
        this.getMapper = function() {
            return e
        };
        this.doKnowledgeSearch = !1;
        this.getDoKnowledgeSearch = function() {
            return this.doKnowledgeSearch
        };
        this.setDoKnowledgeSearch = function() {
            this.doKnowledgeSearch = !0
        }
    }

    function aa() {
        var a = [],
            b = [];
        this.getEntityMaps = function() {
            return a
        };
        this.getTranscriptFields = function() {
            return b
        }
    }

    function pa(a, b, c, e, d) {
        this.getEntityName = function() {
            return a
        };
        this.getFieldName = function() {
            return b
        };
        this.getFastFill = function() {
            return c
        };
        this.getAutoQuery = function() {
            return e
        };
        this.getExactMatch = function() {
            return d
        }
    }

    function qa(a) {
        this.saveToTranscript =
            "";
        this.showOnCreate = !1;
        this.linkToEntityField = this.linkToEntityName = "";
        var b = new ra;
        this.getEntityName = function() {
            return a
        };
        this.getSaveTranscript = function() {
            return this.saveTranscript
        };
        this.getShowOnCreate = function() {
            return this.showOnCreate
        };
        this.getLinkToEntityName = function() {
            return this.linkToEntityName
        };
        this.getLinkToEntityField = function() {
            return this.linkToEntityField
        };
        this.getEntityMapper = function() {
            return b
        };
        this.setSaveTranscript = function(a) {
            this.saveTranscript = a
        };
        this.setShowOnCreate = function(a) {
            this.showOnCreate =
                a
        };
        this.setLinkToEntityName = function(a) {
            this.linkToEntityName = a
        };
        this.setLinkToEntityField = function(a) {
            this.linkToEntityField = a
        }
    }

    function ra() {
        var a = [];
        this.getEntityFieldsMaps = function() {
            return a
        }
    }

    function sa(a, b, c, e, d) {
        this.getFieldName = function() {
            return a
        };
        this.getLabel = function() {
            return b
        };
        this.getDoFind = function() {
            return c
        };
        this.getIsExactMatch = function() {
            return e
        };
        this.getDoCreate = function() {
            return d
        }
    }

    function P() {
        if (!ta) {
            ta = !0;
            f.log("DOM is ready. Setting up environment.");
            null == v.getOref() &&
                v.setOref(document.referrer);
            null == v.getVisitCount() && v.setVisitCount(1);
            if (window._laq)
                for (var a = 0; a < window._laq.length; a++) window._laq[a].call(window);
            q.connection.setCallback("liveagent._.handlePing");
            ua()
        }
    }

    function ua() {
        var a = [],
            b = {};
        ba && (b.chatted = 1);
        x ? (b.sid = x, f.log("Reusing existing session.")) : (a.push(new q.Noun("VisitorId")), f.log("Requesting new session."));
        a.push(new q.Noun("Settings", {
            buttonIds: "[" + va() + "]",
            updateBreadcrumb: 1,
            urlPrefix: m.urlPrefix
        }));
        q.connection.send(a, b)
    }

    function wa(a,
        b) {
        b.endpointUrl && a.setEndpoint(b.endpointUrl);
        b.prechatUrl && a.setPrechat(b.prechatUrl);
        b.language && a.setLanguage(b.language);
        a.setOnlineState(b.isAvailable)
    }

    function Da() {
        if (q.connection.isRunning())
            if (null == x || ca) ca = !1, ua();
            else {
                f.log("Pinging server to keep presence");
                Q = null;
                var a = {};
                a.sid = x;
                ba && (a.chatted = 1);
                a.r = (new Date).getMilliseconds();
                var b = [new q.Noun("Availability", {
                    ids: "[" + va() + "]"
                })];
                q.connection.send(b, a)
            }
    }

    function da() {
        f.log("Disconnecting from Live Agent");
        q.connection.setIsRunning(!1);
        for (var a in k) k.hasOwnProperty(a) && k[a].setOnlineState(!1)
    }

    function va() {
        var a = [],
            b = {},
            c;
        for (c in k) k.hasOwnProperty(c) && k[c].getType() == l.TYPE.STANDARD && (b[c] = k[c]);
        for (var e in b) a.push(e);
        var b = {},
            d;
        for (d in k) k.hasOwnProperty(d) && k[d].getType() == l.TYPE.AGENT && (b[d] = k[d]);
        for (e in b) a.push(e);
        d = {};
        for (var g in k) k.hasOwnProperty(g) && k[g].getType() == l.TYPE.INVITE && (d[g] = k[g]);
        for (e in d) a.push(e);
        e = "";
        for (g = 0; g < a.length; g++) e += a[g], g < a.length - 1 && (e += ",");
        return e
    }

    function xa(a, b, c, e) {
        document.cookie =
            "liveagent_chatted\x3d1;path\x3d/;";
        ba = !0;
        var d;
        d = "deployment_id\x3d" + m.deploymentId;
        d = d + "\x26org_id\x3d" + m.orgId;
        d += "\x26button_id\x3d";
        d += a;
        c && (d += "\x26agent_id\x3d", d += c);
        e && (d += "\x26do_fallback\x3d1");
        d += "\x26session_id\x3d";
        d += x;
        a = c ? k[c + "_" + a].getEndpoint(d) : k[a].getEndpoint(d);
        c = "height\x3d" + m.chatWindowHeight;
        c = c + ",width\x3d" + m.chatWindowWidth;
        c += ",menubar\x3dno";
        c += ",toolbar\x3dno";
        c += ",location\x3dno";
        c += ",personalbar\x3dno";
        Ea(b, a)
    }
    
    function Ea(a, b) {
        function c(a, b, c) {
            var input =
                document.createElement("input");
                input.name = b;
                input.setAttribute('value', c);
                input.id = b;
            a.appendChild(input);
        }
        var e = v.getVisitCount();
        // null == e && (e = "0");
        e = e || '0';
        var d = document.createElement("form");
        d.style.display = "none";
        c(d, "deploymentId", m.deploymentId);
        c(d, "orgId", m.orgId);
        c(d, "vc", e);
        c(d, "sid", x);
        c(d, "ptid", v.getPermanentId());
        c(d, "det", f.jsonEncode(ya));
        c(d, "oref", v.getOref());
        c(d, "pages", f.jsonEncode(B.getPages()));
        c(d, "sessionStart", (new Date).getTime() - B.getSessionStart());
        c(d, "ent", f.jsonEncode(za));
        ea && c(d, "visitorName", ea);
        d.method = "POST";
        d.setAttribute('id', 'livechat-form');
        d.action = b;
        d.target = a;

        var pageContent = '<html><head></head><body>' + d.outerHTML +
        '</body></html>';
        var pageContentUrl = 'data:text/html;base64,' + btoa(pageContent);

        var ref = cordova.InAppBrowser.open(       
            pageContentUrl,
            "_blank",
            "location=yes,hidenavigationbuttons=yes"
        );

        function eventCallBackFunction(){
            ref.executeScript({code: "document.getElementById('livechat-form').submit()"}, executecallback());
        }

        ref.addEventListener('loadstop', eventCallBackFunction, true);


        function executecallback() {
            ref.removeEventListener('loadstop', eventCallBackFunction, true);    
        }

            
    }

    function fa(a) {
        a ? f.log("Server Warning: " + a) : f.log("Server sent an anoymous warning.")
    }

    function Aa(a) {
        a ? f.log("Server Error: " + a) : f.log("Server responded with an error.");
        da()
    }
    if (!window.liveAgentDeployment) {
        window.liveAgentDeployment = !0;
        var p = {};
        window.liveagent && (p = window.liveagent);
        window.liveagent = p;
        var f = {
                getCookie: function(a) {
                    var b = document.cookie,
                        c = b.indexOf(a + "\x3d");
                    if (-1 == c) return null;
                    c += (a + "\x3d").length;
                    a = b.indexOf(";", c); -
                    1 == a && (a = b.length);
                    return b.substring(c, a)
                },
                setCookie: function(a, b, c) {
                    a = a + "\x3d" + b + ";";
                    c && (c = new Date, c.setFullYear(c.getFullYear() + 10), a += "expires\x3d" + c.toGMTString() + ";");
                    document.cookie = a + "path\x3d/;"
                },
                addEventListener: function(a, b, c) {
                    if (a.addEventListener) a.addEventListener(b, c, !1);
                    else if (a.attachEvent) a.attachEvent("on" + b, c, !1);
                    else throw Error("Could not add event listener");
                },
                log: function(a) {
                    R && window.console && window.console.log && window.console.log("LIVE AGENT: " + a)
                },
                logGroupStart: function(a) {
                    R &&
                        window.console && (window.console.group ? window.console.groupCollapsed("LIVE AGENT: " + a) : f.log(a))
                },
                logGroupEnd: function() {
                    R && window.console && window.console.group && window.console.groupEnd()
                },
                getLanguage: function() {
                    return "undefined" != typeof window.navigator.language ? window.navigator.language : "undefined" != typeof window.navigator.userLanguage ? window.navigator.userLanguage : ""
                },
                arrayHasItem: function(a, b) {
                    if (Array.prototype.indexOf) return -1 < a.indexOf(b);
                    for (var c = 0; c < a.length; c++)
                        if (a[c] == b) return !0
                },
                jsonEncode: function(a,
                    b, c) {
                    function e(a) {
                        g.lastIndex = 0;
                        return g.test(a) ? '"' + a.replace(g, function(a) {
                            var b = f[a];
                            return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                        }) + '"' : '"' + a + '"'
                    }

                    function d(a, b) {
                        var c, g, f, C, y = w,
                            k, h = b[a];
                        h && "object" === typeof h && "function" === typeof h.toJSON && (h = h.toJSON(a));
                        "function" === typeof m && (h = m.call(b, a, h));
                        switch (typeof h) {
                            case "string":
                                return e(h);
                            case "number":
                                return isFinite(h) ? String(h) : "null";
                            case "boolean":
                            case "null":
                                return String(h);
                            case "object":
                                if (!h) return "null";
                                w += l;
                                k = [];
                                if ("[object Array]" === Object.prototype.toString.apply(h)) {
                                    C = h.length;
                                    for (c = 0; c < C; c += 1) k[c] = d(c, h) || "null";
                                    f = 0 === k.length ? "[]" : w ? "[\n" + w + k.join(",\n" + w) + "\n" + y + "]" : "[" + k.join(",") + "]";
                                    w = y;
                                    return f
                                }
                                if (m && "object" === typeof m)
                                    for (C = m.length, c = 0; c < C; c += 1) "string" === typeof m[c] && (g = m[c], (f = d(g, h)) && k.push(e(g) + (w ? ": " : ":") + f));
                                else
                                    for (g in h) Object.prototype.hasOwnProperty.call(Object(h), g) && (f = d(g, h)) && k.push(e(g) + (w ? ": " : ":") + f);
                                f = 0 === k.length ? "{}" : w ? "{\n" + w + k.join(",\n" + w) + "\n" + y + "}" : "{" +
                                    k.join(",") + "}";
                                w = y;
                                return f
                        }
                    }
                    if ("undefined" !== typeof window.JSON) return window.JSON.stringify(a, b, c);
                    if (void 0 === a || null === a) return "null";
                    var g = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        f = {
                            "\b": "\\b",
                            "\t": "\\t",
                            "\n": "\\n",
                            "\f": "\\f",
                            "\r": "\\r",
                            '"': '\\"',
                            "\\": "\\\\"
                        },
                        y, w = "",
                        l = "",
                        m = b;
                    if ("number" === typeof c)
                        for (y = 0; y < c; y += 1) l += " ";
                    else "string" === typeof c && (l = c);
                    if (b && "function" !== typeof b && ("object" !== typeof b || "number" !==
                            typeof b.length)) throw Error("Error during JSON.stringify");
                    return d("", {
                        "": a
                    })
                },
                jsonDecode: function(a) {
                    a = String(a);
                    if ("undefined" !== typeof window.JSON) return window.JSON.parse(a);
                    var b = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
                    b.lastIndex = 0;
                    b.test(a) && (a = a.replace(b, function(a) {
                        return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    }));
                    if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                            "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return eval("(" + a + ")");
                    throw Error("Error during JSON.parse");
                },
                getCssAnimation: function(a) {
                    var b = ["Webkit", "Moz", "O", "ms", "Khtml"];
                    if (void 0 !== a.style.animationName) return "";
                    for (var c = 0; c < b.length; c++)
                        if (void 0 !== a.style[b[c] + "AnimationName"]) return b[c].toLowerCase();
                    return null
                },
                addPrefixToURL: function(a, b, c) {
                    if (!f.isEmpty(a) && !f.isEmpty(b) && 0 !== a.indexOf(b)) {
                        c && (b = f.escapeToHtml(b));
                        var e = /(https?:\/\/)(.*)/i;
                        c = a.replace(e, "$1");
                        a = a.replace(e, "$2");
                        b = b.replace(e,
                            "$2");
                        a = c + b + "/" + a
                    }
                    return a
                },
                getDomainFromUrl: function(a) {
                    if (f.isEmpty(a)) return "";
                    var b;
                    ga || (ga = document.createElement("a"));
                    b = ga;
                    b.href = a;
                    a = a.match(/:(\d+)/g);
                    b = b.protocol + "//" + b.hostname || window.location.protocol + "//" + window.location.hostname;
                    return a ? b + a[0] : b
                },
                isEmpty: function(a) {
                    return null === a || void 0 === a || "" === a
                },
                escapeToHtml: function(a) {
                    return null === a || void 0 === a || "" === a ? "" : a = a.replace(/[&<>"'\u00a9\u2028\u2029]/g, Ba)
                },
                isValidEntityId: function(a) {
                    return a && "string" === typeof a && (18 === a.length ||
                        15 === a.length)
                },
                getKeyPrefix: function(a) {
                    return this.isValidEntityId(a) ? a.substr(0, 3) : null
                },
                isOrganizationId: function(a) {
                    return "00D" === this.getKeyPrefix(a)
                },
                isDeploymentId: function(a) {
                    return "572" === this.getKeyPrefix(a)
                },
                trim: function(a) {
                    return a && a.replace(/^[\s\u0000-\u0020]*|[\s\u0000-\u0020]*$/g, "") || ""
                }
            },
            ga, v = {
                getVisitCount: function() {
                    var a = parseInt(f.getCookie("liveagent_vc"), 10);
                    return isNaN(a) ? null : a
                },
                getOref: function() {
                    return f.getCookie("liveagent_oref")
                },
                getPermanentId: function() {
                    var a =
                        f.getCookie("liveagent_ptid");
                    return null != a ? a : ""
                },
                setVisitCount: function(a) {
                    f.setCookie("liveagent_vc", a, !0)
                },
                setOref: function(a) {
                    return f.setCookie("liveagent_oref", a, !0)
                },
                setPermanentId: function(a) {
                    f.setCookie("liveagent_ptid", a, !0)
                }
            },
            B = new function() {
                function a() {
                    return window.localStorage ? window.localStorage : window.sessionStorage
                }

                function b() {
                    var a = document.createElement("div");
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.id = "liveagent_userdata_provider";
                    a.addBehavior("#default#userData");
                    a.load("liveagent");
                    return {
                        getItem: function(b) {
                            return a.getAttribute(b)
                        },
                        setItem: function(b, c) {
                            a.setAttribute(b, c);
                            a.save("liveagent")
                        },
                        removeItem: function(b) {
                            a.removeAttribute(b);
                            a.save("liveagent")
                        }
                    }
                }

                function c() {
                    var a = {};
                    return {
                        getItem: function(b) {
                            return a[b]
                        },
                        setItem: function(b, c) {
                            a[b] = c
                        },
                        removeItem: function(b) {
                            delete a[b]
                        }
                    }
                }

                function e() {
                    g.setItem(d.SESSION_ID, x);
                    g.setItem(d.PAGE_COUNT, "0");
                    g.setItem(d.SESSION_START, (new Date).getTime().toString())
                }
                var d = {
                    SESSION_ID: "liveAgentSid",
                    PAGE_COUNT: "liveAgentPc",
                    SESSION_START: "liveAgentStart",
                    PAGE: "liveAgentPage_",
                    PAGE_TIME: "liveAgentPageTime_"
                };
                a.isSupported = function() {
                    try {
                        if (window.localStorage || window.sessionStorage) {
                            var a = window.localStorage ? window.localStorage : window.sessionStorage;
                            a.setItem("liveAgentTestKey", "1");
                            a.removeItem("liveAgentTestKey");
                            return !0
                        }
                        return !1
                    } catch (b) {
                        return !1
                    }
                };
                b.isSupported = function() {
                    return document.createElement("div").addBehavior
                };
                var g;
                g = a.isSupported() ? a() : b.isSupported() ? b() : c();
                this.init = function() {
                    if (g.getItem(d.SESSION_ID)) {
                        if (g.getItem(d.SESSION_ID) !=
                            x) {
                            g.removeItem(d.SESSION_START);
                            for (var a = g.getItem(d.PAGE_COUNT), b = 25 > a ? 0 : a - 25; b < a; b++) g.removeItem(d.PAGE + b), g.removeItem(d.PAGE_TIME + b);
                            e()
                        }
                    } else e();
                    a = parseInt(g.getItem(d.PAGE_COUNT), 10);
                    25 <= a && (g.removeItem(d.PAGE + (a - 25)), g.removeItem(d.PAGE_TIME + (a - 25)));
                    g.setItem(d.PAGE_COUNT, (a + 1).toString());
                    g.setItem(d.PAGE + a.toString(), window.location.href);
                    g.setItem(d.PAGE_TIME + a.toString(), (new Date).getTime())
                };
                this.getPageCount = function() {
                    return parseInt(g.getItem(d.PAGE_COUNT), 10)
                };
                this.getSessionStart =
                    function() {
                        return g.getItem(d.SESSION_START)
                    };
                this.getPages = function() {
                    for (var a = [], b = this.getPageCount(), c = 25 > b ? 0 : b - 25; c < b; c++) a.unshift({
                        location: g.getItem(d.PAGE + c.toString()),
                        time: ((new Date).getTime() - parseInt(g.getItem(d.PAGE_TIME + c.toString()), 10)).toString()
                    });
                    return a
                };
                this.getCurrentPage = function() {
                    return g.getItem(d.PAGE + (this.getPageCount() - 1).toString())
                };
                this.clear = function() {
                    g.clear()
                }
            };
        l.TYPE = {
            STANDARD: "STANDARD",
            INVITE: "INVITE",
            AGENT: "AGENT"
        };
        l.EVENT = {
            BUTTON_AVAILABLE: "BUTTON_AVAILABLE",
            BUTTON_UNAVAILABLE: "BUTTON_UNAVAILABLE",
            BUTTON_ACCEPTED: "BUTTON_ACCEPTED",
            BUTTON_REJECTED: "BUTTON_REJECTED"
        };
        l.prototype.init = function(a, b) {
            this.buttonId = a;
            this.type = b;
            this.onlineState = null;
            this.trackers = [];
            this.language = this.prechat = this.endpoint = null
        };
        l.prototype.getType = function() {
            return this.type
        };
        l.prototype.getOnlineState = function() {
            return this.onlineState
        };
        l.prototype.setOnlineState = function(a) {
            this.onlineState = a;
            for (var b = 0; b < this.trackers.length; b++) this.trackers[b].setState(a)
        };
        l.prototype.addTracker =
            function(a) {
                this.trackers.push(a)
            };
        l.prototype.setPrechat = function(a) {
            this.prechat = a
        };
        l.prototype.setEndpoint = function(a) {
            this.endpoint = a
        };
        l.prototype.getEndpoint = function(a) {
            function b() {
                var b = m.contentServerUrl,
                    c = m.urlPrefix;
                if (null == b) throw Error("You cannot call liveagent.startChat until the asynchronous call to liveagent.init has completed!");
                m.contentServerUrl = f.addPrefixToURL(b, c, !0);
                b = this.endpoint;
                b = !f.isEmpty(b) && -1 < f.getDomainFromUrl(b).indexOf("force") ? f.addPrefixToURL(b, c, !0) : b;
                this.endpoint =
                    b;
                b = (null != this.endpoint ? this.endpoint : m.contentServerUrl + m.chatPage) + "?language\x3d" + (this.language ? this.language : "");
                f.isEmpty(c) || (b += "\x26proxy\x3d" + c + "\x26proxyKey\x3d" + m.prefixKey + "\x26org_id\x3d" + m.orgId + "\x26deployment_id\x3d" + m.deploymentId);
                return b += "#" + a
            }
            var c = null,
                c = null == this.prechat ? b.call(this) : this.prechat + "?endpoint\x3d" + encodeURIComponent(b.call(this));
            return m.contentServerUrl + m.prechatHandler + "?endpoint\x3d" + encodeURIComponent(c)
        };
        l.prototype.setLanguage = function(a) {
            this.language =
                a
        };
        l.prototype.startChat = function(a) {
            return this.dispatchEvent(l.EVENT.BUTTON_ACCEPTED) ? (xa(this.buttonId, a), !0) : !1
        };
        l.prototype.rejectChat = function() {
            return this.dispatchEvent(l.EVENT.BUTTON_REJECTED) ? !0 : !1
        };
        l.prototype.dispatchEvent = function(a) {
            return ha.hasOwnProperty(this.buttonId) ? !1 === ha[this.buttonId].call(this, a) ? !1 : !0 : !0
        };
        t.prototype.init = function(a, b) {
            this.buttonId = a;
            this.element = b
        };
        t.prototype.getId = function() {
            return this.buttonId
        };
        t.prototype.setState = function(a) {
            f.log("Setting state for button " +
                this.buttonId + " to " + (a ? "online" : "offline"));
            return k[this.buttonId].dispatchEvent(a ? l.EVENT.BUTTON_AVAILABLE : l.EVENT.BUTTON_UNAVAILABLE) ? !0 : !1
        };
        la.prototype = new l;
        S.prototype = new l;
        S.prototype.startChat = function(a, b) {
            if (this.dispatchEvent(l.EVENT.BUTTON_ACCEPTED)) {
                var c = this.buttonId.split("_");
                xa(c[1], a, c[0], b);
                return !0
            }
            return !1
        };
        T.prototype = new t;
        T.prototype.setState = function(a) {
            t.prototype.setState.call(this, a) && (this.element.style.display = a ? "" : "none")
        };
        U.prototype = new t;
        U.prototype.setState =
            function(a) {
                t.prototype.setState.call(this, a) && (this.element.style.display = a ? "none" : "")
            };
        var ia = !1,
            G = null,
            ja = {},
            H = {};
        n.prototype = new l;
        n.RENDERER = {
            Slide: {
                renderClass: J
            },
            Fade: {
                renderClass: K
            },
            Appear: {
                renderClass: M
            },
            Custom: {
                renderClass: E
            }
        };
        n.START_POSITION = {
            TopLeft: {
                xPercent: 0,
                xPosition: -1,
                xOffset: -1,
                yPercent: 0,
                yPosition: -1,
                yOffset: -1
            },
            TopLeftTop: {
                xPercent: 0,
                xPosition: 0,
                xOffset: 1,
                yPercent: 0,
                yPosition: -1,
                yOffset: -1
            },
            Top: {
                xPercent: .5,
                xPosition: -.5,
                xOffset: 0,
                yPercent: 0,
                yPosition: -1,
                yOffset: -1
            },
            TopRightTop: {
                xPercent: 1,
                xPosition: -1,
                xOffset: -1,
                yPercent: 0,
                yPosition: -1,
                yOffset: -1
            },
            TopRight: {
                xPercent: 1,
                xPosition: 0,
                xOffset: 1,
                yPercent: 0,
                yPosition: -1,
                yOffset: -1
            },
            TopRightRight: {
                xPercent: 1,
                xPosition: 0,
                xOffset: 1,
                yPercent: 0,
                yPosition: 0,
                yOffset: 1
            },
            Right: {
                xPercent: 1,
                xPosition: 0,
                xOffset: 1,
                yPercent: .5,
                yPosition: -.5,
                yOffset: 0
            },
            BottomRightRight: {
                xPercent: 1,
                xPosition: 0,
                xOffset: 1,
                yPercent: 1,
                yPosition: -1,
                yOffset: -1
            },
            BottomRight: {
                xPercent: 1,
                xPosition: 0,
                xOffset: 1,
                yPercent: 1,
                yPosition: 0,
                yOffset: 1
            },
            BottomRightBottom: {
                xPercent: 1,
                xPosition: -1,
                xOffset: -1,
                yPercent: 1,
                yPosition: 0,
                yOffset: 1
            },
            Bottom: {
                xPercent: .5,
                xPosition: -.5,
                xOffset: 0,
                yPercent: 1,
                yPosition: 0,
                yOffset: 1
            },
            BottomLeftBottom: {
                xPercent: 0,
                xPosition: 0,
                xOffset: 1,
                yPercent: 1,
                yPosition: 0,
                yOffset: 1
            },
            BottomLeft: {
                xPercent: 0,
                xPosition: -1,
                xOffset: -1,
                yPercent: 1,
                yPosition: 0,
                yOffset: 1
            },
            BottomLeftLeft: {
                xPercent: 0,
                xPosition: -1,
                xOffset: -1,
                yPercent: 1,
                yPosition: -1,
                yOffset: -1
            },
            Left: {
                xPercent: 0,
                xPosition: -1,
                xOffset: -1,
                yPercent: .5,
                yPosition: -.5,
                yOffset: 0
            },
            TopLeftLeft: {
                xPercent: 0,
                xPosition: -1,
                xOffset: -1,
                yPercent: 0,
                yPosition: 0,
                yOffset: 1
            }
        };
        n.END_POSITION = {
            TopLeft: {
                xPercent: 0,
                xOffset: 1,
                yPercent: 0,
                yOffset: 1
            },
            Top: {
                xPercent: .5,
                xOffset: 0,
                yPercent: 0,
                yOffset: 1
            },
            TopRight: {
                xPercent: 1,
                xOffset: -1,
                yPercent: 0,
                yOffset: 1
            },
            Left: {
                xPercent: 0,
                xOffset: 1,
                yPercent: .5,
                yOffset: 0
            },
            Center: {
                xPercent: .5,
                xOffset: 0,
                yPercent: .5,
                yOffset: 0
            },
            Right: {
                xPercent: 1,
                xOffset: -1,
                yPercent: .5,
                yOffset: 0
            },
            BottomLeft: {
                xPercent: 0,
                xOffset: 1,
                yPercent: 1,
                yOffset: -1
            },
            Bottom: {
                xPercent: .5,
                xOffset: 0,
                yPercent: 1,
                yOffset: -1
            },
            BottomRight: {
                xPercent: 1,
                xOffset: -1,
                yPercent: 1,
                yOffset: -1
            }
        };
        n.prototype.setRules = function(a, b) {
            if (a && b) {
                for (var c in a) {
                    var e = a[c],
                        d = null;
                    switch (e.type) {
                        case h.TYPE.NUMBER_OF_PAGE_VIEWS:
                            d = new N(e.order, this.buttonId, B.getPageCount(), e.operator, parseInt(e.value, 10));
                            break;
                        case h.TYPE.URL_MATCH:
                            d = new N(e.order, this.buttonId, B.getCurrentPage(), e.operator, e.value);
                            break;
                        case h.TYPE.SECONDS_ON_PAGE:
                            d = new O(e.order, this.buttonId, (new Date).getTime(), e.operator, 1E3 * parseInt(e.value, 10));
                            break;
                        case h.TYPE.SECONDS_ON_SITE:
                            d = new O(e.order, this.buttonId,
                                parseInt(B.getSessionStart(), 10), e.operator, 1E3 * parseInt(e.value, 10));
                            break;
                        case h.TYPE.CUSTOM_VARIABLE:
                            d = new V(e.order, this.buttonId, e.name, e.operator, e.value), H.hasOwnProperty(e.name) || (H[e.name] = []), H[e.name].push(this.buttonId)
                    }
                    null != d && this.addRule(d)
                }
                this.filterLogic = b;
                this.ruleTree = F(b)
            }
        };
        n.prototype.setOnlineState = function(a) {
            a || null === this.inviteTimeout || (clearTimeout(this.inviteTimeout), this.inviteTimeout = null);
            a || null === this.autoRejectTimeout || (clearTimeout(this.autoRejectTimeout), this.autoRejectTimeout =
                null);
            l.prototype.setOnlineState.call(this, a)
        };
        n.prototype.isActive = function() {
            return this.active
        };
        n.prototype.setActive = function(a) {
            this.active = a
        };
        n.prototype.addTracker = function(a) {
            this.trackers = [];
            l.prototype.addTracker.call(this, a)
        };
        n.prototype.getTracker = function() {
            if (1 != this.trackers.length) throw Error("InviteButtons should have exactly 1 tracker");
            return this.trackers[0]
        };
        n.prototype.startChat = function(a) {
            return this.active && l.prototype.startChat.call(this, a) ? (this.getTracker().accept(), !0) :
                !1
        };
        n.prototype.rejectChat = function() {
            return this.active && l.prototype.rejectChat.call(this) ? (this.getTracker().reject(), !0) : !1
        };
        n.prototype.trigger = function() {
            if (f.getCookie("liveagent_invite_rejected_" + this.buttonId)) return !1;
            var a = !0;
            null != this.ruleTree && (f.logGroupStart("Invite " + this.buttonId + " Rule Evaluation"), f.log("Filter Logic: " + this.filterLogic), a = this.ruleTree.evaluate(this), f.logGroupEnd());
            if (!a && null != this.inviteDelay) {
                var b = this;
                this.inviteTimeout = window.setTimeout(function() {
                        b.setOnlineState(!0)
                    },
                    this.inviteDelay);
                this.inviteDelay = null
            }
            return a
        };
        n.prototype.addRule = function(a) {
            this.rules[a.getId()] = a
        };
        n.prototype.getRule = function(a) {
            return this.rules[a]
        };
        n.prototype.getInviteDelay = function() {
            return this.inviteDelay
        };
        n.prototype.setInviteDelay = function(a) {
            f.log("Setting invite delay to: " + a);
            this.inviteDelay = a
        };
        n.prototype.setAutoRejectTimeout = function(a) {
            this.autoRejectTimeout = a
        };
        A.prototype = new t;
        A.prototype.setState = function(a) {
            a && !ia && u(this.buttonId).trigger() && t.prototype.setState.call(this,
                !0) ? (ia = !0, G = this.buttonId, this.renderer.render()) : !a && u(this.buttonId).isActive() && t.prototype.setState.call(this, !1) && (ia = !1, this.remove(!0))
        };
        A.prototype.renderFinish = function() {
            u(this.buttonId).setActive(!0);
            if (-1 != this.rejectTime) {
                var a = this.buttonId;
                u(this.buttonId).setAutoRejectTimeout(window.setTimeout(function() {
                    u(a).rejectChat()
                }, 1E3 * this.rejectTime))
            }
            this.renderer.renderFinish()
        };
        A.prototype.accept = function() {
            this.hasInviteAfterAccept || f.setCookie("liveagent_invite_rejected_" + this.buttonId,
                !0, !1);
            this.remove(!1)
        };
        A.prototype.reject = function() {
            this.hasInviteAfterReject || f.setCookie("liveagent_invite_rejected_" + this.buttonId, !0, !1);
            this.remove(!0)
        };
        A.prototype.remove = function(a) {
            u(this.buttonId).setActive(!1);
            this.renderer.remove(a)
        };
        A.prototype.removeFinish = function() {
            this.renderer.remove(!1)
        };
        r.prototype.init = function(a, b, c, e) {
            window.innerWidth ? this.realWidth = window.innerWidth : document.documentElement && document.documentElement.clientWidth ? this.realWidth = document.documentElement.clientWidth :
                document.body && (this.realWidth = document.body.clientWidth);
            window.innerHeight ? this.realHeight = window.innerHeight : document.documentElement && document.documentElement.clientHeight ? this.realHeight = document.documentElement.clientHeight : document.body && (this.realHeight = document.body.clientHeight);
            this.offset = 25;
            this.buttonId = a;
            this.animationPrefix = f.getCssAnimation(b);
            this.element = b;
            this.element.style.position = null !== this.animationPrefix ? "fixed" : "absolute";
            this.element.style.left = "-1000px";
            this.element.style.top =
                "-1000px";
            this.element.style.zIndex = "10000";
            this.element.style.display = "";
            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
            this.startPosition = c;
            this.endPosition = e
        };
        r.prototype.render = function() {
            this.element.style.display = ""
        };
        r.prototype.renderFinish = function() {};
        r.prototype.remove = function(a) {
            this.element.style.left = "-1000px";
            this.element.style.top = "-1000px"
        };
        r.prototype.addRenderListeners = function() {
            var a = this.buttonId,
                b = "AnimationIteration",
                c = "AnimationEnd";
            "" == this.animationPrefix ?
                (b = b.toLowerCase(), c = c.toLowerCase()) : (b = this.animationPrefix + b, c = this.animationPrefix + c);
            f.addEventListener(this.element, b, function() {
                D(a).renderFinish()
            });
            f.addEventListener(this.element, c, function() {
                D(a).removeFinish()
            })
        };
        J.prototype = new r;
        J.prototype.render = function() {
            r.prototype.addRenderListeners.call(this);
            var a = this.width * this.startPosition.xPosition + this.offset * this.startPosition.xOffset,
                b = this.height * this.startPosition.yPosition + this.offset * this.startPosition.yOffset,
                c = this.width * this.endPosition.xPercent *
                -1 + this.offset * this.endPosition.xOffset,
                e = this.height * this.endPosition.yPercent * -1 + this.offset * this.endPosition.yOffset,
                d = "";
            "" !== this.animationPrefix && (d = "-" + this.animationPrefix + "-");
            var g = document.createElement("style");
            g.innerHTML = "@" + d + "keyframes slide" + this.buttonId + "{from { margin-left: " + a + "px; margin-top: " + b + "px; left: " + 100 * this.startPosition.xPercent + "%; top: " + 100 * this.startPosition.yPercent + "%; }to { margin-left: " + c + "px; margin-top: " + e + "px; left: " + 100 * this.endPosition.xPercent + "%; top: " +
                100 * this.endPosition.yPercent + "%; }}";
            document.getElementsByTagName("head")[0].appendChild(g);
            this.element.style[d + "animation-name"] = "slide" + this.buttonId;
            this.element.style[d + "animation-duration"] = "1s";
            this.element.style[d + "animation-iteration-count"] = "2";
            this.element.style[d + "animation-direction"] = "alternate";
            this.element.style[d + "animation-timing-function"] = "ease-in-out";
            this.element.style.setProperty(d + "animation-name", "slide" + this.buttonId, "");
            this.element.style.setProperty(d + "animation-duration",
                "1s", "");
            this.element.style.setProperty(d + "animation-iteration-count", "2", "");
            this.element.style.setProperty(d + "animation-direction", "alternate", "");
            this.element.style.setProperty(d + "animation-timing-function", "ease-in-out", "");
            r.prototype.render.call(this)
        };
        J.prototype.renderFinish = function() {
            var a = "";
            "" !== this.animationPrefix && (a = "-" + this.animationPrefix + "-");
            this.element.style[a + "animation-play-state"] = "paused";
            this.element.style.setProperty(a + "animation-play-state", "paused", "")
        };
        J.prototype.remove =
            function(a) {
                var b = "";
                "" !== this.animationPrefix && (b = "-" + this.animationPrefix + "-");
                a ? (this.element.style[b + "animation-play-state"] = "running", this.element.style.setProperty(b + "animation-play-state", "running", "")) : (this.element.style[b + "animation-name"] = "", this.element.style.setProperty(b + "animation-name", "", ""), r.prototype.remove.call(this, a))
            };
        K.prototype = new r;
        K.prototype.render = function() {
            r.prototype.addRenderListeners.call(this);
            var a = "";
            "" !== this.animationPrefix && (a = "-" + this.animationPrefix + "-");
            var b = document.createElement("style");
            b.innerHTML = "@" + a + "keyframes fade" + this.buttonId + "{from { opacity: 0; }to { opacity: 1; }}";
            document.getElementsByTagName("head")[0].appendChild(b);
            this.element.style[a + "animation-name"] = "fade" + this.buttonId;
            this.element.style[a + "animation-duration"] = "1s";
            this.element.style[a + "animation-iteration-count"] = "2";
            this.element.style[a + "animation-direction"] = "alternate";
            this.element.style[a + "animation-timing-function"] = "ease-in-out";
            this.element.style.setProperty(a +
                "animation-name", "fade" + this.buttonId, "");
            this.element.style.setProperty(a + "animation-duration", "1s", "");
            this.element.style.setProperty(a + "animation-iteration-count", "2", "");
            this.element.style.setProperty(a + "animation-direction", "alternate", "");
            this.element.style.setProperty(a + "animation-timing-function", "ease-in-out", "");
            this.element.style.marginLeft = this.width * this.endPosition.xPercent * -1 + this.offset * this.endPosition.xOffset + "px";
            this.element.style.left = 100 * this.endPosition.xPercent + "%";
            this.element.style.marginTop =
                this.height * this.endPosition.yPercent * -1 + this.offset * this.endPosition.yOffset + "px";
            this.element.style.top = 100 * this.endPosition.yPercent + "%";
            r.prototype.render.call(this)
        };
        K.prototype.renderFinish = function() {
            var a = "";
            "" !== this.animationPrefix && (a = "-" + this.animationPrefix + "-");
            this.element.style[a + "animation-play-state"] = "paused";
            this.element.style.setProperty(a + "animation-play-state", "paused", "")
        };
        K.prototype.remove = function(a) {
            var b = "";
            "" !== this.animationPrefix && (b = "-" + this.animationPrefix + "-");
            a ?
                (this.element.style[b + "animation-play-state"] = "running", this.element.style.setProperty(b + "animation-play-state", "running", ""), this.element.style.opacity = 0) : (this.element.style[b + "animation-name"] = "", this.element.style.setProperty(b + "animation-name", "", ""), r.prototype.remove.call(this, a))
        };
        M.prototype = new r;
        M.prototype.render = function() {
            this.element.style.marginLeft = this.width * this.endPosition.xPercent * -1 + this.offset * this.endPosition.xOffset + "px";
            this.element.style.left = 100 * this.endPosition.xPercent +
                "%";
            this.element.style.marginTop = this.height * this.endPosition.yPercent * -1 + this.offset * this.endPosition.yOffset + "px";
            this.element.style.top = 100 * this.endPosition.yPercent + "%";
            r.prototype.render.call(this);
            D(this.buttonId).renderFinish()
        };
        M.prototype.remove = function(a) {
            a ? D(this.buttonId).removeFinish() : r.prototype.remove.call(this, a)
        };
        E.prototype = new r;
        E.prototype.render = function() {
            D(this.buttonId).renderFinish()
        };
        E.prototype.renderFinish = function() {};
        E.prototype.remove = function(a) {
            a && D(this.buttonId).removeFinish()
        };
        h.TYPE = {
            NUMBER_OF_PAGE_VIEWS: "NUMBER_OF_PAGE_VIEWS",
            URL_MATCH: "URL_MATCH",
            SECONDS_ON_PAGE: "SECONDS_ON_PAGE",
            SECONDS_ON_SITE: "SECONDS_ON_SITE",
            CUSTOM_VARIABLE: "CUSTOM_VARIABLE"
        };
        h.OPERATOR = {
            EQUALS: "EQUALS",
            NOT_EQUAL: "NOT_EQUAL",
            START_WITH: "START_WITH",
            CONTAINS: "CONTAINS",
            NOT_CONTAIN: "NOT_CONTAIN",
            LESS_THAN: "LESS_THAN",
            GREATER_THAN: "GREATER_THAN",
            LESS_OR_EQUAL: "LESS_OR_EQUAL",
            GREATER_OR_EQUAL: "GREATER_OR_EQUAL"
        };
        h.prototype.init = function(a, b, c, e, d) {
            this.ruleId = a;
            this.buttonId = b;
            this.compareFrom = c;
            this.operator =
                e;
            this.compareTo = d
        };
        h.prototype.getId = function() {
            return this.ruleId
        };
        h.prototype.evaluate = function(a, b) {
            switch (this.operator) {
                case h.OPERATOR.EQUALS:
                    return f.log("Evaluate: " + a + " \x3d\x3d " + b), a == b;
                case h.OPERATOR.NOT_EQUAL:
                    return f.log("Evaluate: " + a + " !\x3d " + b), a != b;
                case h.OPERATOR.START_WITH:
                    return f.log("Evaluate: " + a + " indexOf " + b + " \x3d\x3d 0"), 0 == a.indexOf(b);
                case h.OPERATOR.CONTAINS:
                    return f.log("Evaluate: " + a + " indexOf " + b + " !\x3d -1"), -1 != a.indexOf(b);
                case h.OPERATOR.NOT_CONTAIN:
                    return f.log("Evaluate: " +
                        a + " indexOf " + b + " \x3d\x3d -1"), -1 == a.indexOf(b);
                case h.OPERATOR.LESS_THAN:
                    return f.log("Evaluate: " + parseFloat(a) + " \x3c " + parseFloat(b)), parseFloat(a) < parseFloat(b);
                case h.OPERATOR.GREATER_THAN:
                    return f.log("Evaluate: " + parseFloat(a) + " \x3e " + parseFloat(b)), parseFloat(a) > parseFloat(b);
                case h.OPERATOR.LESS_OR_EQUAL:
                    return f.log("Evaluate: " + parseFloat(a) + " \x3c\x3d " + parseFloat(b)), parseFloat(a) <= parseFloat(b);
                case h.OPERATOR.GREATER_OR_EQUAL:
                    return f.log("Evaluate: " + parseFloat(a) + " \x3e\x3d " +
                        parseFloat(b)), parseFloat(a) >= parseFloat(b)
            }
        };
        N.prototype = new h;
        N.prototype.evaluate = function() {
            f.log("Evaluating StandardInviteRule");
            return h.prototype.evaluate.call(this, this.compareFrom, this.compareTo)
        };
        O.prototype = new h;
        O.prototype.evaluate = function() {
            f.log("Evaluating TimerInviteRule");
            var a = (new Date).getTime() - this.compareFrom,
                b = h.prototype.evaluate.call(this, a, this.compareTo);
            !b && a <= this.compareTo && (a = this.compareTo - a, (null == u(this.buttonId).getInviteDelay() || a < u(this.buttonId).getInviteDelay()) &&
                u(this.buttonId).setInviteDelay(a));
            return b
        };
        V.prototype = new h;
        V.prototype.evaluate = function() {
            if (ja.hasOwnProperty(this.compareFrom)) return f.log("Evaluating CustomInviteRule"), h.prototype.evaluate.call(this, ja[this.compareFrom].toString(), this.compareTo);
            f.log("CustomInviteRule evaluation failed due to missing custom variable");
            return !1
        };
        var na = 0;
        z.prototype.init = function(a, b) {
            this.left = a;
            this.right = b
        };
        z.prototype.evaluate = function(a) {
            return !1
        };
        Z.prototype = new z;
        Z.prototype.evaluate = function(a) {
            f.log("Evaluating Atom Node: " +
                this.ruleId);
            return a.getRule(this.ruleId).evaluate()
        };
        W.prototype = new z;
        W.prototype.evaluate = function(a) {
            f.logGroupStart("Evaluating And Node");
            a = this.left.evaluate(a) && this.right.evaluate(a);
            f.logGroupEnd();
            return a
        };
        X.prototype = new z;
        X.prototype.evaluate = function(a) {
            f.logGroupStart("Evaluating Or Node");
            a = this.left.evaluate(a) || this.right.evaluate(a);
            f.logGroupEnd();
            return a
        };
        Y.prototype = new z;
        Y.prototype.evaluate = function(a) {
            f.logGroupStart("Evaluating Not Node");
            a = !this.left.evaluate(a);
            f.logGroupEnd();
            return a
        };
        oa.prototype.toJSON = function() {
            return {
                label: this.getLabel(),
                value: this.getValue(),
                displayToAgent: this.getDisplayToAgent(),
                entityMaps: this.getMapper().getEntityMaps(),
                transcriptFields: this.getMapper().getTranscriptFields(),
                doKnowledgeSearch: this.getDoKnowledgeSearch()
            }
        };
        aa.prototype.map = function(a, b, c, e, d) {
            "undefined" == typeof c && (c = !0);
            "undefined" == typeof e && (e = !0);
            "undefined" == typeof d && (d = !0);
            this.getEntityMaps().push(new pa(a, b, c, e, d))
        };
        aa.prototype.saveToTranscript = function(a) {
            this.getTranscriptFields().push(a)
        };
        pa.prototype.toJSON = function() {
            return {
                entityName: this.getEntityName(),
                fieldName: this.getFieldName(),
                fastFill: this.getFastFill(),
                autoQuery: this.getAutoQuery(),
                exactMatch: this.getExactMatch()
            }
        };
        var I = {};
        p._ = I;
        I.handlePing = function(a) {
            q.connection.handlePing(a)
        };
        I.error = function(a) {
            a ? f.log("Server Error: " + a) : f.log("Server responded with an error.");
            da()
        };
        I.warning = function(a) {
            a ? f.log("Server Warning: " + a) : f.log("Server sent an anoymous warning.")
        };
        I.setNewPtid = function(a) {
            v.setPermanentId(a)
        };
        I.clearStorage =
            function() {
                B.clear()
            };
        p.init = function(a, b, c) {
            if ("string" != typeof a) throw Error("The url to init must be strings");
            if (!f.isOrganizationId(c)) throw Error("Invalid OrganizationId Parameter Value: " + c);
            if (!f.isDeploymentId(b)) throw Error("Invalid DeploymentId Parameter Value: " + b);
            m.url = a;
            m.deploymentId = b;
            m.orgId = c;
            f.log("System Initialized. Waiting for the DOM to be ready");
            "complete" === document.readyState ? setTimeout(P, 1) : document.addEventListener ? (document.addEventListener("DOMContentLoaded", P, !1),
                window.addEventListener("load", P, !1)) : window.attachEvent ? window.attachEvent("onload", P) : f.log("No available event model. Exiting.")
        };
        p.getSid = function() {
            return x
        };
        p.enableLogging = function() {
            R = !0
        };
        p.setLocation = function(a) {};
        p.setChatWindowWidth = function(a) {
            m.chatWindowWidth = a
        };
        p.setChatWindowHeight = function(a) {
            m.chatWindowHeight = a
        };
        p.disconnect = function() {
            da()
        };
        p.startChat = function(a, b, c) {
            (b ? L(a, b) : k[a]).startChat("liveagent" + Math.round(1E5 * Math.random()) + (new Date).getTime(), c)
        };
        p.startChatWithWindow =
            function(a, b, c, e) {
                (c ? L(a, c) : k[a]).startChat(b, e)
            };
        p.rejectChat = function(a) {
            k[a].rejectChat()
        };
        p.showWhenOnline = function(a, b, c) {
            if (q.connection.isRunning()) throw Error("You cannot add a button after page initialization.");
            a = c ? L(a, c) : ma(a);
            a.addTracker(new T(a.buttonId, b))
        };
        p.showWhenOffline = function(a, b, c) {
            if (q.connection.isRunning()) throw Error("You cannot add a button after page initialization.");
            a = c ? L(a, c) : ma(a);
            a.addTracker(new U(a.buttonId, b))
        };
        p.addCustomDetail = function(a, b, c) {
            if (q.connection.isRunning()) throw Error("You cannot add a detail after page initialization.");
            if ("undefined" == typeof a || "undefined" == typeof b || null === a || null === b) throw Error("CustomDetail contains null value");
            var e = new oa(a, b, c);
            ya.push(e);
            var d = {
                map: function(a, b, c, f, h) {
                    if ("undefined" == typeof a || null === a || "undefined" == typeof b || null === b || null === c || null === f || null === h) throw Error("CustomDetail.map contains null value");
                    e.getMapper().map(a, b, c, f, h);
                    return d
                },
                saveToTranscript: function(a) {
                    if ("undefined" == typeof a || null === a) throw Error("CustomDetail.saveToTranscript contains null value");
                    e.getMapper().saveToTranscript(a);
                    return d
                },
                doKnowledgeSearch: function() {
                    e.setDoKnowledgeSearch();
                    return d
                }
            };
            return d
        };
        p.setName = function(a) {
            if (q.connection.isRunning()) throw Error("You cannot set the name after page initialization.");
            ea = a
        };
        p.addButtonEventHandler = function(a, b) {
            "function" == typeof b && (ha[a] = b)
        };
        p.BUTTON_EVENT = l.EVENT;
        p.setCustomVariable = function(a, b) {
            ja[a] = b;
            if (H.hasOwnProperty(a))
                for (var c = 0; c < H[a].length; c++) {
                    var e = u(H[a][c]);
                    e.getOnlineState() && e.setOnlineState(!0)
                }
        };
        p.findOrCreate = function(a) {
            if (q.connection.isRunning()) throw Error("You cannot find or create after page initialization.");
            var b = new qa(a);
            za.push(b);
            var c = {
                map: function(a, d, g, f, h) {
                    b.getEntityMapper().map(a, d, g, f, h);
                    return c
                },
                saveToTranscript: function(a) {
                    b.setSaveTranscript(a);
                    return c
                },
                showOnCreate: function() {
                    b.setShowOnCreate(!0);
                    return c
                },
                linkToEntity: function(a, d) {
                    if (ka.hasOwnProperty(a) && ka[a] == b.getEntityName()) return fa("Warning: Recursive links detected, skip link " + b.getEntityName() + " to " + a), c;
                    b.setLinkToEntityName(a);
                    b.setLinkToEntityField(d);
                    ka[b.getEntityName()] = a;
                    return c
                }
            };
            return c
        };
        p.addURLPrefix = function(a) {
            if (q.connection.isRunning()) throw Error("You cannot set a URL Prefix after page initialization.");
            if ("string" != typeof a) throw Error("The parameter to addURLPrefix must be a string");
            m.url = f.addPrefixToURL(m.url, a, !0);
            m.urlPrefix = a
        };
        var q = {
            VisitorMessage: {
                ERROR: "Error",
                WARNING: "Warning"
            },
            SystemMessage: {
                ASYNC_RESULT: "AsyncResult",
                SWITCH_SERVER: "SwitchServer"
            }
        };
        (function() {
            var a = null,
                b = !1,
                c = null,
                e = null,
                d = {};
            (function() {
                d.send = function(b, f) {
                    if (null !== c) d.onError.call(window, "Did not handle response before sending another message");
                    else {
                        "undefined" == typeof f && (f = {});
                        var h = "Visitor",
                            k = "",
                            l = !1;
                        1 < b.length ?
                            (h = "System", k = "MultiNoun", f.nouns = "", l = !0) : k = b[0].getName();
                        h = m.url + "/rest/" + h + "/" + k + ".jsonp?";
                        for (k = 0; k < b.length; k++) {
                            l && (f.nouns += b[k].getName() + ",");
                            f[b[k].getName() + ".prefix"] = "Visitor";
                            for (var n in b[k].getData()) b[k].getData().hasOwnProperty(n) && (f[b[k].getName() + "." + n] = b[k].getData()[n])
                        }
                        l && (f.nouns = f.nouns.substr(0, f.nouns.length - 1));
                        for (var p in f) f.hasOwnProperty(p) && (h += p + "\x3d" + f[p] + "\x26");
                        h += "callback\x3d" + a;
                        h += "\x26deployment_id\x3d" + m.deploymentId;
                        h += "\x26org_id\x3d" + m.orgId;
                        h += "\x26version\x3d36";
                        l = document.createElement("script");
                        l.type = "text/javascript";
                        l.src = h;
                        c = document.body.appendChild(l);
                        e = window.setTimeout(function() {
                            d.onError.call(window, "Server failed to respond.")
                        }, m.pingTimeout)
                    }
                };
                d.handlePing = function(a) {
                    e && (clearTimeout(e), e = null);
                    b = !0;
                    a = a.messages;
                    for (var f = 0; f < a.length; f++) d.messageHandler.call(window, a[f].type, a[f].message);
                    d.onSuccess.call(window);
                    null !== c && (document.body.removeChild(c), c = null)
                };
                d.messageHandler = function(a, b) {};
                d.onSuccess = function() {};
                d.onError = function(a) {};
                d.isRunning = function() {
                    return b
                };
                d.setIsRunning = function(a) {
                    b = a
                };
                d.setCallback = function(b) {
                    a = b
                }
            })();
            q.connection = d;
            q.Noun = function(a, b) {
                this.getName = function() {
                    return a
                };
                this.getData = function() {
                    return b
                }
            }
        })();
        qa.prototype.toJSON = function() {
            return {
                entityName: this.getEntityName(),
                saveToTranscript: this.getSaveTranscript(),
                showOnCreate: this.getShowOnCreate(),
                linkToEntityName: this.getLinkToEntityName(),
                linkToEntityField: this.getLinkToEntityField(),
                entityFieldsMaps: this.getEntityMapper().getEntityFieldsMaps()
            }
        };
        ra.prototype.map = function(a, b, c, e, d) {
            "undefined" == typeof c && (c = !0);
            "undefined" == typeof e && (e = !0);
            "undefined" == typeof d && (d = !0);
            this.getEntityFieldsMaps().push(new sa(a, b, c, e, d))
        };
        sa.prototype.toJSON = function() {
            return {
                fieldName: this.getFieldName(),
                label: this.getLabel(),
                doFind: this.getDoFind(),
                isExactMatch: this.getIsExactMatch(),
                doCreate: this.getDoCreate()
            }
        };
        var x = f.getCookie("liveagent_sid"),
            ba = f.getCookie("liveagent_chatted"),
            ta = !1,
            R = !1,
            k = {},
            ya = [],
            za = [],
            ea = null,
            ha = {},
            Q = null,
            ka = {},
            ca = !1,
            m = {
                url: null,
                deploymentId: null,
                orgId: null,
                pingRate: null,
                pingTimeout: 5E3,
                chatWindowWidth: 482,
                chatWindowHeight: 450,
                contentServerUrl: null,
                chatPage: "/s/chat",
                prechatHandler: "/s/prechatVisitor"
            };
        q.connection.messageHandler = function(a, b) {
            switch (a) {
                case "VisitorId":
                    b.sessionId && (f.log("Received new session ID"), x = b.sessionId, document.cookie = "liveagent_sid\x3d" + encodeURIComponent(x) + ";path\x3d/;", null != v.getVisitCount() && v.setVisitCount(v.getVisitCount() + 1), v.getPermanentId() || v.setPermanentId(x));
                    break;
                case "Settings":
                    B.init();
                    f.log("Ping rate set to " + b.pingRate + "ms");
                    m.pingRate = b.pingRate;
                    m.contentServerUrl = b.contentServerUrl;
                    m.prefixKey = b.prefixKey;
                    for (var c = 0; c < b.buttons.length; c++) switch (b.buttons[c].type) {
                        case "ToAgent":
                        case "Standard":
                            var e = b.buttons[c],
                                d = k[e.id];
                            d && wa(d, e);
                            break;
                        case "Invite":
                            var e = b.buttons[c],
                                g = null,
                                g = e.inviteImageUrl ? Ca(e.id, e.inviteImageUrl, e.inviteImageWidth, e.inviteImageHeight) : document.getElementById("liveagent_invite_button_" + e.id);
                            null == g ? fa("Warning: Button " + e.id + " disabled because HTML element was not found") :
                                (d = u(e.id), d.addTracker(new A(e.id, g, e.inviteRenderer, e.inviteStartPosition, e.inviteEndPosition, e.hasInviteAfterAccept, e.hasInviteAfterReject, e.inviteRejectTime)), g = f.jsonDecode(e.inviteRules), d.setRules(g.rules, g.filter), wa(d, e))
                    }
                    break;
                case "Availability":
                    c = {};
                    for (e = 0; e < b.results.length; e++)(d = k[b.results[e].id]) && (c[b.results[e].id] = {
                        button: d,
                        isAvailable: b.results[e].isAvailable
                    });
                    null != G && c.hasOwnProperty(G) && (c[G].button.setOnlineState(c[G].isAvailable), delete c[G]);
                    for (g in c) c.hasOwnProperty(g) &&
                        c[g].button.setOnlineState(c[g].isAvailable);
                    break;
                case q.VisitorMessage.WARNING:
                    fa(b.text);
                    break;
                case q.VisitorMessage.ERROR:
                    Aa(b.text);
                    break;
                case q.SystemMessage.SWITCH_SERVER:
                    c = b.newUrl;
                    if ("string" === typeof c) m.url = c, f.log("Received updated LiveAgent server url: " + c + "! Consider updating this site's deployment code.");
                    else throw Error("Trying to set invalid LiveAgent server url: " + c);
                    ca = !0
            }
        };
        q.connection.onSuccess = function() {
            null !== Q && clearTimeout(Q);
            Q = window.setTimeout(Da, m.pingRate)
        };
        q.connection.onError =
            function(a) {
                Aa(a)
            }
    }
})();
/*
 Copyright (c) 2011 jqWidgets.
 http://jqwidgets.com/license/
 */

(function(a) {
	a.jqx = a.jqx || {};
	a.jqx.define = function(b, c, d) {
		b[c] = function() {
			if(this.baseType) {
				this.base = new b[this.baseType]();
				this.base.defineInstance()
			}
			this.defineInstance()
		};
		b[c].prototype.defineInstance = function() {
		};
		b[c].prototype.base = null;
		b[c].prototype.baseType = undefined;
		if(d && b[d]) {
			b[c].prototype.baseType = d
		}
	};
	a.jqx.invoke = function(d, c) {
		if(c.length == 0) {
			return
		}
		var e = typeof (c) == Array || c.length > 0 ? c[0] : c;
		var b = typeof (c) == Array || c.length > 1 ? Array.prototype.slice.call(c, 1) : a({}).toArray();
		while(d[e] == undefined && d.base != null) {
			d = d.base
		}
		if(d[e] != undefined && a.isFunction(d[e])) {
			return d[e].apply(d, b)
		}
		return
	};
	a.jqx.hasFunction = function(d, c) {
		if(c.length == 0) {
			return false
		}
		if(d == undefined) {
			return false
		}
		var e = typeof (c) == Array || c.length > 0 ? c[0] : c;
		var b = typeof (c) == Array || c.length > 1 ? Array.prototype.slice.call(c, 1) : {};
		while(d[e] == undefined && d.base != null) {
			d = d.base
		}
		if(d[e] && a.isFunction(d[e])) {
			return true
		}
		return false
	};
	a.jqx.isPropertySetter = function(b) {
		if(b.length == 2) {
			return true
		}
		return b.length == 1 && typeof (b[0]) == "object"
	};
	a.jqx.set = function(c, b) {
		if(b.length == 1 && typeof (b[0]) == "object") {
			a.each(b[0], function(d, e) {
				var f = c;
				while(f[d] == undefined && f.base != null) {
					f = f.base
				}
				if(f[d] != undefined || f[d] == null) {
					a.jqx.setvalueraiseevent(f, d, e)
				}
			})
		} else {
			if(b.length == 2) {
				while(c[b[0]] == undefined && c.base) {
					c = c.base
				}
				if(c[b[0]] != undefined || c[b[0]] == null) {
					a.jqx.setvalueraiseevent(c, b[0], b[1])
				}
			}
		}
	};
	a.jqx.setvalueraiseevent = function(c, d, e) {
		var b = c[d];
		c[d] = e;
		if(!c.isInitialized) {
			return
		}
		if(c.propertyChangedHandler != undefined) {
			c.propertyChangedHandler(c, d, b, e)
		}
		if(c.propertyChangeMap != undefined && c.propertyChangeMap[d] != undefined) {c.propertyChangeMap[d](c, d, b, e)
		}
	};
	a.jqx.get = function(c, b) {
		if(b == undefined || b == null) {
			return undefined
		}
		if(c[b] != undefined) {
			return c[b]
		}
		if(b.length != 1) {
			return undefined
		}
		while(c[b[0]] == undefined && c.base) {
			c = c.base
		}
		if(c[b[0]] != undefined) {
			return c[b[0]]
		}
	};
	a.jqx.jqxWidgetProxy = function(h, c, b) {
		var d = a(c);
		var f = a.data(c, h);
		if(f == undefined) {
			return undefined
		}
		var e = f.instance;
		if(a.jqx.hasFunction(e, b)) {
			return a.jqx.invoke(e, b)
		}
		if(a.jqx.isPropertySetter(b)) {
			a.jqx.set(e, b);
			return undefined
		} else {
			if( typeof (b) == "object" && b.length == 0) {
				return
			} else {
				if( typeof (b) == "object" && b.length > 0) {
					return a.jqx.get(e, b[0])
				} else {
					if( typeof (b) == "string") {
						return a.jqx.get(e, b)
					}
				}
			}
		}
		throw "jqxCore: Property or method does not exist.";
		return undefined
	};
	a.jqx.jqxWidget = function(b, c, i) {
		try {
			jqxArgs = Array.prototype.slice.call(i, 0)
		} catch(h) {
			jqxArgs = ""
		}
		var f = b;
		var d = "";
		if(c) {
			d = "_" + c
		}
		a.jqx.define(a.jqx, "_" + f, d);
		a.fn[f] = function() {
			var e = Array.prototype.slice.call(arguments, 0);
			var j = null;
			if(e.length == 0 || (e.length == 1 && typeof (e[0]) == "object")) {
				return this.each(function() {
					var n = a(this);
					var m = this;
					var p = a.data(m, f);
					if(p == null) {
						p = {};
						p.element = m;
						p.host = n;
						p.instance = new a.jqx["_"+f]();
						a.data(m, f, p);
						var o = new Array();
						var k = p.instance;
						while(k) {
							k.isInitialized = false;
							o.push(k);
							k = k.base
						}
						o.reverse();
						o[0].theme = "";
						a.jqx.jqxWidgetProxy(f, this, e);
						for(var l in o) {
							k = o[l];
							if(l == 0) {
								k.host = n;
								k.element = m
							}
							if(k.createInstance != null) {
								k.createInstance(e)
							}
						}
						for(var l in o) {
							o[l].isInitialized = true
						}
						p.instance.refresh();
						j = this
					} else {
						a.jqx.jqxWidgetProxy(f, this, e)
					}
				})
			} else {
				this.each(function() {
					var k = a.jqx.jqxWidgetProxy(f, this, e);
					if(j == null) {
						j = k
					}
				})
			}
			if(a.browser.msie && a.browser.version < 7) {
				a.jqx.utilities.correctPNG()
			}
			return j
		};
		try {
			a.extend(a.jqx["_" + f].prototype, Array.prototype.slice.call(i,0)[0])
		} catch(h) {
		}
		a.extend(a.jqx["_" + f].prototype, {
			toThemeProperty : function(e, j) {
				if(this.theme == "") {
					return e
				}
				if(j != null && j) {
					return e + "-" + this.theme
				}
				return e + " " + e + "-" + this.theme
			}
		});
		a.jqx["_" + f].prototype.refresh = function() {
			if(this.base) {
				this.base.refresh()
			}
		};
		a.jqx["_" + f].prototype.createInstance = function() {
		};
		a.jqx["_" + f].prototype.propertyChangeMap = {};
		a.jqx["_" + f].prototype.addHandler = function(l, j, e, k) {
			switch(j) {
				case"mousewheel":
					if(window.addEventListener) {
						if(a.browser.mozilla) {
							l[0].addEventListener("DOMMouseScroll", e, false)
						} else {
							l[0].addEventListener("mousewheel", e, false)
						}
						return false
					}
					break
			}
			if(k == undefined || k == null) {
				l.bind(j, e)
			} else {
				l.bind(j, k, e)
			}
		};
		a.jqx["_" + f].prototype.removeHandler = function(k, j, e) {
			switch(j) {
				case"mousewheel":
					if(window.removeEventListener) {
						if(a.browser.mozilla) {
							k[0].removeEventListener("DOMMouseScroll", e, false)
						} else {
							k[0].removeEventListener("mousewheel", e, false)
						}
						return false
					}
					break
			}
			if(e == undefined) {
				k.unbind(j)
			} else {
				k.unbind(j, e)
			}
		}
	};
	a.jqx.utilities = a.jqx.utilities || {};
	a.extend(a.jqx.utilities, {
		correctPNG : function() {
			var h = navigator.appVersion.split("MSIE");
			var j = parseFloat(h[1]);
			if((j >= 5.5 && j < 7) && (document.body.filters)) {
				for(var d = 0; d < document.images.length; d++) {
					var e = document.images[d];
					var l = e.src.toUpperCase();
					if(l.substring(l.length - 3, l.length) == "PNG") {
						var f = (e.id) ? "id='" + e.id + "' " : "";
						var m = (e.className) ? "class='" + e.className + "' " : "";
						var c = (e.title) ? "title='" + e.title + "' " : "title='" + e.alt + "' ";
						var k = "display:inline-block;" + e.style.cssText;
						if(e.align == "left") {
							k = "float:left;" + k
						}
						if(e.align == "right") {
							k = "float:right;" + k
						}
						if(e.parentElement.href) {
							k = "cursor:hand;" + k
						}
						var b = "<span " + f + m + c + ' style="width:' + e.width + "px; height:" + e.height + "px;" + k + ";filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + e.src + "', sizingMethod='scale');\"></span>";
						e.outerHTML = b;
						d = d - 1
					}
				}
			}
		},
		alphaBlend : function(f, d, h) {
			var e = Array(parseInt("0x" + f.substring(1, 3)), parseInt("0x" + f.substring(3, 5)), parseInt("0x" + f.substring(5, 7)));
			var c = Array(parseInt("0x" + d.substring(1, 3)), parseInt("0x" + d.substring(3, 5)), parseInt("0x" + d.substring(5, 7)));
			r = "0" + Math.round(e[0] + (c[0] - e[0]) * h).toString(16);
			g = "0" + Math.round(e[1] + (c[1] - e[1]) * h).toString(16);
			d = "0" + Math.round(e[2] + (c[2] - e[2]) * h).toString(16);
			return "#" + r.substring(r.length - 2) + g.substring(g.length - 2) + d.substring(d.length - 2)
		}
	});
	a.jqx.mobile = a.jqx.mobile || {};
	a.extend(a.jqx.mobile, {
		isTouchDevice : function() {
			var b = "Browser CodeName: " + navigator.appCodeName + "";
			b += "Browser Name: " + navigator.appName + "";
			b += "Browser Version: " + navigator.appVersion + "";
			b += "Cookies Enabled: " + navigator.cookieEnabled + "";
			b += "Platform: " + navigator.platform + "";
			b += "User-agent header: " + navigator.userAgent + "";
			if(b.indexOf("Android") != -1) {
				return true
			}
			if(b.indexOf("IEMobile") != -1) {
				return true
			}
			if(b.indexOf("Windows Phone OS") != -1) {
				return true
			}
			if(b.indexOf("Windows Phone 6.5") != -1) {
				return true
			}
			if(b.indexOf("BlackBerry") != -1 && b.indexOf("Mobile Safari") != -1) {
				return true
			}
			if(b.indexOf("ipod") != -1) {
				return true
			}
			if(b.indexOf("nokia") != -1 || b.indexOf("Nokia") != -1) {
				return true
			}
			try {
				document.createEvent("TouchEvent");
				return true
			} catch(c) {
				return false
			}
		},
		isChromeMobileBrowser : function() {
			var c = navigator.userAgent.toLowerCase();
			var b = c.indexOf("android") != -1;
			return b
		},
		isOperaMiniMobileBrowser : function() {
			var c = navigator.userAgent.toLowerCase();
			var b = c.indexOf("opera mini") != -1 || c.indexOf("opera mobi") != -1;
			return b
		},
		isOperaMiniBrowser : function() {
			var c = navigator.userAgent.toLowerCase();
			var b = c.indexOf("opera mini") != -1;
			return b
		},
		isSafariMobileBrowser : function() {
			var c = navigator.userAgent.toLowerCase();
			var b = c.indexOf("ipad") != -1 || c.indexOf("iphone") != -1 || c.indexOf("ipod") != -1;
			return b
		},
		isIPhoneSafariMobileBrowser : function() {
			var c = navigator.userAgent.toLowerCase();
			var b = c.indexOf("iphone") != -1;
			return b
		},
		isIPadSafariMobileBrowser : function() {
			var c = navigator.userAgent.toLowerCase();
			var b = c.indexOf("ipad") != -1;
			return b
		},
		isMobileBrowser : function() {
			var c = navigator.userAgent.toLowerCase();
			var b = c.indexOf("ipad") != -1 || c.indexOf("iphone") != -1 || c.indexOf("android") != -1;
			return b
		},
		getTouches : function(b) {
			if(b.originalEvent) {
				if(b.originalEvent.touches && b.originalEvent.touches.length) {
					return b.originalEvent.touches
				} else {
					if(b.originalEvent.changedTouches && b.originalEvent.changedTouches.length) {
						return b.originalEvent.changedTouches
					}
				}
			}
			return b.touches
		},
		dispatchMouseEvent : function(b, f, d) {
			var c = document.createEvent("MouseEvent");
			c.initMouseEvent(b, true, true, f.view, 1, f.screenX, f.screenY, f.clientX, f.clientY, false, false, false, false, 0, null);
			d.dispatchEvent(c)
		},
		getRootNode : function(b) {
			while(b.nodeType !== 1) {
				b = b.parentNode
			}
			return b
		},
		touchScroll : function(f, t, s, b) {
			if(f == null) {
				return
			}
			var j = this;
			var l = 0;
			var n = 0;
			var d = 0;
			var m = 0;
			var q = 0;
			var e = 0;
			var i = false;
			var k = false;
			var p = a(f);
			var h = ["select", "input", "textarea"];
			var c = 0;
			var o = 0;
			p.bind("touchstart.touchScroll", function(u) {
				if(a.inArray(u.target.tagName.toLowerCase(), h) !== -1) {
					return
				}
				u.preventDefault();
				u.stopPropagation();
				var v = j.getTouches(u)[0];
				j.dispatchMouseEvent("mousedown", v, j.getRootNode(v.target));
				i = true;
				k = false;
				n = v.pageY;
				q = v.pageX;
				l = 0;
				m = 0
			});
			p.bind("touchmove.touchScroll", function(w) {
				if(!i) {
					return
				}
				var u = j.getTouches(w)[0].pageY - n;
				var v = j.getTouches(w)[0].pageX - q;
				o = j.getTouches(w)[0].pageY;
				touchHorizontalEnd = j.getTouches(w)[0].pageX;
				d = u - l;
				e = v - m;
				k = true;
				l = u;
				m = v;
				s(-e * 3, -d * 3)
			});
			p.bind("touchend.touchScroll touchcancel.touchScroll", function(u) {
				if(!i) {
					return
				}
				i = false;
				if(k) {
					j.dispatchMouseEvent("mouseup", w, v)
				} else {
					var w = j.getTouches(u)[0], v = j.getRootNode(w.target);
					j.dispatchMouseEvent("mouseup", w, v);
					j.dispatchMouseEvent("click", w, v)
				}
			})
		}
	});
	a.jqx.string = a.jqx.string || {};
	a.extend(a.jqx.string, {
		contains : function(b, c) {
			if(b == null || c == null) {
				return false
			}
			return b.indexOf(c) != -1
		},
		containsIgnoreCase : function(b, c) {
			if(b == null || c == null) {
				return false
			}
			return b.toUpperCase().indexOf(c.toUpperCase()) != -1
		},
		equals : function(b, c) {
			if(b == null || c == null) {
				return false
			}
			b = this.normalize(b);
			if(c.length == b.length) {
				return b.slice(0, c.length) == c
			}
			return false
		},
		equalsIgnoreCase : function(b, c) {
			if(b == null || c == null) {
				return false
			}
			b = this.normalize(b);
			if(c.length == b.length) {
				return b.toUpperCase().slice(0, c.length) == c.toUpperCase()
			}
			return false
		},
		startsWith : function(b, c) {
			if(b == null || c == null) {
				return false
			}
			return b.slice(0, c.length) == c
		},
		startsWithIgnoreCase : function(b, c) {
			if(b == null || c == null) {
				return false
			}
			return b.toUpperCase().slice(0, c.length) == c.toUpperCase()
		},
		normalize : function(b) {
			if(b.charCodeAt(b.length - 1) == 65279) {
				b = b.substring(0, b.length - 1)
			}
			return b
		},
		endsWith : function(b, c) {
			if(b == null || c == null) {
				return false
			}
			b = this.normalize(b);
			return b.slice(-c.length) == c
		},
		endsWithIgnoreCase : function(b, c) {
			if(b == null || c == null) {
				return false
			}
			b = this.normalize(b);
			return b.toUpperCase().slice(-c.length) == c.toUpperCase()
		}
	});
	a.extend(jQuery.easing, {
		easeOutBack : function(f, h, e, k, j, i) {
			if(i == undefined) {
				i = 1.70158
			}
			return k * (( h = h / j - 1) * h * ((i + 1) * h + i) + 1) + e
		},
		easeInQuad : function(f, h, e, j, i) {
			return j * (h /= i) * h + e
		},
		easeInOutCirc : function(f, h, e, j, i) {
			if((h /= i / 2) < 1) {
				return -j / 2 * (Math.sqrt(1 - h * h) - 1) + e
			}
			return j / 2 * (Math.sqrt(1 - (h -= 2) * h) + 1) + e
		},
		easeInOutSine : function(f, h, e, j, i) {
			return -j / 2 * (Math.cos(Math.PI * h / i) - 1) + e
		}
	})
})(jQuery);

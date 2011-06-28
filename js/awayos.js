(function() {
	var root = this;

	root.away = {};

	function AWindow(options){
		if (typeof options == "undefined" ) return ;
		this._id = options.id;
		this._os = options.os;
		this._app = options.app;
		/* Window Title */
		this._title = (options.title == null?"A Window":options.title);
		/* Window Level */
		this._level = (options.level == null?3:options.level);
		if (this._level > 5) this._level = 5;
		if (this._level < 1) this._level = 1;
		this._zindex = this._level * 10000000 - 1;

		/* Window Width,Height,Top,Left */
		this._content = (options.content == null?"":options.content);
		this._width = (options.width == null?400:options.width);
		this._height = (options.height == null?300:options.height);
		this._minwidth = (options.minwidth == null?100:options.minwidth);
		this._minheight = (options.minheight == null?100:options.minheight);
		this._top = (options.top == null?20:options.top);
		this._left = (options.left == null?50:options.left);
		this._windowstyle = "normal";

		this._parent = (typeof options.parent != "object"?this._os._osdiv:options.parent);

		/* Window Title Button */
		this._closebutton = (typeof options.closebutton == "boolean"?options.closebutton:true);
		this._minimizebutton = (typeof options.minimizebutton == "boolean"?options.minimizebutton:true);
		this._maximizebutton = (typeof options.maximizebutton == "boolean"?options.maximizebutton:true);

		/* Dialog */
		this._isDialog = (options.isdialog == null?false:options.isdialog);

		/* Drag Vars */
		this._mouseX = 0;
		this._mouseY = 0;
		this._windowX = 0;
		this._windowY = 0;
		this._lastHeight = 0;
		this._lastWidth = 0;

		/* Some */
		/* Window Can Resize */
		this._resize = (typeof options.resize == 'boolean'?options.resize:true);
		/* Blot Window when Window is unforce */
		this._blotunforce = (typeof options.blotunforce == 'boolean'?options.blotunforce:false);
		/* Show Window on TaskBar */
		this._showontaskbar = (typeof options.showontaskbar == 'boolean'?options.showontaskbar:true);
		/* Window Force status */
		this._forcestatus = false;
		/* Window Url */
		this._url = options.url;
		/* ScrollBar */
		this._scrollbar = (typeof options.scrollbar == 'boolean'?options.scrollbar:true)

		/* DOMs */
		this._contentblotDiv = document.createElement('div');
		this._windowBorderDiv = document.createElement('div');
		this._windowDiv = document.createElement('div');
		this._titlebarDiv = document.createElement('div');
		this._titleDiv = document.createElement('div');
		this._closeButtonDiv = document.createElement('div');
		this._minimizeButtonDiv = document.createElement('div');
		this._maximizeButtonDiv = document.createElement('div');
		this._contentDiv = document.createElement('div');
		this._contentiframeDiv = document.createElement('iframe');
		this._sizeDiv = document.createElement('div');


		if (typeof AWindow._initialized == "undefined"){
			/* options Title */
			AWindow.prototype.setTitle = function (mytitle){
				this._title = mytitle;
				this._titleDiv.innerHTML = mytitle;
			};

			AWindow.prototype.getTitle = function (){
				return this._title;
			}

			AWindow.prototype.getTitlebarDOM = function (){
				return this._titlebarDiv;
			}

			AWindow.prototype.getTitleDOM = function (){
				return this._titleDiv;
			}

			/* options Content */
			AWindow.prototype.setContent = function (content){
				this._content = content;
				this._contentDiv.innerHTML = content;
			};

			AWindow.prototype.getContent = function (){
				return this._content;
			}

			AWindow.prototype.getContentDOM = function (){
				return this._contentDiv;
			}

			/* options Width,Height,Top,Left */
			AWindow.prototype.setWidth = function (width){
				this._width = width;
			};

			AWindow.prototype.getWidth = function (){
				return this._width;
			}

			AWindow.prototype.setHeight = function (height){
				this._height = height;
			};

			AWindow.prototype.getHeight = function (){
				return this._height;
			}

			AWindow.prototype.setTop = function (top){
				this._top = top;
			};

			AWindow.prototype.getTop = function (){
				return this._top;
			}

			AWindow.prototype.setLeft = function (left){
				this._left = left;
			};

			AWindow.prototype.getLeft = function (){
				return this._left;
			}

			AWindow.prototype.setMinWidth = function(minwidth){
				this._minwidth = minwidth;
			}

			AWindow.prototype.getMinWidth = function(){
				return this._minwidth;
			}

			AWindow.prototype.setMinHeight = function(minheight){
				this._minheight = minheight;
			}

			AWindow.prototype.getMinHeight = function(){
				return this._minwidth;
			}

			AWindow.prototype.getParent = function (){
				return this._parent;
			}

			AWindow.prototype.getIsDialog = function (){
				return this._isDialog;
			}

			AWindow.prototype.setIsDialog = function (dialog){
				this._isDialog = dialog;
			}

			AWindow.prototype.setZIndex = function (){
				this._windowBorderDiv.style.zIndex = this._zindex;
			}

			AWindow.prototype.setURL = function (url){
				if (typeof url != "string") return;
				this._url = url;
				if (typeof url == "string" && aWindow._url != ""){
					this._contentiframeDiv.src = url;
					if (this._contentiframeDiv.parentNode == null){
						this._contentDiv.appendChild(this._contentiframeDiv);
					}
				}else{
					if (this._contentiframeDiv.parentNode == this._contentDiv){
						this._contentDiv.removeChild(this._contentiframeDiv);
					}
				}
			}

			AWindow.prototype.getURL = function (){
				return this._url;
			}

			AWindow.prototype.setResize = function(canresize){
				this._resize = canresize;
				if (canresize){
					this._sizediv.className = "AWindowCanResize";
				}else{
					this._sizediv.className = "AWindowCannotResize";
				}
			}

			AWindow.prototype.getResize = function(){
				return this._resize;
			}

			AWindow.prototype.setBlotUnforce = function(blot){
				this._blotunforce = blot;
				if (this._forcestatus == false) setBlotStatus(blot);
			}

			AWindow.prototype.getBlotUnforce = function(){
				return this._blotunforce;
			}

			AWindow.prototype.setBlotStatus = function(status){
				if (status == true){
					this._contentblotDiv.style.display = "block";
				}else{
					this._contentblotDiv.style.display = "none";
				}
			}

			AWindow.prototype._Force = function(force){
				if (typeof force != "boolean") return;
				if (force == false){
					if (this._forcestatus == true){
						this.setBlotStatus(this._blotunforce);
						if (typeof this.onunforce == "function"){
							this.onunforce();
						}
					}
				}else{
					this.setBlotStatus(false);
					if (typeof this.onforce == "function"){
						this.onforce();
					}
				}
				this._forcestatus = force;
			}

			AWindow.prototype.free = function (){
				if (typeof this.onfree == "function"){
					this.onfree();
				}
				this._windowBorderDiv.parentNode.removeChild(this._windowBorderDiv);
				this._app.removeWindow(this);
			}

			AWindow.prototype.close = function (){
				if (typeof this.onclose == "function"){
					if (!this.onclose()) return;
				}
				this.free();
			}

			AWindow.prototype.maximize = function (){
				if (this._maximizebutton == false) return;
				if (this._windowstyle == "normal"){
					this.maximizef();
				}else {
					this.normal();
				}
			}

			AWindow.prototype.maximizef = function (){
				if (this.onmaximize)
					if (!this.onmaximize()) return;
				this.setForce();
				this._windowstyle = "maximized";
				this._windowBorderDiv.style.width = '100%';
				this._windowBorderDiv.style.height = '100%';
				this._windowBorderDiv.style.left = '0';
				this._windowBorderDiv.style.top = '0';
				this._maximizeButtonDiv.title = "还原";
				this._maximizeButtonDiv.className = "AWindowRestoreButton";
				this.show();
			}

			AWindow.prototype.normal = function (){
				if (this.onrestore)
					if (!this.onrestore()) return ;
				this.setForce();
				this._windowstyle = "normal";
				this._contentDiv.style.height = this._height - this._titlebarDiv.offsetHeight + 'px';
				this._contentblotDiv.style.height = this._contentDiv.style.height;
				this._windowBorderDiv.style.width = this._width + 'px';
				this._windowBorderDiv.style.height = this._height + 'px';
				this._windowBorderDiv.style.left = this._left + 'px';
				this._windowBorderDiv.style.top = this._top + 'px';
				this._maximizeButtonDiv.title = "最大化";
				this._maximizeButtonDiv.className = "AWindowMaximizeButton";
				this.show();
			}

			AWindow.prototype.minimize = function (){
				if (this._showontaskbar == false) return;
				this._laststyle = this._windowstyle;
				this._windowstyle = "minimized";
				this.hide();
			}

			AWindow.prototype.unminimize = function (){
				this._windowstyle = this._laststyle;
				this.show();
			}

			/* Show this Window */
			AWindow.prototype.show = function (){
				if (this._windowBorderDiv == null){
					this._windowBorderDiv = this.createWindow();
				}
				this._windowBorderDiv.style.display = "block";

				this._contentDiv.style.height = this._windowBorderDiv.clientHeight - this._titlebarDiv.offsetHeight + 'px';
				this._contentblotDiv.style.height = this._contentDiv.style.height;
				this._contentblotDiv.style.top = this._titlebarDiv.offsetHeight;
				this.setForce();
			};

			/* Hide this Window */
			AWindow.prototype.hide = function (){
				if (this._windowBorderDiv != null){
					this._windowBorderDiv.style.display = "none";
				}
			};

			/* Window hide status */
			AWindow.prototype.showing = function (){
				if (this._windowBorderDiv != null){
					if (this._windowBorderDiv.style.display == 'block') return true;
				}
				return false;
			}

			/* Set this window front */
			AWindow.prototype.setForce = function (){
				return this._os.setWindowForce(this);
			}

			/* Create a Window to body */
			AWindow.prototype.createWindow = function (){
				var aWindow = this;

				aWindow._windowBorderDiv.className = "AWindowBorder";
				aWindow._windowBorderDiv.style.display = "none";
				aWindow._windowBorderDiv.style.width = this._width + "px";
				aWindow._windowBorderDiv.style.height = this._height + "px";
				aWindow._windowBorderDiv.style.left = this._left + "px";
				aWindow._windowBorderDiv.style.top = this._top + "px";
				aWindow._windowBorderDiv.onmousedown = function(e){
					aWindow._os.setWindowForce(aWindow);
				}
				this._parent.appendChild(aWindow._windowBorderDiv);

				aWindow._windowDiv.className = "AWindow";
				aWindow._windowBorderDiv.appendChild(aWindow._windowDiv);

				aWindow._titlebarDiv.className = "AWindowTitleBar";
				aWindow._titlebarDiv.onmousedown = function(e){
					e = e || window.event;
					if (aWindow._windowstyle == 'normal'){
						aWindow._os.setWindowForce(aWindow);
						aWindow._mouseX = parseInt(e.clientX);
						aWindow._mouseY = parseInt(e.clientY);
						aWindow._windowX = parseInt(aWindow._windowBorderDiv.style.left);
						aWindow._windowY = parseInt(aWindow._windowBorderDiv.style.top);
						aWindow._windowBorderDiv.style.zIndex = 2147483581;
						aWindow.setBlotStatus(true);
						aWindow._os._dragDiv.style.display = "block";
						aWindow._os.setDragMouseMove(function(e){
							e = e || window.event;
							var x,y,moveobj;
							moveobj = aWindow._windowBorderDiv;
							x = e.clientX - aWindow._mouseX + aWindow._windowX;
							y = e.clientY - aWindow._mouseY + aWindow._windowY;
							/*
							// Window overflow browser
							if (y < 0) y = 0;
							if (x < 0) x = 0;
							if (y > document.documentElement.clientHeight - aWindow._height)
								y = document.documentElement.clientHeight - aWindow._height;
							if (x > document.documentElement.clientWidth - aWindow._width)
								x = document.documentElement.clientWidth - aWindow._width;
							*/
							var desktopheight = aWindow._os._osdiv.clientHeight - aWindow._os._taskbar._taskbardiv.clientHeight;
							if (y > desktopheight - aWindow._titlebarDiv.clientHeight){
								y = desktopheight - aWindow._titlebarDiv.clientHeight;
							}
							moveobj.style.left = x + "px";
							moveobj.style.top = y + "px";
							aWindow._left = x;
							aWindow._top = y;
							return false;
						});
						aWindow._os.setDragMouseUp(function(e){
							e = e || window.event;
							aWindow._os._dragDiv.style.display = "none";
							aWindow._os.setDragMouseMove(null);
							aWindow._os.setDragMouseUp(null);
							moveobj = aWindow._windowBorderDiv;
							aWindow.setZIndex();
							aWindow.setBlotStatus(false);
						});
					}
					return false;
				}
				aWindow._titlebarDiv.ondblclick = function(){
					aWindow.maximize();
				}

				aWindow._titleDiv.className = "AWindowTitle";
				aWindow._titleDiv.innerHTML = this._title;
				aWindow._titlebarDiv.appendChild(aWindow._titleDiv);


				aWindow._closeButtonDiv.className = "AWindowCloseButton";
				aWindow._closeButtonDiv.title = "关闭";
				aWindow._closeButtonDiv.onclick = function(){
					aWindow.close();
				}
				aWindow._titlebarDiv.appendChild(aWindow._closeButtonDiv);
				if (aWindow._closebutton == false)
					aWindow._closeButtonDiv.style.display = "none";


				aWindow._minimizeButtonDiv.className = "AWindowMinimizeButton";
				aWindow._minimizeButtonDiv.title = "最小化";
				aWindow._minimizeButtonDiv.onclick = function() {
					aWindow.minimize();
				}
				aWindow._titlebarDiv.appendChild(aWindow._minimizeButtonDiv);
				if (aWindow._showontaskbar == false || aWindow._minimizebutton == false)
					aWindow._minimizeButtonDiv.style.display = "none";


				aWindow._maximizeButtonDiv.className = "AWindowMaximizeButton";
				aWindow._maximizeButtonDiv.title = "最大化";
				aWindow._maximizeButtonDiv.onclick = function() {
					aWindow.maximize();
				}
				aWindow._titlebarDiv.appendChild(aWindow._maximizeButtonDiv);
				if (aWindow._maximizebutton == false)
					aWindow._maximizeButtonDiv.style.display = "none";

				aWindow._windowDiv.appendChild(aWindow._titlebarDiv);


				aWindow._contentDiv.className = "AWindowContent";
				aWindow._contentDiv.innerHTML = this._content;
				aWindow._windowDiv.appendChild(aWindow._contentDiv);

				aWindow._contentiframeDiv.width = '100%';
				aWindow._contentiframeDiv.height = '100%';
				aWindow._contentiframeDiv.frameBorder = '0';
				aWindow._contentiframeDiv.setAttribute("allowtransparency", 'yes');
				if (typeof aWindow._url == "string" && aWindow._url != ""){
					aWindow._contentiframeDiv.src = aWindow._url;
					aWindow._contentDiv.appendChild(aWindow._contentiframeDiv);
				}
				if (aWindow._scrollbar == false){
					aWindow._contentiframeDiv.setAttribute("scrolling", "no");
					aWindow._contentiframeDiv.Scrolling = 'no';
				}

				aWindow._contentblotDiv.className = "AWindowContentBlot";
				aWindow._contentblotDiv.style.display = "none";
				aWindow._contentblotDiv.style.zIndex = 1;
				aWindow._windowDiv.appendChild(aWindow._contentblotDiv);


				if (this._resize) aWindow._sizeDiv.className = "AWindowCanResize";
				else aWindow._sizeDiv.className = "AWindowCannotResize";
				aWindow._sizeDiv.onmousedown = function(e) {
					e = e || window.event;
					if (aWindow._windowstyle == 'normal'){
						aWindow._os.setWindowForce(aWindow);
						aWindow._mouseX = parseInt(e.clientX);
						aWindow._mouseY = parseInt(e.clientY);
						aWindow._lastHeight = parseInt(aWindow._windowBorderDiv.style.height);
						aWindow._lastWidth = parseInt(aWindow._windowBorderDiv.style.width);
						aWindow._os._dragType = 'WindowResize';
						aWindow._os._dragObj = aWindow;
						aWindow._os._dragDiv.style.display = "block";
						aWindow._os.setDragMouseMove(function(e){
							e = e || window.event;
							var x,y,moveobj;
							moveobj = aWindow._windowBorderDiv;
							x = e.clientX - aWindow._mouseX + aWindow._lastWidth;
							y = e.clientY - aWindow._mouseY + aWindow._lastHeight;
							if (x < aWindow._minwidth) x = aWindow._minwidth;
							if (y < aWindow._minheight) y = aWindow._minheight;
							aWindow._contentDiv.style.height = (y - aWindow._titlebarDiv.offsetHeight) + 'px';
							aWindow._contentblotDiv.style.height = aWindow._contentDiv.style.height;
							moveobj.style.width = x + "px";
							moveobj.style.height = y + "px";
							aWindow._width = x;
							aWindow._height = y;
							return false;
						});
						aWindow._os.setDragMouseUp(function(e){
							e = e || window.event;
							aWindow._os._dragDiv.style.display = "none";
							aWindow._os.setDragMouseMove(null);
							aWindow._os.setDragMouseUp(null);
						});
					}
					return false;
				}
				aWindow._windowDiv.appendChild(aWindow._sizeDiv);

				return aWindow._windowDiv;
			};

			AWindow._initialized = true;
		}
		this.createWindow();
	}

	function AHandleManager() {
		this._handles = array();
		this._index = 0;


		if (typeof AHandleManager._initialized == "undefined") {

			AHandleManager.prototype.getNewHandle = function () {
				this._index ++;
				this._handles.push(this._index);
				return this._index;
			}

			AHandleManager.prototype.removeHandle = function (handle) {
				for (var i = 0; i < this._handles.length; i ++){
					if (this._handles[i] == handle){
						this._handles.splice(i, 1);
						break;
					}
				}
			}


			AHandleManager._initialized = true;
		}
	}

	function AWindowManager(options) {
		this._windows = [];
		this._os = options.os;
		this._levels = new Array(1,10000001,20000001,30000001,40000001,50000001);


		if (typeof AWindowManager._initialized == "undefined"){

			AWindowManager.prototype.getNewHandle = function (){
				return this._os.getNewHandle();
			}

			AWindowManager.prototype.getNewWindow = function (options){
				options.id = this.getNewHandle();
				options.os = this._os;
				var awindow = new AWindow(options);
				this._windows.push(awindow);
				if (typeof this.onNew == "function"){
					this.onNew(awindow);
				}
				return awindow;
			}

			AWindowManager.prototype.setForce = function (awindow){
				var level = awindow._level;
				if (this._levels[level] - 1 == awindow._zindex ) return;
				/* prevent flood */
				if (this._levels[level] >= (level + 1) * 10000000) this._levels[level] = level * 10000000 + 1;

				var zindex = this._levels[level]++;
				awindow._zindex = zindex;
				awindow.setZIndex();
				awindow._Force(true);

				var len = this._windows.length;
				for (var i = 0; i < len; ++i){
					if (this._windows[i] != awindow){
						this._windows[i]._Force(false);
					}
				}
			}

			AWindowManager.prototype.removeWindow = function (awindow){
				if (typeof this.onRemove == "function"){
					this.onRemove(awindow);
				}
				this._windows.remove(awindow);
				delete awindow;
			}


			AWindowManager._initialized = true;
		}

	}

	function AHandleManager(options){
		this._os = options.os;

		this._lastid = 1000;
		this._systemlastid = 1;
		this._ids = [];

		if (typeof AHandleManager._initialized == "undefined"){
			/* get a new handle */
			AHandleManager.prototype.getNewHandle = function (){
				this._ids.push(this._lastid);
				return this._lastid++;
			}

			AHandleManager.prototype.getNewSystemHandle = function (){
				this._ids.push(this._systemlastid);
				return this._systemlastid++;
			}

			AHandleManager._initialized = true;
		}
	}

	function AApplicationManager(options){
		this._os = options.os;

		/* Register App {sid:sid,app:app} */
		this._apps = [];

		/* Running App {pid:pid,app:app} */
		this._running = [];

		this._lastpid = 1025;
		this._lastsystempid = 1;

		if (typeof AApplicationManager._initialized == "undefined"){
			/* Create New Application */
			AApplicationManager.prototype.createProcess = function(params) {
				var app = this.getApplicationBySid(params.sid);
				if (typeof app != 'function') return false;

				var pid = this.getPid(params.process);
				var ppid = (pid < 1025?1:params.process.pid);
				var handle = (pid < 1025?this._os.getNewSystemHandle():this._os.getNewHandle());
				var runapp = app({
					'pid':pid,
					'parentpid':ppid,
					'handle':handle,
					'params':params.params
				});
				this._running.push({
					'pid':pid,
					'app':runapp,
					'time':new Date().getTime()
				});
				runapp.run();
				return pid;
			}

			/* Found Register's Application by sid */
			AApplicationManager.prototype.getApplicationBySid = function(sid){
				var len = this._apps.length;
				var i = 0;
				for (i = 0; i < len; ++i){
					if (this._apps[i].sid == sid) return this._apps[i].app;
				}
				return null;
			}

			/* Get A New Pid */
			AApplicationManager.prototype.getPid = function(process) {
				if (process == this._os) return this._lastsystempid ++;
				else return this._lastpid ++;
			}

			/* Found Application By Pid */
			AApplicationManager.prototype.getApplicationByPid = function(pid) {
				var len = this._running.length;
				var i = 0;
				for (i = 0; i < len; ++i){
					if (this._running[i].pid == pid) return this._running[i].app;
				}
				return null;
			}

			/* Register An Application to System */
			AApplicationManager.prototype.registerApplication = function(application) {
				var sid = application({
					'register':true
				});
				if (typeof sid != 'string') return false;
				this._apps.push({
					'sid':sid,
					'app':application
				});
				return true;
			}

			/* UnRegister An Application to System */
			AApplicationManager.prototype.unRegisterApplication = function(application) {
				var sid = application({
					'register':true
				});
				if (typeof sid != 'string') return false;
				var len = this._apps.length;
				var i = 0;
				for (i = 0; i < len; ++i){
					if (this._apps[i].sid == sid) {
						this._apps.splice(i, 1);
						return true;
					}
				}
				return false;
			}

			/* Get Application List */
			AApplicationManager.prototype.getApplicationList = function(){
				var lst = [];
				var len = this._running.length;
				var i = 0;
				for (i = 0; i < len; ++i) lst.push({
					'pid':this._running[i].pid,
					'app':this._running[i].app,
					'time':this._running[i].time
				});
				return lst;
			}

			AApplicationManager.prototype.cleanApplicationByPid = function(pid){
				var len = this._running.length;
				var i = 0;
				for (i = 0; i < len; ++i){
					if (this._running[i].pid == pid) {
						if (this._running[i].app.getStatus() == 'end'){
							delete this._running[i].app;
							this._running.splice(i, 1);
						}
						return ;
					}
				}
			}

			/* Kill Application */
			AApplicationManager.prototype.killApplicationByPid = function(pid){
				var app = this.getApplicationByPid(pid);
				if (app){
					if (typeof app.free == 'function')
						app.free();
				}
				this.cleanApplicationByPid(pid);
			}

			/* Exit Application */
			AApplicationManager.prototype.exitApplicationByPid = function(pid){
				var app = this.getApplicationByPid(pid);
				if (app){
					if (typeof app.close == 'function')
						app.close();
				}
			}

			AApplicationManager._initialized = true;
		}
	}

	function AApplication(options) {
		if (!away._os) alert('Please init awayos');
		this._os = away._os;
		this._sid = null;
		this._windows = [];

		this.pid = options.pid;
		this.parentpid = options.parentpid;
		this.handle = options.handle;
		this.params = options.params;

		this._status = 'create';

		if (!this.pid){
			alert("Please Run At Normal!");
			return ;
		}

		if (typeof AApplication._initialized == "undefined"){
			AApplication.prototype.free = function(){
				var len = this._windows.length;
				for (var i = len - 1; i >= 0 ; --i){
					this._windows[i].free();
				}
				this._status = 'end';
				if (typeof this.onfree == "function"){
					this.onfree();
				}
				this._os.cleanApplicationByPid(this.pid);
			}

			AApplication.prototype.run = function(){
				if (typeof this.onbeforerun == "function"){
					if (!this.onbeforerun()) return;
				}
				this._status = 'run';
				if (typeof this.onrun == "function"){
					this.onrun();
				}
			}

			AApplication.prototype.getNewWindow = function (options){
				options.app = this;
				var window = this._os.getNewWindow(options);
				this._windows.push(window);
				return window;
			}

			AApplication.prototype.removeWindow = function (window){
				var index = this._windows.indexOf(window);
				this._windows.remove(window);
				this._os.removeWindow(window);
				if (index == 0) this.free();
			}

			AApplication.prototype.createProcess = function (options){
				options.process = this;
				this._os.createProcess(options);
			}

			AApplication.prototype.setStatus = function(status){
				this._status = status;
			}

			AApplication.prototype.getStatus = function(){
				return this._status;
			}

			AApplication._initialized = true;
		}
	}

	function AwayOS(options) {

		/* Init Div */
		this._osdiv = document.createElement('div');
		this._osdiv.className = "AwayOS";
		document.body.appendChild(this._osdiv);


		/* Create a Drag Div */
		this._dragDiv = document.createElement('div');
		this._dragDiv.className = "AwayDrag";
		this._osdiv.appendChild(this._dragDiv);

		var AOS = this;

		this._osdiv.onmousemove = function(e){

		}
		this._osdiv.onmouseup = function(e){

		}

		root.onresize = function(){

			if (AOS._desktop){
				AOS._desktop.setHeight(document.documentElement.clientHeight);
			}
		}

		if (typeof AwayOS._initialized == "undefined"){
			/* Get New Handle */
			AwayOS.prototype.getNewHandle = function (){
				return this._handlemanager.getNewHandle();
			}

			/* Get System Handle */
			AwayOS.prototype.getNewSystemHandle = function (){
				return this._handlemanager.getNewSystemHandle();
			}

			/* Get New Window */
			AwayOS.prototype.getNewWindow = function (options){
				options.parent = this._divname;
				return this._windowmanager.getNewWindow(options);
			}

			/* Set Window Force */
			AwayOS.prototype.setWindowForce = function (awindow){
				return this._windowmanager.setForce(awindow);
			}

			/* Close Window */
			AwayOS.prototype.removeWindow = function (awindow){
				return this._windowmanager.removeWindow(awindow);
			}

			/* Get System DOM */
			AwayOS.prototype.getSystemDOM = function(){
				return this._osdiv;
			}

			/* Register Application */
			AwayOS.prototype.registerApplication = function(app){
				return this._applicationmanager.registerApplication(app);
			}

			/* Create New Application */
			AwayOS.prototype.createProcess = function(params){
				return this._applicationmanager.createProcess(params);
			}

			/* Clean Application */
			AwayOS.prototype.cleanApplicationByPid = function(pid){
				return this._applicationmanager.cleanApplicationByPid(pid);
			}

			/* Set Dragger */
			AwayOS.prototype.setDragMouseDown = function(fun){
				this._osdiv.onmousedown = fun;
			}

			AwayOS.prototype.setDragMouseMove = function(fun){
				this._osdiv.onmousemove = fun;
			}

			AwayOS.prototype.setDragMouseUp = function(fun){
				this._osdiv.onmouseup = fun;
			}

			AwayOS._initialized = true;
		}


		/* Init Handle,Window */
		this._handlemanager = new AHandleManager({
			os:this
		});
		this._windowmanager = new AWindowManager({
			os:this
		});
		this._applicationmanager = new AApplicationManager({
			os:this
		});
		this._desktop = new ADesktop({
			os:this
		});
		this._taskbar = new ATaskBar({
			os:this
		});

	}

	function ADesktop(options){
		this._os = options.os;
		this._icons = [];

		this._handle = this._os.getNewSystemHandle();
		this._height = document.body.clientHeight;

		this._desktopbgdiv = document.createElement('div');
		this._desktopbgdiv.className = "AwayDesktopBackground";
		this._desktopbgdiv.style.height = this._height + 'px';
		this._os._osdiv.appendChild(this._desktopbgdiv);

		this._desktopdiv = document.createElement('div');
		this._desktopdiv.className = "AwayDesktop";
		this._desktopdiv.style.height = this._height + 'px';
		this._os._osdiv.appendChild(this._desktopdiv);



		if (typeof ADesktop._initialized == "undefined"){

			/* Set Desktop Height */
			ADesktop.prototype.setHeight = function(height){
				this._height = height;
				this._desktopbgdiv.style.height = height + 'px';
				this._desktopdiv.style.height = height + 'px';
			}

			/* Get Desktop DOM */
			ADesktop.prototype.getDesktopDOM = function(){
				return this._desktopdiv;
			}

			/* Add Icon */
			ADesktop.prototype.addIcon = function(icon){
				this._icons.put(icon);
			}

			/* Add Icons */
			ADesktop.prototype.addIcons = function(icons){
				var len = icons.length;
				for (var i = 0; i < len; ++i){
					this.addIcon(icons[i]);
				}
			}

			ADesktop._initialized = true;
		}
	}

	function ADesktopIcon(){
		this.name = '';
		this.icon = '';
		this.title = '';
		this.action = '';
		this.target = '';
		this.params = '';
	}

	function ATaskManager(options){
		this._os = options.os;
		this._parent = options.parent;
		this._taskpaneldiv = options.taskpaneldiv;

		this._windows = [];
		this._divs = [];

		var ataskmanager = this;

		this._os._windowmanager.onNew = function(window){
			if (window._showontaskbar) ataskmanager._windows.push(window);
			ataskmanager.refresh();
		}

		this._os._windowmanager.onRemove = function(window){
			ataskmanager._windows.remove(window);
			ataskmanager.refresh();
		}

		if (typeof ATaskManager._initialized == "undefined"){
			ATaskManager.prototype.refresh = function(){
				var len = this._divs.length, i;
				for (i = 0; i < len; ++i){
					this._divs[i].parentNode.removeChild(this._divs[i]);
				}
				this._divs = [];

				len = this._windows.length;
				if (len <= 0) return;
				var totalWidth = this._taskpaneldiv.clientWidth;
				var width = totalWidth / len;
				if (width > 100) width = 100;
				for (i = 0; i < len; ++i){
					var paneldiv = document.createElement('div');
					paneldiv.className = "AwayTaskPanel";
					paneldiv.innerHTML = this._windows[i].getTitle();
					paneldiv.title = this._windows[i].getTitle();
					paneldiv.style.width = width + 'px';
					paneldiv.window = this._windows[i];
					paneldiv.onclick = function(){
						if (this.window._windowstyle == 'minimized'){
							this.window.unminimize();
						}else{
							this.window.minimize();
						}
					}
					this._divs.push(paneldiv);
					this._taskpaneldiv.appendChild(paneldiv);
				}
			}

		}

	}

	function ATaskBar(options){
		this._os = options.os;

		var ataskbar = this;

		this._handle = this._os.getNewSystemHandle();

		this._taskbardiv = document.createElement('div');
		this._taskpanelsdiv = document.createElement('div');
		this._taskbarbgdiv = document.createElement('div');
		this._taskstartbutton = document.createElement('div');

		this._taskmanager = new ATaskManager({os:this._os, parent:this, taskpaneldiv:this._taskpanelsdiv});


		this._taskbardiv.className = "AwayTaskBar";
		this._taskbarbgdiv.className = "AwayTaskBarBg";
		this._taskpanelsdiv.className = "AwayTaskPanels";
		this._taskstartbutton.className = "AwayStartButton";

		this._taskbardiv.appendChild(this._taskbarbgdiv);
		this._taskbardiv.appendChild(this._taskstartbutton);
		this._taskbardiv.appendChild(this._taskpanelsdiv);
		this._os._osdiv.appendChild(this._taskbardiv);

		/* init widths */
		var panelswidth = this._taskbardiv.clientWidth - this._taskstartbutton.offsetWidth;
		this._taskpanelsdiv.style.width = panelswidth + 'px';
		this._taskbardiv.onresize = function(){
			var panelswidth = ataskbar._taskbardiv.clientWidth - ataskbar._taskstartbutton.offsetWidth;
			ataskbar._taskpanelsdiv.style.width = panelswidth + 'px';
		}
	}

	away.os = function aos(options){
		var os = new AwayOS(options);
		away._os = os;
	};
	away.application = AApplication;
	away.system = {};


	function $$(id){
		if (typeof(id) == "string"){
			switch (id[0]){
				case '#':
					return document.getElementById(id.substr(1));
					break;
				case '.':
					return document.getElementsByName(id.substr(1));
					break;
				default:
					return document.getElementById(id);
			}
		}else return id;
	}

	if (!Array.prototype.indexOf){
		Array.prototype.indexOf = function(elt /*, from*/){
			var len = this.length;

			var from = Number(arguments[1]) || 0;
			from = (from < 0) ? Math.ceil(from): Math.floor(from);
			if (from < 0) from += len;

			for (; from < len; from++){
				if (from in this && this[from] === elt) return from;
			}
			return -1;
		};
	}



	if (!Array.prototype.remove){
		Array.prototype.remove = function(b) {
			var a = this.indexOf(b);
			if (a >= 0) {
				this.splice(a, 1);
				return true;
			}
			return false;
		};
	}

})();
function AWindow(options){
	if (typeof options == "undefined" ) return ;
	this._id = options.id;
	this._os = options.os;
	this._divid = "Window" + this._id;
	/* Window Title */
	this._title = (options.title == null?"A Window":options.title);
	/* Window Level */
	this._level = (options.level == null?3:options.level);	
	if (this._level > 5) this._level = 5;
	if (this._level < 1) this._level = 1;	
	this._zindex = this._level * 10000000 - 1;	
	
	/* Window Width,Height,Top,Left */
	this._content = (options.content == null?"This is Form":options.content);
	this._width = (options.width == null?400:options.width);
	this._height = (options.height == null?300:options.height);
	this._top = (options.top == null?20:options.top);
	this._left = (options.left == null?50:options.left);
	this._windowstyle = "normal";	
	
	this._parent = (options.parent == null?document.body:document.getElementById(options.parent));
	
	/* Window Title Button */
	this._closebutton = (options.closebutton == null?true:options.closebutton);
	this._minimizebutton = (options.minimizebutton == null?true:options.minimizebutton);
	this._maximizebutton = (options.maximizebutton == null?true:options.maximizebutton);
	
	/* Dialog */
	this._isDialog = (options.isdialog == null?false:options.isdialog);
	
	/* Drag Vars */
	this._dragging = false;
	this._mouseX = 0;
	this._mouseY = 0;
	this._windowX = 0;
	this._windowY = 0;
	
	
	
	if (typeof AWindow._initialized == "undefined"){
		/* options Title */
		AWindow.prototype.setTitle = function (mytitle){
			this._title = mytitle;
		};
		
		/* options Content */
		AWindow.prototype.setContent = function (content){
			this._content = content;
		};
		
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
			var id = this._id;
			var windowDiv = $$("#Window" + id).parentNode;
			windowDiv.style.zIndex = this._zindex; 
		}
		
		AWindow.prototype.close = function (){
			if (this.onclose)
				if (!this.onclose()) return;
			var id = this._id;
			var windowDiv = $$("#Window" + id).parentNode;
			windowDiv.parentNode.removeChild(windowDiv);
			this._os.removeWindow(this);
		}
		
		AWindow.prototype.maximize = function (){
			var id = this._id;
			var windowDiv = $$("#Window" + id).parentNode;
			var windowMaximizeButtonDiv = $$("#AWindowMaximizeButton" + id);
			if (this._windowstyle == "normal"){
				if (this.onmaximize)
					if (!this.onmaximize()) return;
				this.setForce();
				this._windowstyle = "maximized";
				windowDiv.style.width = '100%';
				windowDiv.style.height = '100%';
				windowDiv.style.left = '0';
				windowDiv.style.top = '0';
				windowMaximizeButtonDiv.title = "还原";
			}else {
				if (this.onrestore)
					if (!this.onrestore()) return ;
				this.setForce();
				this._windowstyle = "normal";
				windowDiv.style.width = this._width + 'px';
				windowDiv.style.height = this._height + 'px';
				windowDiv.style.left = this._left + 'px';
				windowDiv.style.top = this._top + 'px';
				windowMaximizeButtonDiv.title = "最大化";
			}
		}
		
		AWindow.prototype.minimize = function (){
			this._windowstyle = "minimized";
			this.hide();
		}
		
		/* Show this Window */
		AWindow.prototype.show = function (){
			var id = this._id;
			var windowDiv = $$("#Window" + id).parentNode;
			if (windowDiv == null){
				windowDiv = this.createWindow(); 
			}
			windowDiv.style.display = "block";
			this.setForce();
		};
		
		/* Hide this Window */
		AWindow.prototype.hide = function (){
			var id = this._id;
			var windowDiv = $$("#Window" + id).parentNode;
			if (windowDiv != null){
				windowDiv.style.display = "none";
			}
		};
		
		/* Set this window front */
		AWindow.prototype.setForce = function (){
			return this._os.setWindowForce(this);
		}
		
		/* Create a Window to body */
		AWindow.prototype.createWindow = function (){
			var aWindow = this;
			var id = this._id;
			var windowBorderDiv = document.createElement('div');
			windowBorderDiv.className = "AWindowBorder";
			windowBorderDiv.style.display = "none";
			windowBorderDiv.style.width = this._width + "px";
			windowBorderDiv.style.height = this._height + "px";
			windowBorderDiv.style.left = this._left + "px";
			windowBorderDiv.style.top = this._top + "px";
			windowBorderDiv.onmousedown = function(e){
				aWindow._os.setWindowForce(aWindow);
			}			
			
			var windowDiv = document.createElement('div');
			windowDiv.id = "Window" + id;
			windowDiv.className = "AWindow";
			
			var titlebarDiv = document.createElement('div');
			titlebarDiv.id = "WindowTitleBar" + id;
			titlebarDiv.className = "AWindowTitleBar";
			titlebarDiv.onmousedown = function(e){
				e = e||event;
				if (aWindow._windowstyle == 'normal'){
					aWindow._dragging = true;
					aWindow._mouseX = parseInt(e.clientX);
					aWindow._mouseY = parseInt(e.clientY);
					aWindow._windowX = parseInt(this.parentNode.parentNode.style.left);
					aWindow._windowY = parseInt(this.parentNode.parentNode.style.top);
					aWindow._os._dragObj = aWindow;
				}
			}
			titlebarDiv.ondblclick = function(){
				aWindow.maximize();
			}
				var titleDiv = document.createElement('div');
				titleDiv.id = "WindowTitle" + id;
				titleDiv.className = "AWindowTitle";
				titleDiv.innerHTML = this._title;
				titlebarDiv.appendChild(titleDiv);
				
				var closeButtonDiv = document.createElement('div');
				closeButtonDiv.className = "AWindowCloseButton";
				closeButtonDiv.id = "AWindowCloseButton" + id;				
				closeButtonDiv.title = "关闭";
				closeButtonDiv.onclick = function(){
					aWindow.close();
				}
				titlebarDiv.appendChild(closeButtonDiv);
				
				var minimizeButtonDiv = document.createElement('div');
				minimizeButtonDiv.className = "AWindowMinimizeButton";
				minimizeButtonDiv.id = "AWindowMinimizeButton" + id;				
				minimizeButtonDiv.title = "最小化";
				minimizeButtonDiv.onclick = function() {
					aWindow.minimize();
				}
				titlebarDiv.appendChild(minimizeButtonDiv);
				
				var maximizeButtonDiv = document.createElement('div');
				maximizeButtonDiv.className = "AWindowMaximizeButton";
				maximizeButtonDiv.id = "AWindowMaximizeButton" + id;
				maximizeButtonDiv.title = "最大化";
				maximizeButtonDiv.onclick = function() {
					aWindow.maximize();
				}
				titlebarDiv.appendChild(maximizeButtonDiv);
				
			windowDiv.appendChild(titlebarDiv);
			
			var contentDiv = document.createElement('div');
			contentDiv.id = "WindowContent" + id;
			contentDiv.className = "AWindowContent";
			contentDiv.innerHTML = this._content;
			windowDiv.appendChild(contentDiv);
			
			windowBorderDiv.appendChild(windowDiv);
			this._parent.appendChild(windowBorderDiv);
			return windowDiv;
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
	this._windows = new Array();
	this._os = options.os;
	this._levels = new Array(1,10000001,20000001,30000001,40000001,50000001);
	

	if (typeof AWindowManager._initialized == "undefined"){
		
		AWindowManager.prototype.getNewHandle = function (awindow){
			return this._os.getNewHandle();
		}
		
		AWindowManager.prototype.getNewWindow = function (options){
			options.id = this.getNewHandle();	
			options.os = this._os;
			var awindow = new AWindow(options);
			this._windows.push(awindow);
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
		}
		
		AWindowManager.prototype.removeWindow = function (awindow){
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
	this._ids = new Array();
	
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

function AwayOS(options) {
	if (typeof options == "undefined") options = {divname:'awayos'};
	
	/* Init Div */
	this._divname = options.divname;
	this._osdiv = document.createElement('div');	
	this._osdiv.id = this._divname;
	this._osdiv.className = "AwayOS";
	document.body.appendChild(this._osdiv);
	this._dragObj = null;
	
	var AOS = this;
	
	this._osdiv.onmousemove = function(e){
		e = e||event;
		if (AOS._dragObj != null && AOS._dragObj._dragging){
			var x,y;
			var moveobj = document.getElementById(AOS._dragObj._divid).parentNode;
			x = e.clientX - AOS._dragObj._mouseX + AOS._dragObj._windowX;
			y = e.clientY - AOS._dragObj._mouseY + AOS._dragObj._windowY;
			if (y < 0) y = 0;
			if (x < 0) x = 0;
			moveobj.style.left = x + "px";
			moveobj.style.top = y + "px";
			AOS._dragObj._left = x;
			AOS._dragObj._top = y;
		}
	}
	this._osdiv.onmouseup = function(e){
		e = e||event;
		if (AOS._dragObj != null && AOS._dragObj._dragging){
			var moveobj = document.getElementById(AOS._dragObj._divid).parentNode;
			AOS._dragObj._dragging = false;
			AOS._dragObj.left = parseInt(moveobj.style.left);
			AOS._dragObj.top = parseInt(moveobj.style.top);
		}
		AOS._dragObj = null;
	}

	/* Init Handle,Window */
	this._handlemanager = new AHandleManager({os:this});
	this._windowmanager = new AWindowManager({os:this});
	
	if (typeof AwayOS._initialized == "undefined"){
		/* Get New Handle */
		AwayOS.prototype.getNewHandle = function (){
			return this._handlemanager.getNewHandle();
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
		
		AwayOS._initialized = true;
	}
	
	
}


function AButton(options){
	this._icon = (options.icon == null?"":options.icon);
	this._width = (options.width == null?20:options.width);
	this._height = (options.height == null?20:options.height);
	this._parent = (options.parent == null?document.body:options.parent);
	this._buttontype = (options.buttontype == null?"normal":options.buttontype);
	
	AButton.prototype.create = function(){
		
	};
}


function $$(id){
	if (typeof(id) == "string"){
		switch (id[0]){
			case '#':return document.getElementById(id.substr(1));
				break;
			case '.':
				return document.getElementsByName(id.substr(1));
				break;
			default:return document.getElementById(id);
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
/**
 * @title  Dashboard Demo
 * @author Boris Yen
 * @date   2010/03/17
 */

Ext.ns("Dashboard");

var dh = Ext.DomHelper;

Dashboard.ControlPanel = Ext.extend(Ext.util.Observable, {
	buttons: ["SettingOK", "addOK"],
	//dbSettings: ["xGridNum", "yGridNum", "dWidth", "dHeight"],
	//dbProperties: ["title", "xSize", "ySize"],
	
	constructor: function(config){
		var config = config || {} ;
		
		Ext.apply(this, config) ;
		
		this.addEvents({
			"settingChange": true,
			"addPanel": true,
			"maximizePanel": true
		}) ;
		
		this._initUI() ;
		this._initEvent();
	},
	
	_initUI: function(){
		var template = new Ext.Template(
			'<div id={id} class="TabContainer">',
				'<ul>',
					'<li><a href="#{id}-settings">Dashboard Settings</a></li>',
					'<li><a href="#{id}-minpanels">Minimized Panels</a></li>',
					'<li><a href="#{id}-addpanel">Add Panel</a></li>',
				'</ul>',
				'<div class="CardContainer">',
					'<div id="{id}-settings" class="Card">',
						'<table class="OptionTable">',
							'<tr><td class="OptionName">X Axis Grid Number:</td><td><input id="xGridNum" type="text"/>&nbsp(3-10)</td></tr>',
							'<tr><td class="OptionName">Y Axis Grid Number:</td><td><input id="yGridNum" type="text"/>&nbsp(3-10)</td></tr>',
							'<tr><td class="OptionName">Dashboard Width:</td><td><input id="dWidth" type="text"/>&nbsp(>500)</td></tr>',
							'<tr><td class="OptionName">Dashboard Height:</td><td><input id="dHeight" type="text"/>&nbsp(>500)</td></tr>',
							'<tr><td colspan=2 align="right"><input type="button" value="OK" id="SettingOK"/></td></tr>',
						'</table>',
					'</div>',
					'<div id="{id}-minpanels" class="Card"></div>',
					'<div id="{id}-addpanel" class="Card">',
						'<table class="OptionTable">',
							'<tr><td class="OptionName">Title:</td><td><input id="title" type="text"/></td></tr>',
							'<tr><td class="OptionName">X Size:</td><td><input id="sizeW" type="text"/>&nbsp(>1)</td></tr>',
							'<tr><td class="OptionName">Y Size:</td><td><input id="sizeH" type="text"/>&nbsp(>1)</td></tr>',
							'<tr><td colspan=2 align="right"><input type="button" value="OK" id="addOK"/></td></tr>',
						'</table>',
					'</div>',
				'</div>',
			'</div>'
		);
		
		this.el = template.append(Ext.getBody(), {id: Ext.id(undefined, "CP")}, true) ;
		this.el.setVisibilityMode(Ext.Element.DISPLAY);
        this.el.hide();
		this.el.show();
		
		this.tabUl = this.el.child("ul") ;
		this.cardContainer = this.el.child(".CardContainer") ;
		this.tabs = this.tabUl.select("> li") ;
		this.cards = this.cardContainer.select("> div");
		this.mpCard = this.el.child("#"+this.el.id+"-minpanels") ;
		this.settingOK = this.el.child("#SettingOK") ;
		this.addOK = this.el.child("#addOK") ;
		
		this.cardContainer.setWidth(this.el.getWidth(true)) ;
		
		this._setActiveTab(0) ;
	},
	
	_initEvent: function(){
		this.tabUl.on("click", this._onTabClick, this, {delegate: "a"}) ;
		this.settingOK.on("click", this._onSettingOK, this) ;
		this.addOK.on("click", this._onAddOK, this) ;
		this.mpCard.on("click", this._onMpCardImgClick, this, {delegate: "img"}) ;
	},
	
	_onSettingOK: function(evt){
		//["xGridNum", "yGridNum", "dWidth", "dHeight"],
		var settings = {},
			xGridNum = this.el.child("#"+"xGridNum").getValue(),
			yGridNum = this.el.child("#"+"yGridNum").getValue(),
			dWidth = this.el.child("#"+"dWidth").getValue(),
			dHeight = this.el.child("#"+"dHeight").getValue() ;
		// do some basic checks
		settings["xGridNum"] = (xGridNum && !isNaN(xGridNum) && xGridNum >=3 && xGridNum<=10)? xGridNum: 3;
		settings["yGridNum"] = (yGridNum && !isNaN(yGridNum) && yGridNum >=3 && yGridNum<=10)? yGridNum: 3;
		settings["dWidth"] = (dWidth && !isNaN(dWidth) && dWidth >= 500)? dWidth: Ext.lib.Dom.getViewportWidth();
		settings["dHeight"] = (dHeight && !isNaN(dHeight)&& dHeight >= 500)? dHeight: Ext.lib.Dom.getViewportHeight(); 
		
		this.fireEvent("settingChange", settings) ;
	},
	
	_onAddOK: function(evt){
		//["title", "sizeW", "sizeH"]
		var pSettings = {},
			title = this.el.child("#"+"title").getValue(),
			sizeW = this.el.child("#"+"sizeW").getValue(),
			sizeH = this.el.child("#"+"sizeH").getValue();
			
		pSettings["title"] = (title)? title: "New Panel";
		pSettings["sizeW"] = (sizeW && !isNaN(sizeW) && sizeW >= 1)? parseInt(sizeW): 1;
		pSettings["sizeH"] = (sizeH && !isNaN(sizeH) && sizeH >= 1)? parseInt(sizeH): 1;
		
		this.fireEvent("addPanel", pSettings) ;
	},
	
	_onTabClick: function(evt, t){
		if(t && t.href && t.href.indexOf("#")) {
			evt.preventDefault();			
			this._setActiveTab(t.href.split("-").pop());
		}
	},
	
	_setActiveTab: function(tab){
		var card;		
		if(Ext.isString(tab)) {
			card = this.cardContainer.child("#"+ this.el.id + "-" + tab);
			tab = this.tabUl.child("a[href=#" + this.el.id + "-" + tab + "]").parent();
		}
		else if (Ext.isNumber(tab)) {
			tab = this.tabs.item(tab);
			var panelName = tab.first().dom.href.split("-").pop() ;
			card = this.cardContainer.child("#"+this.el.id+"-"+panelName);
		}
		
		if(tab && card) {
			card.radioClass('CardActive');
			tab.radioClass('TabActive');
		}
	},
	// send the id of the panel to listeners.
	_onMpCardImgClick: function(evt, t){
		if(t && t.id){
			if(this.fireEvent("maximizePanel", t.id.split("-")[1])){
				Ext.fly(t).remove() ;
			}
		}
	},
	// add a icon on the mpCard.
	addMinPanel: function(p){
		var imgId = "CP-"+p.getEl().id ;
		
		if(!this.mpCard.child("#"+imgId))
			dh.append(this.mpCard, {tag: "img", id: imgId, src: p.img, title: p.title}) ;
	},
	
	getEl: function(){
		return this.el ;
	}
}) ;

Dashboard.Dashboard = Ext.extend(Ext.util.Observable, {
	sIcon: 16,
	lIcon: 32,
	
	constructor: function(config){
		var config = config || {} ;
		
		Ext.apply(this, config) ;
		
		this.addEvents({
			
		}) ;
		
		this._initUI() ;
		this._initEvent();
		this.mPanels = {} ;
	},
	
	_initUI: function(){		
		this.layoutRegion = dh.append(Ext.getBody(), {
			tag: "div", 
			id: "layoutRegion", 
			cn: {
				tag: "img", 
				id: "ImgShowCP",
				src: "./images/right_a.gif"
			}
		}, true) ;
		
		
		this.layoutManager = new Dashboard.LayoutManager({container: this.layoutRegion}) ;
		this.controlPanel = new Dashboard.ControlPanel() ;
		this.imgShowCP = this.layoutRegion.child("#ImgShowCP") ;
		
		var cEl = this.controlPanel.getEl() ;
		cEl.appendTo(this.layoutRegion) ;
		cEl.setLeft(cEl.getWidth()*-1) ;
	},
	
	_initEvent: function(){
		this.layoutManager.on({
			minimizePanel: this._onMinimizePanel,
			closePanel: this._onRemovePanel,
			scope: this
		});
		
		this.controlPanel.on({
			settingChange: this._onSettingChange,
			addPanel: this._onAddPanel,
			maximizePanel: this._onMaximizePanel,
			scope: this
		}) ;
		
		this.imgShowCP.hover(function(){
			this.imgShowCP.setStyle({width: this.lIcon+"px", height: this.lIcon+"px"}) ;
		}, function(){
			this.imgShowCP.setStyle({width: this.sIcon+"px", height: this.sIcon+"px"}) ;
		}, this) ;
		
		this.imgShowCP.on("click", this._onShowCP, this) ;
	},
	
	addPanel: function(p){
		if(!this.layoutManager.addPanel(p)){
			this._onMinimizePanel(p) ;
			alert("Can not find space for this panel.\n"+
				"Please use d-n-d to ajust the layout or resize the existing panels to make space.\n\n"+
				"This Panel will be added to minimized panels.") ;
			return false ;
		} else 
			return true ;
	},
	
	_onSettingChange: function(settings){
		if(!this.layoutManager.applySettings(settings)){
			alert("Can not apply settings to dashboard.\n"+
				"The grid number might be too small.") ;
		}
	},
	
	_onAddPanel: function(pSettings){		
		return this.addPanel(new Dashboard.DashboardPanel(pSettings));
	},
	
	_onMaximizePanel: function(id){
		if(this.mPanels[id]? this.addPanel(this.mPanels[id]): false){
			delete this.mPanels[id] ;
			return true ;
		}
		return false ;
	},
	
	_onMinimizePanel: function(p){
		this.controlPanel.addMinPanel(p) ;
		this.mPanels[p.getEl().id] = p ;
	},
	
	_onRemovePanel: function(p){
		
	},
	
	_onShowCP: function(){
		var cEl = this.controlPanel.getEl() ;
		var imgDom = this.imgShowCP.dom ;
		var imgShowCP = this.imgShowCP ;
		
		function replaceIcon(){
			imgShowCP.show() ;
			if(imgDom.src.indexOf("right") != -1){
				imgDom.src = "./images/left_a.gif" ;
			} else {
				imgDom.src = "./images/right_a.gif" ;
			}
		}
		
		imgShowCP.hide() ;
		if (imgDom.src.indexOf("right") != -1) {
			cEl.animate({
				left: {
					from: cEl.getLeft(),
					to: 0
				}
			}, 0.35, replaceIcon);
		} else {
			cEl.animate({
				left: {
					from: cEl.getLeft(),
					to: -1*cEl.getWidth()
				}
			}, 0.35, replaceIcon);
		}
	}
});

// The layout manager is used to lay panels based on a table-like structure.
// Because the size of panels might be different from each other,
// it is difficult to decide the final layout.
// Ergo, the layout manager does not swith places for panels, when a panel is draging around.
// When a panel is added, the user has to manually make room for this new panel.
Dashboard.LayoutManager = Ext.extend(Ext.util.Observable, {
	xGridNum: 3,
	yGridNum: 3,
	paddingInside: 10,
	xGap: 10,
	yGap: 10,
	diffFactor: 2,
	zIndexSeed: 1000,
	
	constructor: function(config){
		var config = config || {} ;
		
		Ext.apply(this, config) ;
		this.panels = [] ;
		this.container = config.container ;
		this.container.clip() ;
		
		Dashboard.LayoutManager.superclass.constructor.apply(this, arguments);
		
		this.addEvents({
			"minimizePanel": true,
			"closePanel": true
		}) ;
		
		this._initUI() ;
	},
	
	_initUI: function(){
		var pi = this.paddingInside,
		xgn = this.xGridNum,
		ygn = this.yGridNum,
		xgap = this.xGap,
		ygap = this.yGap;
		
		this.container.setStyle({
			width: (this.dWidth? this.dWidth-5: Ext.lib.Dom.getViewportWidth()-5)+"px", 
			height: (this.dHeight? this.dHeight-5: Ext.lib.Dom.getViewportHeight()-5)+"px"
		}) ;
		
		this.gridRows = [] ;
		this.container.select(".LayoutGrid").remove() ;

		var gridWidth = this.gridWidth = Math.floor((this.container.getWidth(true)-pi*2-(xgn-1)*xgap)/xgn);
		var gridHeight = this.gridHeight = Math.floor((this.container.getHeight(true)-pi*2-(ygn-1)*ygap)/ygn);
		
		this.diffX = Math.floor(gridWidth/this.diffFactor) ;
		this.diffY = Math.floor(gridHeight/this.diffFactor) ;
		
		var grs = this.gridRows ;
		for(var i=0; i<ygn; i++){
			grs.push([]) ;
			for(var j=0; j<xgn; j++){
				var gridId = "Grid-"+j+"-"+i ;
				var gridEl = dh.append(this.container, {tag: "div", cls: "LayoutGrid", id:gridId}, true) ;

				gridEl.setStyle({
					width: gridWidth+"px", 
					height: gridHeight+"px", 
					top: (pi+i*(gridHeight+ygap))+"px", 
					left: (pi+j*(gridWidth+xgap))+"px"
				}) ;
				
				grs[i].push(gridEl) ;
			}
		}
	},
	// return true if the panel can be added to the container.
	addPanel: function(panel){
		var gridXY = panel.getGridXY() ;

		// this is a completely new panel, gridXY has not been set yet.
		if(!gridXY[0]){
			gridXY = this._getGridXYForPanel(panel.getSize()) ;
		} else {
			if(this._isOverlap(gridXY, panel.getSize(), panel)){
				gridXY = this._getGridXYForPanel(panel.getSize()) ;
			}
		}
		
		if (gridXY) {
			panel.setGridXY(gridXY) ;
		}
		else {
			return;
		}
		
		var pSize = this._getPanelSizeInPixel(panel) ;
		var panelW = pSize[0], panelH = pSize[1] ;

		panel.setSizeInPixel(panelW, panelH) ;
		panel.on({
			dragStart: this._onPanelDS,
			resize: this._onPanelResize,
			close: this._onPanelClose,
			minimize: this._onPanelMinimize,
			scope: this
		}) ;
		this._movePanelToGrid(panel) ;
		this.container.appendChild(panel.getEl()) ;
		this.panels.push(panel) ;
		panel.setStyle({"z-index": this.zIndexSeed++}) ;
		panel.show() ;
		
		return true ;
	},
	
	applySettings: function(settings){
		if(!this._isGridNumberOK(settings)) return false ;
		
		Ext.apply(this, settings) ;
		this._initUI() ;
		
		var panels = this.panels;
		
		this.panels = [] ;	
		Ext.each(panels, function(p){
			this.addPanel(p) ;
		}, this);
		
		return true ;
	},
	
	reset: function(){
		this.initUI() ;
	},
	// the new xGridNum/yGridNum should be at least xlimit/ylimit,
	// otherwise, there will be not enough room for all panels.
	_isGridNumberOK: function(s){
		var xlimit = 0,
			ylimit = 0;
		
		for(var i=0; i<this.panels.length; i++){
			var gxy = this.panels[i].getGridXY() ;
			var size = this.panels[i].getSize() ;
			
			if(gxy[0]+size[0] > xlimit)
				xlimit = gxy[0]+size[0] ;
				
			if(gxy[1]+size[1] > ylimit)
				ylimit = gxy[1]+size[1] ;
		}
		
		return !((s.xGridNum && s.xGridNum < xlimit) || (s.yGridNum && s.yGridNum < ylimit)) ;
	},
	
	_getGridXYForPanel: function(size){
		for(var i=0; i<this.yGridNum; i++){
			for(var j=0; j<this.xGridNum; j++){
				if(!this._isOverlap([j, i], size) && this._isInBoundary([j, i], size)) return [j, i];
			}
		}
	},
	
	_getPanelSizeInPixel: function(p){
		var pSize = p.getSize() ;
		var panelW = (pSize[0]*this.gridWidth + (pSize[0]-1)*this.xGap) ;
		var panelH = (pSize[1]*this.gridHeight + (pSize[1]-1)*this.yGap) ;
		
		return [panelW, panelH];
	},
	
	_getUppermostPanel: function(){
		var ret = this.panels[0];
		
		for(var i=0; i<this.panels.length; i++){
			if(ret.getStyle("z-index") < this.panels[i].getStyle("z-index")){
				ret = this.panels[i] ;
			}
		}
		
		return ret ;
	},
	
	_movePanelToGrid: function(panel){
		var psize = this._getPanelSizeInPixel(panel) ;
		var gridXY = panel.getGridXY() ;
		var grid = this.gridRows[gridXY[1]][gridXY[0]] ;

		//panel.setStyle({top: grid.getTop()+"px", left: grid.getLeft()+"px"}) ;
		panel.hideContent() ;
		panel.getEl().animate({
			top: {from: panel.el.getTop(true), to: grid.getTop(true)},
			left: {from: panel.el.getLeft(true), to: grid.getLeft(true)},
			width: {from: panel.el.getWidth(true), to: psize[0]},
			height: {from: panel.el.getHeight(true), to: psize[1]}
		}, 0.1, function(){
			panel.setSizeInPixel(psize[0], psize[1]) ;
			panel.showContent() ;
		},'easeOut', 'motion') ;
		
		this._removeHighlight() ;
	},
	
	// if the selection is not empty, sometimes the mouse events will not work well.
	_clearSelection: function(){
		// for ie: document.selection.empty ()
		window.getSelection? window.getSelection().removeAllRanges(): document.selection.empty(); 
	},
	
	_onPanelDS: function(panel, mouseXY){
		this.dragData = {
			oMuseXY: mouseXY,
			oPanelTL: [panel.getEl().getTop(true), panel.getEl().getLeft(true)],
			panel: panel
		};
		
		this._setPanelToTop(panel) ;
		this._highlightTargetGrid(panel.getGridXY(), panel.getSize()) ;
		
		Ext.getBody().on({
			mousemove: this._onContainerMousemove,
			mouseup: this._onContainerMouseup,
			//mouseout: this._onContainerMouseout,
			scope: this
		}) ;
		
		this._clearSelection() ;
		panel.hideContent() ;	
	},
	
	_onPanelResize: function(panel, dir, mouseXY){
		var pel = panel.getEl() ;
		
		this.resizeData = {
			oMuseXY: mouseXY,
			oPanelTLBR: [pel.getTop(true), pel.getLeft(true), pel.getBottom(true), pel.getRight(true)],
			panel: panel,
			dir: dir
		};
		
		this._setPanelToTop(panel) ;
		this._highlightTargetGrid(panel.getGridXY(), panel.getSize()) ;
		
		Ext.getBody().on({
			mousemove: this._onContainerMousemove,
			mouseup: this._onContainerMouseup,
			//mouseout: this._onContainerMouseout,
			scope: this
		}) ;
		
		this._clearSelection() ;
		panel.hideContent() ;
	},
	
	_onPanelClose: function(p){
		//console.log("close") ;
		var that = this ;
		var el = p.getEl() ;
		
		el.animate({
			opacity: {to: 0, from: 1}			
		}, 0.2, function(){
			p.destroy() ;
			that._removePanelFromLayout(p) ;
			that.fireEvent("closePanel", p) ;
		});
	},
	
	_onPanelMinimize: function(p){
		//console.log("minimize") ;
		var that = this ;
		var el = p.getEl() ;
		
		p.hideContent() ;
		el.animate({
			height: {to: 0, from: el.getHeight(true)},
    		width: {to: 0, from: el.getWidth(true)},
			left: {to: 0, from: el.getLeft(true)}		
		}, 0.2, function(){
			p.hide();
			p.purgeListeners() ;
			that._removePanelFromLayout(p) ;
			that.fireEvent("minimizePanel", p) ;
		});
	},
	
	_removePanelFromLayout: function(p){
		for(var i=0; i<this.panels.length; i++){
			if(this.panels[i] === p){
				this.panels.splice(i, 1) ;
			}
		}
	},
	
	_setPanelToTop: function(panel){
		var uppermostp = this._getUppermostPanel() ;
		
		this._switchZIndex(panel, uppermostp) ;
	},
	
	_switchZIndex: function(p, pup){
		var upIndex = pup.getStyle("z-index") ;
		pup.setStyle({"z-index": p.getStyle("z-index")}) ;
		p.setStyle({"z-index": upIndex}) ;
	},
	
	_highlightTargetGrid: function(gridxy, size){
		for(var i=gridxy[1]; i<(gridxy[1]+size[1]); i++){
			if(i >= this.yGridNum) continue ;
			for (var j = gridxy[0]; j < (gridxy[0] + size[0]); j++) {
				if(j >= this.xGridNum) continue ;
				
				this.gridRows[i][j].addClass("TargetGrid");
			}
		}
	},
	
	_removeHighlight: function(){
		for(var i=0; i<this.yGridNum; i++){
			for(var j=0; j<this.xGridNum; j++)
				this.gridRows[i][j].removeClass("TargetGrid") ;
		}
	},
	
//	_isOutofBoundary: function(p, t, l){
//		var psize = p.getSize(),
//			gridul = this.gridRows[0][0],
//			gridbr = this.gridRows[this.yGridNum-1][this.xGridNum-1],
//			testl = gridul.getLeft(true)-this.paddingInside,
//			testt = gridul.getTop(true)-this.paddingInside,
//			testb = gridbr.getBottom(true)+this.paddingInside,
//			testr = gridbr.getRight(true)+this.paddingInside;
//			//debugger ;
//		var pl = p.getEl().getLeft(true),
//			pt = p.getEl().getTop(true),
//			pb = p.getEl().getBottom(true),
//			pr = p.getEl().getRight(true) ;
//			
//		if(testl<=pl && pl<=testr && testt<=pt && pt<=testb &&
//			testl<=pr && pr<=testr && testt<=pb && pb<=testb){
//			return false ;
//		}
//		
//		return true ;
//	},
	
	_isOverlap: function(xy, size, p){
		var pList = this.panels ;
		
		for(var i = 0; i<pList.length ; i++){
			if(pList[i] === p) continue ;
			
			var pxy = pList[i].getGridXY() ;
			var psize = pList[i].getSize() ;
			
			var ulx = Math.max (xy[0], pxy[0]);
  			var uly = Math.max (xy[1], pxy[1]);
  			var lrx = Math.min (xy[0]+size[0], pxy[0]+psize[0]);
  			var lry = Math.min (xy[1]+size[1], pxy[1]+psize[1]);
			
			if(ulx < lrx && uly < lry) return true ;
		}
		
		return false ;
	},
	
	_isInBoundary:function(xy, size){
		return xy[0]+size[0] <= this.xGridNum && xy[1]+size[1] <= this.yGridNum ;
	},
	
	_handleDragPanel: function(evt){
		var curXY = evt.getXY(),
			originXY = this.dragData.oMuseXY,
			offsetX = curXY[0]-originXY[0],
			offsetY = curXY[1]-originXY[1],
			olf = this.dragData.oPanelTL,
			p = this.dragData.panel,
			newTop = olf[0]+offsetY,
			newLeft = olf[1]+offsetX;

		p.setStyle({top: newTop+"px", left: newLeft+"px"}) ;
		
		var newGridXY = this._getNewGridXY(newTop, newLeft) ;

		if(newGridXY && !this._isOverlap(newGridXY, p.getSize(), p) && this._isInBoundary(newGridXY, p.getSize())){
			this._removeHighlight() ;
			p.setGridXY(newGridXY) ;
			this._highlightTargetGrid(newGridXY, p.getSize()) ;
		}
	},
	
	_handleResizePanel: function(evt){
		var curXY = evt.getXY(),
			originXY = this.resizeData.oMuseXY,
			offsetX = curXY[0]-originXY[0],
			offsetY = curXY[1]-originXY[1],
			otlbr = this.resizeData.oPanelTLBR,
			p = this.resizeData.panel,
			dir = this.resizeData.dir;
			
		var	newT = otlbr[0], 
			newL = otlbr[1],
			newR = otlbr[3],
			newB = otlbr[2],
			newW = newR - newL, 
			newH = newB - newT;
		
		function r(){
			if ((newW + offsetX) > this.gridWidth) {
				newW += offsetX;
			} else {
				newW = this.gridWidth ;
			}
		};
		
		function b(){
			if((newH+offsetY) > this.gridHeight){
				newH += offsetY ;
			} else {
				newH = this.gridHeight ;
			}
		};
		
		function l(){
			if((newR - newL - offsetX) > this.gridWidth){
				newL += offsetX ;
				newW -= offsetX ;
			} else {
				newL = newR - this.gridWidth ;
				newW = this.gridWidth ;
			}
		};
		
		function t(){
			if((newB - newT - offsetY) > this.gridHeight){
				newT += offsetY ;
				newH -= offsetY ;
			} else {
				newT = newB - this.gridHeight ;
				newH = this.gridHeight ;
			}
		};
		
		switch(dir){
			case "Bl":
				b.call(this) ;
				l.call(this) ;
				break ;
			case "Bc":
				b.call(this) ;
				break ;
			case "Br":
				r.call(this) ;
				b.call(this) ;
				break ;
			case "Cr":
				r.call(this) ;
				break ;
			case "Cl":
				l.call(this) ;
				break ;
			case "Tc":
				t.call(this) ;
				break ;
			case "Tr":
				t.call(this) ;
				r.call(this) ;
				break ;
			case "Tl":
				t.call(this) ;
				l.call(this) ;
				break ;
		};
		
		p.setStyle({top: newT+"px", left: newL+"px"}) ;
		p.setSizeInPixel(newW, newH) ;
		
		var newGridXY = this._getNewGridXY(newT, newL) ;
		var newSize = this._getNewSize(newGridXY, newW, newH) ;
		
		if(newGridXY && newSize && !this._isOverlap(newGridXY, newSize, p)){
			p.setGridXY(newGridXY) ;
			p.setSize(newSize);
		}
		
		this._removeHighlight() ;
		this._highlightTargetGrid(p.getGridXY(), p.getSize()) ;
	},
	
	_onContainerMousemove: function(evt){
		evt.preventDefault() ;
		
		if(!this.dragData && !this.resizeData) return ;
		// no need to calculate new position for every mouse movement.
		if ((evt.getXY()[0] + evt.getXY()[1]) % 2 == 0) return ;
		
		if(this.dragData){
			this._handleDragPanel(evt) ;
		} else if(this.resizeData){
			this._handleResizePanel(evt) ;
		}
	},
	
	_onContainerMouseup: function(){
		this._forceDragActionEnd() ;
	},
	
//	_onContainerMouseout: function(evt){
//		if(evt.getTarget() !== this.container.dom) return ;
//		
//		var relTarget = Ext.fly(evt.getRelatedTarget()) ;
//		// if the container is the ancestor, this mouse point is still inside the container.
//		if(relTarget.findParentNode("#"+this.container.id)) return ;
//
//		this._forceDragActionEnd() ;
//	},
	
	_forceDragActionEnd: function(){
		if (this.dragData || this.resizeData) {
			this._movePanelToGrid(this.dragData? this.dragData.panel: this.resizeData.panel);
		}
		
		this.dragData = undefined ;	
		this.resizeData = undefined ;	
		
		Ext.getBody().un("mousemove", this._onContainerMousemove, this) ;
		Ext.getBody().un("mouseup", this._onContainerMouseup, this) ;
		//Ext.getBody().un("mouseout", this._onContainerMouseout, this) ;
	},
	
	_getNewGridXY: function(t, l){
		for(var i=0; i<this.yGridNum; i++){
			var row = this.gridRows[i] ;
			for(var j=0; j<this.xGridNum; j++){
				var grid = row[j] ;
				
				if(Math.abs(grid.getTop(true)-t) < this.diffY && Math.abs(grid.getLeft(true)-l) < this.diffX){
					return [j, i] ;
				}
			}
		}
	},
	// assume the panel is at xy, only need to test bottom and right edges.
	_getNewSize: function(xy, w, h){
		if(!xy) return ;
		
		var g = this.gridRows[xy[1]][xy[0]] ;
		var b = g.getTop(true)+h ;
		var r = g.getLeft(true)+w ;
		
		for(var i=0; i<this.yGridNum; i++){
			var row = this.gridRows[i] ;
			for(var j=0; j<this.xGridNum; j++){
				var grid = row[j] ;

				if(Math.abs(grid.getBottom(true)-b) < this.diffY && Math.abs(grid.getRight(true)-r) < this.diffX){
					return [j-xy[0]+1, i-xy[1]+1] ;
				}
			}
		}
	}
}) ;

// The panel has to be used together with Dashboard.LayoutManager.
// Users can use d-n-d to resize and reposition the panel.
Dashboard.DashboardPanel = Ext.extend(Ext.util.Observable, {
	sizeW: 1,
	sizeH: 1,
	gridX: 0,
	gridY: 0,
	titileHeight: 20,
	// the width and height of the handles used to resize the panel
	handleWH: 5,
	resizeDir: ["Tl", "Tc", "Tr", "Cl", "Cr", "Bl", "Bc", "Br"],
	components: ["Title", "CloseIcon", "MinimizeIcon", "PanelContent", "Content", "PanelCc", "TitleText", "TitleImg"],
	
	constructor: function(config){
		var config = config || {} ;
		
		Ext.apply(this, config) ;
		
		Dashboard.DashboardPanel.superclass.constructor.apply(this, arguments);
		
		this.addEvents({
			"dragStart": true,
			"close": true,
			"minimize": true,
			"resize": true		
		}) ;
		// default icon
		if(!this.img)
		    this["img"] = "./images/win.gif" ;
			
		this._initUI() ;
		this._initEvents() ;
	},
	
	_initUI: function(){
		var id = Ext.id() ;
		
		var panelTemplate = new Ext.Template(
			'<table id="{id}" border="0" cellpadding="0" cellspacing="0" class="DashboardPanel">',
				'<tr>',
					'<td class="PanelTl" />',
					'<td class="PanelTc" />',
					'<td class="PanelTr" />',
				'</tr>',
				'<tr>',
					'<td class="PanelCl" />',
					'<td class="PanelCc">',
						'<div class="PanelContent">',
							'<div class="Title">',
								'<img class="TitleImg"/>',
								'<span class="TitleText"></span>',
								'<div class="CloseIcon"></div>',
								'<div class="MinimizeIcon"></div>',
							'</div>',
							'<div class="Content"></div>',
						'</div>',
					'</td>',
					'<td class="PanelCr" />',
				'</tr>',
				'<tr>',
					'<td class="PanelBl" />',
					'<td class="PanelBc" />',
					'<td class="PanelBr" />',
				'</tr>',
			'</table>'
		);
		
		this.el = panelTemplate.append(Ext.getBody(), {id: Ext.id(null, "DP")}, true) ;
		this.el.setVisibilityMode(Ext.Element.DISPLAY);
        this.el.hide();
		
		Ext.each(this.components, function(cls){
			this[cls] = Ext.get(this.el.query("."+cls)[0]) ;
		}, this) ;
		
		this.PanelContent.setVisibilityMode(Ext.Element.DISPLAY) ;
		if(this.title) 
			this.TitleText.dom.innerHTML = this.title ;
		if(this.img)
			this.TitleImg.dom.src = this.img ;
	},
	
	_initEvents: function(){
		this.Title.on({
			mousedown: this._onTitleBarMousedown,
			//mouseout: this._onTitleBarMouseout,
			scope: this
		}) ;
		
		this.CloseIcon.on({
			click: this._onCloseIconClick,
			// use this to prevent event from propagate to this.Title
			mousedown: this._onCloseIconClick,
			scope: this
		});
		
		this.MinimizeIcon.on({
			click: this._onMinimizeIconClick,
			// use this to prevent event from propagate to this.Title
			mousedown: this._onMinimizeIconClick,
			scope: this
		});
		
		Ext.each(this.resizeDir, function(dir){
			var handleEl = this.el.select(".Panel"+dir) ;
			
			handleEl.on({
				mousedown: this._onHandlesClick,
				scope: this
			});
			
			handleEl.item(0).dom.id = this.el.id+"-resize-"+dir ;
		}, this);
	},
	
	hideContent: function(){
		this.PanelContent.hide() ;
	},
	
	showContent: function(){
		this.PanelContent.show() ;
	},
	
	setGridXY: function(xy){
		this.gridX = xy[0] ;
		this.gridY = xy[1] ;
	},
	
	getGridXY: function(){
		return [this.gridX, this.gridY] ;
	},
	
	setSize: function(wh){
		this.sizeW = wh[0] ;
		this.sizeH = wh[1] ;
	},
	
	getSize: function(){
		return [this.sizeW, this.sizeH] ;
	},
	
	show: function(){
		this.el.show(true) ;
	},
	
	hide: function(){
		this.el.hide(true) ;
	},
	
	setStyle: function(obj){
		this.el.setStyle(obj) ;
	},
	
	setSizeInPixel: function(w, h){
		var cw = w-2*this.handleWH,
			ch = h-2*this.handleWH-this.titileHeight ;

		this.Content.setStyle({width: cw+"px", height: ch+"px"});
		this.Title.setStyle({width: cw+"px"});
		this.el.setStyle({width: w+"px", height: h+"px"}) ;
		// for google chrome, when the panelcontent is hidden, the width of this.PanelCc will become zero.
		// do not know why, maybe this is a bug of google chrome.
		this.PanelCc.setStyle({width: cw+"px"});
	},
	
	resizeTo: function(w, h){
		
	},
	
	getTop: function(){
		return this.el.getTop() ;
	},
	
	getLeft: function(){
		return this.el.getLeft() ;
	},
	
	getEl: function(){
		return this.el ;
	},
	
	getStyle: function(pro){
		return this.el.getStyle(pro) ;
	},
	
	destroy: function(){
		Ext.each(this.components, function(cls){
			this[cls].removeAllListeners() ;
		}, this) ;
		
		Ext.each(this.resizeDir, function(dir){
			var handleEl = this.el.select(".Panel"+dir) ;
			
			handleEl.removeAllListeners() ;			
		}, this);
		
		this.el.removeAllListeners() ;
		this.el.remove();
		this.el = undefined ;
	},
	
//	removeFromDom: function(){
//		this.el.remove() ;
//	},
	
	_onTitleBarMousedown: function(evt){
		evt.preventDefault() ;
		evt.stopPropagation() ;
		this.fireEvent("dragStart", this, evt.getXY()) ;
	},
	
	_onHandlesClick: function(evt){		
		//if(evt.getTarget().tagName != "td" && evt.getTarget().tagName != "TD") return ;
		// send the direction to the listener
		this.fireEvent("resize", this, evt.getTarget().id.split("-")[2], evt.getXY()) ;
	},
	
	_onCloseIconClick: function(evt){
		evt.preventDefault() ;
		evt.stopPropagation() ;
		
		if(evt.type != 'mousedown')
			this.fireEvent("close", this) ;
	},
	
	_onMinimizeIconClick: function(evt){		
		evt.preventDefault() ;
		evt.stopPropagation() ;
		
		if(evt.type != 'mousedown')
			this.fireEvent("minimize", this) ;		
	}
}) ;

Ext.onReady(function(){
	var dashboard = new Dashboard.Dashboard() ;
	
	var dp = new Dashboard.DashboardPanel({title: "title1", gridX: 1, gridY: 2}) ;
	var dp1 = new Dashboard.DashboardPanel({title: "title2", gridX: 0, gridY: 0, sizeH: 2}) ;
	
	dashboard.addPanel(dp) ;
	dashboard.addPanel(dp1) ;
}
);

//消除元素管理器 
class ElementViewManage extends egret.EventDispatcher{//当前这个管理器是可以派发消息的
	//元素存在容器
	private _layer:egret.Sprite;//存储游戏元素层级，针对游戏当中64个元素所存放的游戏层级
	public constructor(elementLayer:egret.Sprite) {
		super();
		this._layer = elementLayer;
		this.init();
	}

	/*-----------------------------初始化数据--------------------------------------*/
    //ElementView对象池，全局仅最多GameData.MaxRow*GameData.MaxColumn个，默认为64个
	private elementviews: ElementView[];

	//初始化所有数据变量
	private init() {//这里的初始化对象是N个ElementView
		this.elementviews = new Array();
		var l:number = GameData.MaxColumn * GameData.MaxRow;
		var el:ElementView;
		for(var i=0; i<l; i++){
			el = new ElementView(this._layer);//创建元素视图
			el.id = i;
			el.location = GameData.elements[i].location;
			this.elementviews.push(el);
			el.addEventListener(ElementViewManageEvent.REMOVE_ANIMATION_OVER, this.removeAniOver, this);
			el.addEventListener(egret.TouchEvent.TOUCH_TAP, this.elTap, this);//点击之后对其进行相应操作
			el.addEventListener(ElementViewManageEvent.UPDATE_MAP, this.updateMap, this);
			el.addEventListener(ElementViewManageEvent.UPDATE_VIEW_OVER,this.moveNewLocationOver,this)
		}
	}

    /*-----------------------------焦点相关控制--------------------------------------*/
    private _currentTapID:number = -1;  //当前被点击（即将获取焦点）的元素ID，如为-1则表示没有元素获取焦点或无点击对象

    //元素被点击响应事件
    //判断当前元素焦点状态，是否需要改变，如果存在两个焦点，则派发TAP_TWO_ELEMENT,通知上层逻辑，对连个被点击元素进行数据计算

	private elTap(evt:egret.TouchEvent) {
		if(PropViewManage.proptype == -1){//当前是否使用道具，-1表示没有使用道具，无道具激活
			if(evt.currentTarget instanceof ElementView){
				var ev:ElementView = <ElementView>evt.currentTarget;//获取用户点击的元素

				//玩家是否点击了两个元素
				//当前被点击（即将获取焦点）的元素ID，如为-1则表示没有元素获取焦点或无点击对象
				if(this._currentTapID != -1){
					//用户对其中一个元素点击了两次
					//用户第一次点击元素的时候，需要设置焦点，如果第二次点击相同元素，需要把焦点取消，这时候我们认为用户取消了选择
					if(ev.id == this._currentTapID){//获取用户点击元素的id
						ev.setFocus(false);//设置焦点
						this._currentTapID = -1;
					}
					//用户对其中一个元素点击了一次再点击了其他的元素，派发用户交换了元素的事件
					else{
						var event:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.TAP_TWO_ELEMENT);
						event.ele1 = this._currentTapID;
						event.ele2 = ev.id;
						this.dispatchEvent(event);
					}
				}
				//玩家只点击了一个元素，设置为焦点
				else{
					ev.setFocus(true);
					this._currentTapID = ev.id;	
				}
			}
		}
		//使用道具做的逻辑操作
		else{
			//玩家是否点击了两个元素
			//当前被点击（即将获取焦点）的元素ID，如为-1则表示没有元素获取焦点或无点击对象
			if(this._currentTapID != -1){
				this._currentTapID = -1;
			}
			//需要派发使用道具这个事件，使用道具之后，派发的事件对于上层接收到事件进行相应的数据逻辑调用
			var evts:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.USE_PROP_CLICK);
			//propToElementLocation携带道具点击的元素位置
			evts.propToElementLocation = (<ElementView>evt.currentTarget).location;
			this.dispatchEvent(evts);
		}
	}

	//改变焦点,将旧焦点取消，设置新对象焦点
	public setNewElementFocus(location:number){
		this.elementviews[this._currentTapID].setFocus(false);
		this.elementviews[location].setFocus(true);
		this._currentTapID = location;
	}

    /*-----------------------------播放交互动画，交换后再返回--------------------------------------*/
    //可以交换，但是交换后没有发生位置移动
    //移除焦点
    //播放一个交换的动画，然后两个位置再换回来
	//用户点击两个元素，它们之间有了交换，执行这个函数
	//判断焦点的前后位置，判断之后要对他们的层级，进行切换
	public changeLocationAndBack(id1:number, id2:number){
		//判断元素是否处在焦点状态，如果是焦点设置为false
		if(this.elementviews[id1].focus){
			this.elementviews[id1].setFocus(false);
			//针对元素交换他们的显示列表位置
			if(this._layer.getChildIndex(this.elementviews[id1]) < this._layer.getChildIndex(this.elementviews[id2])){
				this._layer.swapChildren(this.elementviews[id1], this.elementviews[id2]);
			}
			//交换完成后，两元素都执行moveAndBack方法，用来播放动画，层级在上面，播放增加true，true代表播放进行放大的缩放的一个显示效果
			this.elementviews[id1].moveAndBack(this.elementviews[id2].location, true);
			this.elementviews[id2].moveAndBack(this.elementviews[id1].location);
		}
		else{
			//如果当前元素没有焦点
			this.elementviews[id2].setFocus(false);
			//针对元素交换他们的显示列表位置
			if(this._layer.getChildIndex(this.elementviews[id1]) > this._layer.getChildIndex(this.elementviews[id2])){
				this._layer.swapChildren(this.elementviews[id1], this.elementviews[id2]);
			}
			this.elementviews[id1].moveAndBack(this.elementviews[id2].location);
			this.elementviews[id2].moveAndBack(this.elementviews[id1].location, true);
		}
		this._currentTapID = -1
	}

	/*-----------------------------播放删除动画--------------------------------------*/
	//元素确实能够被删除，能够被消除之后，播放这类型的动画
	public changeLocationAndScale(id1:number, id2:number){
		//判断元素是否处在焦点状态，如果是焦点设置为false
		if(this.elementviews[id1].focus){
			this.elementviews[id1].setFocus(false);
			//针对元素交换他们的显示列表位置
			if(this._layer.getChildIndex(this.elementviews[id1]) < this._layer.getChildIndex(this.elementviews[id2])){
				this._layer.swapChildren(this.elementviews[id1], this.elementviews[id2]);
			}
			//交换完成后，两元素都执行moveAndScale方法，移动并且缩放，缩放完成就直接删除，true代表播放进行放大的缩放的一个显示效果
			this.elementviews[id1].moveAndScale(this.elementviews[id2].location, true);
			this.elementviews[id2].moveAndScale(this.elementviews[id1].location);
		}
		else{
			//如果当前元素没有焦点
			this.elementviews[id2].setFocus(false);
			//针对元素交换他们的显示列表位置
			if(this._layer.getChildIndex(this.elementviews[id1]) > this._layer.getChildIndex(this.elementviews[id2])){
				this._layer.swapChildren(this.elementviews[id1], this.elementviews[id2]);
			}
			this.elementviews[id1].moveAndScale(this.elementviews[id2].location);
			this.elementviews[id2].moveAndScale(this.elementviews[id1].location, true);
		}
		this._currentTapID = -1
	}

    /*-----------------------------显示所有元素，并播放出场动画--------------------------------------*/
	//元素从上到下，掉落播放的一个动画过程
	public showAllElement(){
		this._layer.removeChildren();//先移除显示列表所有的子显示对象
		var girdwidth:number = (GameData.stageW - 40) / GameData.MaxColumn;
		var startY:number = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.MaxColumn;//最下方的y轴
		var ele:ElementView;
		for(var i:number=0; i<GameData.MaxRow; i++){
			for(var t:number=0; t<GameData.MaxColumn; t++){
				if(GameData.mapData[i][t] != -1){
					ele = this.elementviews[GameData.mapData[i][t]];
					ele.setTexture( "e"+GameData.elements[GameData.mapData[i][t]].type+"_png" );
					ele.x = ele.targetX();
					ele.y = startY - ele.width;
					//播放掉落动画的函数
					ele.show((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50);
				}
			}
		}
	}

	/*-----------------------------动画播放控制--------------------------------------*/
    private removenum:number=0;  //即将删除的元素数量
	//消除动画播放结束，当一个动画播放完成之后，把它进行删除
	//当一个动画播放完成之后，会回调这个方法，回调方法之后，进行数量标记，数量标记完成之后，派发事件，不做逻辑处理
	//消除元素的时候，有N个动画都需要消除，虽然所有的动画时间都设置为相同的时间，动画完成的先后顺序是不一样的，所以要做数量标记
	private removeAniOver(evt:ElementViewManageEvent) {
		this.removenum++;
		if(this.removenum == 2){
			this.removenum = 0;
			this.dispatchEvent(evt);
		}
	}

	private moveeleNum:number = 0;//所要播放的动画数量

	//播放曲线动画，此类型动画用于可消除过关条件得情况，实际是使用直线动画进行标记，播放完成后，进行数量标记，标记完成后修改显示层级
	public playReqRemoveAn(id:number, tx:number, ty:number) {
		this.moveeleNum++;
		var el:ElementView = this.elementviews[id];
		if(el.parent){
			this._layer.setChildIndex(el, this._layer.numChildren);
		}
		el.playCurveMove(tx, ty);
	}

	//播放放大动画，播放后直接删除,用于可删除元素，但元素类型不是关卡过关条件
	public playRemoveAni(id:number){
		this.moveeleNum++;
		var el:ElementView = this.elementviews[id];
		if(el.parent){
			this._layer.setChildIndex(el, this._layer.numChildren);
		}
		el.playReMoveAni();
	}

	//删除动画完成，现在更新地图元素	
	private updateMap(evt:ElementViewManageEvent) {
		this.moveeleNum--;
		if(this.moveeleNum == 0){//当前所要播放的动画全部都播放完成了，派发结束事件
			this.dispatchEvent(evt);
		}
	}

	/*-----------------------------更新整个地图中元素位置--------------------------------------*/
	//打乱顺序之后重新布局
	private moveLocElementNum:number = 0;
	public updateMapData(){
		var len:number = this.elementviews.length;
		this.moveLocElementNum = 0;
		//打乱顺序之后直接做循环遍历，更新它们的location
		for(var i:number=0; i<len; i++)
        {
            this.elementviews[i].location=GameData.elements[i].location;
            this.elementviews[i].setTexture( "e"+GameData.elements[i].type+"_png" );
            this.elementviews[i].moveNewLocation();//执行移动操作
        }
	}
	private moveNewLocationOver(event:ElementViewManageEvent){//新位置掉落结束，消除完一行执行掉落操作
		this.moveLocElementNum++;
		if(this.moveLocElementNum == GameData.MaxColumn * GameData.MaxRow){
			var evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER);
			this.dispatchEvent(evt);
		}
	}

	/*-----------------------------乱序操作，移动全部元素位置--------------------------------*/
	//乱序移动指令触发
	public updateOrder(){
		var len:number = this.elementviews.length;
		egret.Tween.removeAllTweens();//当动画还在运动当中，暂停当前游戏场景所有动画
		for(var i:number=0; i<len; i++){
			this.elementviews[i].location = GameData.elements[i].location;
			this.elementviews[i].move();
		}
	}
}
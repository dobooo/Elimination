//封装消除元素的样式与行为 
class ElementView extends egret.Sprite{
	//游戏中的元素
	
	private thisparent:egret.Sprite;
	//thisparent：缓存父级显示对象属性，new的时候作为参数传递进来
	public constructor(tparent:egret.Sprite){
		super();
		//当这个类被new的时候需要知道它的父级
		this.thisparent = tparent;
		this.init();
	}
	//位置编号，供移动使用，对应GameData.elements中location，这里的location用于后面的移动它的位置做动画使用
	public location:number = 0;

    /*-----------------------------ID 编号相关，携带测试信息-----------------------------------*/
	//ID编号，对应GameData.elements中的数据ID，唯一ID，与数据下标相同，将界面与数据进行绑定
	public _id:number = -1;
	public get id():number{
		return this._id;
	}
	public set id(val:number){
		this._id = val;
	}

    /*----------------------------元素位图 初始化相关功能-----------------------------------*/
	//当前元素中位图的数据
	public bitmap:egret.Bitmap;

	//初始化所有的数据
	public init(){
		this.touchEnabled = true;//所有元素都可以被点击
		this.touchChildren = false;//为了节约性能，把touchChildren全部关闭，只有当前这个对象看成一个元素被点击
		this.bitmap = new egret.Bitmap();//创建Bitmap对象
		var bitwidth:number = (GameData.stageW - 40)/GameData.MaxColumn;
		this.bitmap.width = bitwidth - 10;
		this.bitmap.height = bitwidth - 10;
		this.bitmap.x = -1 * bitwidth / 2;
		this.bitmap.y = -1 * bitwidth / 2;
		this.addChild(this.bitmap);
	}

	//设置贴图纹理
	public setTexture(val:string){
		this.bitmap.texture = RES.getRes(val);
	}

	/*-------------------------------------焦点管理相关----------------------------------------*/
	//标记当前元素是否被用户点击过
	private _focus:boolean = false;
	public get focus():boolean{
		return this._focus;
	}


	/* 
	//如果被点击了，需要在它上面显示一个MovieClip
	private _focusMc:egret.MovieClip;
	*/


	//如果被点击了，需要在它上面显示一个图像
	//设置选择状态的焦点模式，_focus需要看设置焦点的时候，焦点是否为true
	public setFocus(val:boolean){
		//先对传递来的参数与目前的状态进行判断，如果传递进来的状态与当前焦点的状态相同的，就没有必要做其他操作
		//如果焦点没有被创建的话
		if(val != this._focus){
			this._focus = val;

			if(val){
				this.setTexture("e"+GameData.elements[this.id].type+"foucs_png" );
			}
			else{						
				this.setTexture("e"+GameData.elements[this.id].type+"_png" );
			}

			//焦点的mc前面没有被创建的话
			/*
			if(!this._focusMc){
				var tex = RES.getRes("xxxpng");
				var data = RES.getRes("xxxjson");
				var mcf:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, tex);
				this._focusMc = new egret.MovieClip(mcf.generateMovieClipData("focusmc"));
				this._focusMc.x = this._focusMc.width/-2;
				this._focusMc.y = this._focusMc.height/-2;
				this._focusMc.width = this.bitmap.width;
				this._focusMc.height = this.bitmap.height;
			}
			if(val){//如果焦点为true
				this.addChild(this._focusMc);
				this._focusMc.play(-1);
			}
			else{//如果焦点为false
				if(this._focusMc.parent){
					this._focusMc.stop();
					this.removeChild(this._focusMc);//移除mc
				}
			}
			*/

		}

	}

	/*-----------------------------------移动到新位置，乱序操作使用-----------------------------------------*/
	//使用的缓动算法不同
	public speed:number = 700;

	public targetX():number{//目标x轴位置
		var girdwidth:number = (GameData.stageW - 40)/GameData.MaxColumn;
		var xx:number = 20 + girdwidth * (this.location % GameData.MaxColumn) + girdwidth/2 + 5;
		return xx;
	}

	public targetY():number{//目标y轴位置
		var girdwidth:number = (GameData.stageW - 40)/GameData.MaxColumn;
		var startY:number = (GameData.stageH - (GameData.stageW - 30)/6 - 60)- girdwidth * GameData.MaxColumn;
		var yy:number = startY + girdwidth * (Math.floor(this.location/8)) + girdwidth/2 + 5;
		return yy;
	}
	//移动到新位置，使用cubicInOut算法移动，直线运动
	public move(){
		//使用了tween的缓动方法
		var tw:egret.Tween = egret.Tween.get(this);
		//目标x,y的位置，它的运动速度，缓动所需要的时间，缓动算法，egret中的缓动算法有多种，任意挑选
		tw.to({x:this.targetX(),y:this.targetY()},this.speed, egret.Ease.cubicInOut);
	}

	/*-------------------------------------显示元素，从上方掉落----------------------------------------*/
    /*-------------------------------------掉落后添加到父级别显示列表-----------------------------------*/
	//当一个元素从上方掉落时播放动画
	public show(wait:number){
		var tw:egret.Tween = egret.Tween.get(this);//激活一个对象，对其添加tween动画
		tw.wait(wait, false);
		//播放完成之后，执行一个回调函数
		tw.call(this.addThisToParent);
		tw.to({x:this.targetX(),y:this.targetY()},this.speed, egret.Ease.bounceOut);
	}
	//将当前对象添加到它的父级元素当中
	private addThisToParent(){
		if(!this.parent){
			this.thisparent.addChild(this);
		}
	}

	/*--------------------------------------移动并且返回-------------------------------------*/
    /*----------------------用于用户交换两个对象，但未找到能够连接消除的时候使用------------------------*/
	//移动到另外一个位置，然后再移动回来，location：目标的位置，isscale：是否缩放
	public moveAndBack(location:number, isscale:boolean = false){
		var girdwidth:number = (GameData.stageW - 40)/GameData.MaxColumn;
		var xx:number = 20 + girdwidth * (location % GameData.MaxColumn) + girdwidth/2 + 5;
		var startY:number = (GameData.stageH - (GameData.stageW - 30)/6 -60) - girdwidth * GameData.MaxColumn;
		var yy:number = startY + girdwidth * (Math.floor(location/8)) + girdwidth/2 + 5;
		//移动的时候，不仅会移动位置，还会放大或者缩小，移动回来时，scale都设置为1
		var tw:egret.Tween = egret.Tween.get(this);
		//是否缩放定义了缩放的时候会不会变大，如果变大的话，会覆盖在另一张没有变大图片的上方
		if(isscale){
			tw.to({x:xx, y:yy, scaleX:1.2, scaleY:1.2},300, egret.Ease.cubicInOut).call(this.back, this);
		}
		else{
			tw.to({x:xx, y:yy, scaleX:0.8, scaleY:0.8},300, egret.Ease.cubicInOut).call(this.back, this);
		}
	}
	private back(){
		var tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:this.targetX(), y:this.targetY(), scaleX:1, scaleY:1},300, egret.Ease.cubicInOut);
	}

	/*-----------------------------此动画用于移动元素，然后消除--------------------------------------*/
    //移动到另外一个位置，然后再返回原始的scale，location：目标的位置，isscale：是否缩放
	//动画移动之后，元素消失掉，计算完成之后，被消除的那些元素，调用这样一个动画方式
	//首先先移动，移动完成之后缩放一下它的大小，缩放完成之后，直接将它从我们的显示列表当中删除
	public moveAndScale(location:number, isscale:boolean = false){
		var girdwidth:number = (GameData.stageW - 40)/GameData.MaxColumn;
		var xx:number = 20 + girdwidth * (location % GameData.MaxColumn) + girdwidth/2 + 5;
		var startY:number = (GameData.stageH - (GameData.stageW - 30)/6 -60) - girdwidth * GameData.MaxColumn;
		var yy:number = startY + girdwidth * (Math.floor(location/8)) + girdwidth/2 + 5;
		//移动的时候，不仅会移动位置，还会放大或者缩小，移动回来时，scale都设置为1
		var tw:egret.Tween = egret.Tween.get(this);
		//是否缩放定义了缩放的时候会不会变大，如果变大的话，会覆盖在另一张没有变大图片的上方
		if(isscale){
			tw.to({x:xx, y:yy, scaleX:1.4, scaleY:1.4},300, egret.Ease.cubicInOut).call(this.backScale, this);
		}
		else{
			tw.to({x:xx, y:yy, scaleX:0.6, scaleY:0.6},300, egret.Ease.cubicInOut).call(this.backScale, this);
		}
	}
	private backScale() {
		var tw:egret.Tween = egret.Tween.get(this);
		tw.to({scaleX:1, scaleY:1},300, egret.Ease.backOut).call(this.canRemove, this);
	}
	private canRemove() {
		//里面发送了一个REMOVE_ANIMATION_OVER事件，用于外层的动画播放状态的一个计算
		var evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.REMOVE_ANIMATION_OVER);
		this.dispatchEvent(evt);
	}

	/*-----------------此动画用于将元素移动到关卡积分器位置,然后移除显示列表----------------------------*/
    //播放曲线动画，真正的播放曲线，后期可以在此处添加许多播放效果，比如一些粒子特效等等，
	//现在仅仅用一些直线的方式，将元素移动到对应的关卡积分位置，就是我们的head头部分，移动完之后，remove自己，同时发送一个更新地图数据事件
	public playCurveMove(tx:number, ty:number){
		var tw:egret.Tween = egret.Tween.get(this);
		tw.to({x:tx, y:ty},700, egret.Ease.quadOut).call(this.overCurveMove, this);
	}
	public overCurveMove(){
		if(this.parent){
			this.parent.removeChild(this);
		}
		var evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_MAP);
		this.dispatchEvent(evt);
	}

	/*-------------------------删除元素，当元素不属于关卡条件时，执行此动画---------------------------------*/
    //播放直接消除动画,自己放大，然后缩回到原有大小，然后删除
	//因为不是过关条件就不需要飞到head位置，直接播放完了之后，直接从父级消除我们的显示对象
	public playReMoveAni(){
		var tw:egret.Tween = egret.Tween.get(this);
		tw.to({scaleX:1.4, scaleY:1.4},300, egret.Ease.cubicInOut).to({scaleX:0.1, scaleY:0.1},300, egret.Ease.cubicInOut).call(this.removeAniCall, this);
	}
	public removeAniCall(){
		if(this.parent){
			this.parent.removeChild(this);
		}
		var evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_MAP);
		this.dispatchEvent(evt);
	}

    /*-------------------------移动到新位置，方块被消除后重新生成下落使用---------------------------------*/
    //根据列编号，重新计算元素X轴位置，从其实Y轴开始播放下落动画
	//当其他方块被删除，上面的一些方块依次下落
	public moveNewLocation(){
		if(!this.parent){
			var girdwidth:number = (GameData.stageW - 40)/GameData.MaxColumn;
			var startY:number = (GameData.stageH - (GameData.stageW - 30)/6 -60) - girdwidth * GameData.MaxColumn;
			this.y = startY - this.width;
			this.scaleX = 1;
			this.scaleY = 1;
			this.x = this.targetX();
			this.thisparent.addChild(this);
		}
		//移动到新位置，执行下落的一个算法
		egret.Tween.get(this).to({x:this.targetX(),y:this.targetY()},this.speed, egret.Ease.bounceOut).call(this.moveNewLocationOver, this);
	}
	private moveNewLocationOver() {
		var evt:ElementViewManageEvent = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER);
		this.dispatchEvent(evt);
	}
}
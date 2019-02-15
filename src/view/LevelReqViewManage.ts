//关卡元素管理器
class LevelReqViewManage {
	private _layer:egret.Sprite;//元素的显示列表
	public constructor(layer:egret.Sprite) {
		this._layer = layer;
		this.init();
	}

	private elements:LevelElementView[];//将所有的关卡元素都放入到LevelElementView[]中
	private init(){
		this.elements = new Array();
	}
	//数据的变更进行图像的刷新操作
	private stepNumText:egret.BitmapText;
	//创建当前关卡的过关条件元素，根据我们已经初始化计算完成的关卡过关条件来创建对应的图形
	public createCurrentLevelReq(){
		var len:number = GameData.levelreq.getLevelReqNum();//获取过关条件的数量，一共有多少种元素需要消除
		var el:LevelElementView;//创建多个LevelElementView，每个LevelElementView对应一个关卡的图像
		for(var i:number=0; i<len; i++){
			if(this.elements.length <=i){
				el = new LevelElementView();
				this.elements.push(el);//将关卡的图像放入对象池当中
			}
			else{
				el = this.elements[i];
			}
			el.eltype = GameData.levelreq.reqElements[i].type;//对象池，当前所有过关元素的数据，计算他们的type属性
			el.setTexture("e"+el.eltype+"_png");
			el.x = 43 +(5 + el.width) * i;
			el.y = 95;
			el.num = GameData.levelreq.reqElements[i].num;//剩余的数量
			this._layer.addChild(el);
		}
		//设置玩家的移动步数
		if(!this.stepNumText){
			this.stepNumText = new egret.BitmapText();
			this.stepNumText.font = RES.getRes("number_fnt");
			this.stepNumText.x = GameData.stageW - 95;
			this.stepNumText.y = 90;
			this.stepNumText.scaleX = 1.5;
			this.stepNumText.scaleY = 1.5;
			this._layer.addChild(this.stepNumText);
			this.stepNumText.text = GameData.stepNum.toString();
		}
	}

	//判断是否有指定类型，当前消除的指定类型，在当前关卡的过关条件元素中是否存在
	public haveReqType(type:string):boolean{
		var l:number = this.elements.length;
		for(var i:number=0; i<l; i++){
			if(this.elements[i].eltype == type){
				return true;
			}
		}
		return false;
	}

	//通过类型，获取当前元素再视图中的位置信息，元素消除之后要飞到跟他重叠的过关条件元素位置上去，然后再消除
	//通过传递类型的数据，再返回当前这个类型，这个图标在我们界面当中的x轴，y轴的位置
	public getPointByType(type:string):egret.Point{
		var p:egret.Point = new egret.Point();
		var l:number = this.elements.length;
		for(var i:number=0; i<l; i++){
			if(this.elements[i].eltype == type){//哪一个元素的图片和他们的类型相同
				p.x = this.elements[i].x + this.elements[i].width / 2;
				p.y = this.elements[i].y + this.elements[i].width / 2;
			}
		}
		return p;
	}

	//更新数据，更新关卡数据
	public update(){
		var len:number = GameData.levelreq.getLevelReqNum();//获取过关条件的数量，一共有多少种元素需要消除
		for(var i:number=0; i<len; i++){
		//所有的关卡元素this.elements，其中的关卡元素i
			this.elements[i].num = GameData.levelreq.reqElements[i].num;//当前所有过关元素的数据的剩余数量
		}
	}

	//更新步数信息
	public updateStep(){
		this.stepNumText.text = GameData.stepNum.toString();//GameData.stepNum玩家当前的剩余步数
	}
}
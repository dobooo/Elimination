//道具管理器
class PropViewManage {
	private _layer:egret.Sprite;//元素的显示列表
	public constructor(root:egret.Sprite) {
		this._layer = root;
		this.init();
	}

	private _props:PropView[];//创建类的时候需要知道道具的类型，将所有的PropView全都放入到_props当中进行对象池管理
	private init() {
		this._props = new Array();
		this.createData();
	}

	//创建所有道具元素的图片
	private createData() {
		for(var i:number=0; i<5; i++){
			var prop:PropView = new PropView(i);
			prop.x = 15 + (5 + prop.width) * i;
			prop.y = GameData.stageH - prop.height -10;
			this._layer.addChild(prop);
			this._props.push(prop);
			prop.num = Math.floor(Math.random() * 5);
			prop.id = i;
			prop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
		}
	}

	private _currentID:number = -1; //当前点击道具ID，如果为-1，表示没有选中任何道具，如果不为-1表示选中其中一种道具
	public static proptype:number = -1;  //道具类型，当前用户所选取的道具

	private click(evt:egret.TouchEvent) {
		//获取当前的道具类型，设置它的焦点状态
		//如果玩家已经选取了一个道具，再点击道具
		if(this._currentID != -1){
			this._props[this._currentID].setFocus(false);//就是换张图
			//当玩家第二次点击相同元素的时候，我们将这个道具设置成-1，取消选择
			if(this._currentID == (<PropView>evt.currentTarget).id){
				this._currentID = -1;
				PropViewManage.proptype = -1;
			}
			else{
				this._currentID == (<PropView>evt.currentTarget).id
				this._props[this._currentID].setFocus(true);
				PropViewManage.proptype = this._props[this._currentID].proptype;
			}
		}
		else{
			this._currentID == (<PropView>evt.currentTarget).id
			this._props[this._currentID].setFocus(true);
			PropViewManage.proptype = this._props[this._currentID].proptype;
		}
	}
	//使用道具，消除了元素
	public useProp(){
		this._props[this._currentID].num--;
		this._props[this._currentID].setFocus(false);
		this._currentID = -1;
		PropViewManage.proptype = -1;
	}
}
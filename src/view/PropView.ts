//封装道具视图的样式与行为
class PropView extends egret.Sprite{
	//创建类的时候需要知道道具的类型
	public constructor(type:number) {
		super();
		this._type = type;
		this.init();
	}
	private _view_box:egret.Bitmap;//道具盒子
	private _view_activate:egret.Bitmap;//激活道具图像
	private _numText:egret.BitmapText;//数字文本
	private _type:number = -1;//道具类型
	public id:number = -1;

	public get proptype():number{
		return this._type;
	}

	private init(){
		this.createView();
		this.createNumText();
		console.log("创建图像");
		this.addChild(this._view_activate);
		this.addChild(this._view_box);
		this.addChild(this._numText);
		console.log("添加到舞台成功");
		this.setActivaState(true);//设置激活状态
	}

	private createView() {//创建图像
		var _interval:number = 15;//道具盒子之间的间隔
		var _width:number = (GameData.stageW - _interval * 6)/ 5//道具盒子的宽度
		if(!this._view_activate){//如果没有激活道具图像，创建激活道具图像
			this._view_activate = new egret.Bitmap();
			this._view_activate.texture = RES.getRes(this.getActivaStateTexture(this._type));
			this._view_activate.width = _width;
			this._view_activate.height = _width;
		}
		if(!this._view_box){
			this._view_box = new egret.Bitmap();
			this._view_box.texture = RES.getRes("propbox_png");
			this._view_box.width = this._view_activate.width + 10;
			this._view_box.height = this._view_activate.height + 10;
			this._view_box.x = -5;
			this._view_box.y = -5;
		}
	}

	private createNumText() {//创建文本
		this._numText = new egret.BitmapText();
		this._numText.font = RES.getRes("number_fnt");
		this._numText.x = this._view_activate.width - 31;
		console.log("创建文本");
	}
	private _num:number = 0;//道具数量
	public get num():number{
		return this._num;
			
	}
	
	public set num(val:number) {
		this._num = val;
		this._numText.text = val.toString();
		if(val<=0){//道具数量小于或者等于0，需要把激活状态设置为false，关闭当前道具的使用状态
			this.setActivaState(false);
		}
		else{
			this.setActivaState(true);
		}
	}

	private setActivaState(val:boolean){
		this.touchEnabled = val;
		
		if(val){
			this._view_activate.texture = RES.getRes(this.getActivaStateTexture(this._type));
			console.log("设置激活状态成功"); 
			this._numText.font = RES.getRes("number_fnt");
            /* this._view_box.texture = RES.getRes("propbox_png");*/

		}
		else{//将原有的彩色图片改为灰色图片
			this._view_activate.texture = RES.getRes(this.getDisableTexture(this._type));
			this._numText.font = RES.getRes("numberdisable_fnt");
          	/* this._view_box.texture = RES.getRes("propboxdisable_png");*/
		}
	}

	private getFocusTexture(type:number):string{
		var textureName:string = "";
		switch(type){
			case 0:
				textureName = "tongseactive_png";
				break;
			case 1:
				textureName = "zhadanactive_png";
				break;
			case 2:
				textureName = "zhenghangactive_png";
				break;
			case 3:
				textureName = "zhenglieactive_png";
				break;
			case 4:
				textureName = "chanziactive_png";
				break;
			}
			return textureName;
		}
	
	//状态为激活时需要获得的纹理,根据type属性获得不同的纹理名称
	private getActivaStateTexture(type:number):string{
		var textureName:string = "";
		switch(type){
			case 0:
				textureName = "tongse_png";
				break;
			case 1:
                textureName = "zhadan_png";
                break;
            case 2:
                textureName = "zhenghang_png";
                break;
            case 3:
                textureName = "zhenglie_png";
                break;
            case 4:
                textureName = "chanzi_png";
                break;
			}
			return textureName;
	}
	private getDisableTexture(type:number):string{
		var textureName:string = "";
		switch(type){
			case 0:
                textureName = "tongsedisable_png";
                break;
            case 1:
                textureName = "zhadandisable_png";
                break;
            case 2:
                textureName = "zhenghangdisable_png";
                break;
            case 3:
                textureName = "zhengliedisable_png";
                break;
            case 4:
                textureName = "chanzidisable_png";
                break;
		}
		return textureName;
	}
	//设置完焦点之后，需要在上方盖一层焦点图片，图片会盖住道具图片
	public setFocus(val:boolean) {
		if(val){
			this._view_activate.texture = RES.getRes(this.getFocusTexture(this._type));

			/*
			this._view_box.texture = RES.getRes("xxx");
			*/
		}
		else{
			if(this._num>0){
				this._view_activate.texture = RES.getRes(this.getActivaStateTexture(this._type));
			}
			else{
				this._view_activate.texture = RES.getRes(this.getDisableTexture(this._type));
			}

			/*
			this._view_box.texture = RES.getRes("xxx");
			*/
		}
	}
}
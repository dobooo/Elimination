//封装关卡视图的样式与行为，创建多个LevelElementView，每个LevelElementView对应一个关卡的图像
class LevelElementView extends egret.Sprite{
	public constructor() {
		super();
		this.init();
	}
	public eltype:string = "";//代表元素类型

	private bitmap:egret.Bitmap;//元素图
	private checkmarkbit:egret.Bitmap;//对勾图
	private bittext:egret.BitmapText;//数字
	//元素上面所显示的数字
	public set num(val:number){
		//val<=0表示已经没有了，显示一个对号的位图，不再显示数字，把数字移出显示列表
		if(val <= 0){
			if(!this.checkmarkbit){
				this.checkmarkbit = new egret.Bitmap();
				this.checkmarkbit.texture = RES.getRes("checkmark_png");
				this.checkmarkbit.x = (this.bitmap.width - this.checkmarkbit.width)/2;
				this.checkmarkbit.y = this.bitmap.height + this.bitmap.y - this.checkmarkbit.height/2;
				this.addChild(this.checkmarkbit);
				this.removeChild(this.bittext);
			}
		}
		else{//如果val>0，修改位图文本的text值，让它等于我们的数字内容
			this.bittext.text = val.toString();
		}
	}

	public get num():number{
		return Number(this.bittext.text);
	}

	public init(){
		this.touchEnabled = false;
		if(!this.bitmap){
			this.bitmap = new egret.Bitmap();
		}
		//创建所有的位图对象
		var bitwidth:number = (GameData.stageW - 40)/GameData.MaxColumn;
		this.bitmap.width = bitwidth;
		this.bitmap.height = bitwidth;
		this.addChild(this.bitmap);

		this.bittext = new egret.BitmapText();
		this.bittext.font = RES.getRes("number_fnt");//设置文本的字体，位图字体
		this.bittext.text = "0";//设置默认值为0
		this.bittext.x = (bitwidth - this.bittext.width)/2;
		this.bittext.y = this.bitmap.height + this.bitmap.y - this.bittext.height/2;
		this.addChild(this.bittext);
	}
	//设置贴图纹理
	public setTexture(val:string){
		this.bitmap.texture = RES.getRes(val);
	}
}
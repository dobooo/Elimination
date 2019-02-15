//游戏主逻辑
class GameLogic {
	private _gameStage:egret.Sprite;//舞台容器stage，游戏的根容器层级存放在这里，作为初始化参数进行暂存
	public constructor(gameStage:egret.Sprite) {
		this._gameStage = gameStage;
		this.init();
	}

    /*-----------------------------初始化数据,创建各种控制器--------------------------------------*/

	private evm:ElementViewManage;//元素视图控制器
	private levm:LevelReqViewManage;//关卡控制器
	private mapc:MapControl;//地图数据控制器
	private pvm:PropViewManage;//道具控制器

	private init() {
		GameData.initData();//对所有数据进行初始化

		var leveldata = RES.getRes("l1_json");//加载层级数据，初始化GameData数据，这里的加载是获取的意思，Main.ts已经把所有数据加载进来了
		console.log("加载层级数据");
		//地图数据的解析
		MapDataParse.createMapData(leveldata.map);//创建地图数据
		console.log("创建地图数据");
		//关卡数据的解析
		LevelGameDataParse.parseLevelGameData(leveldata);//解析游戏关卡数据

		this.mapc = new MapControl();//创建地图数据管理器
		this.mapc.createElementAllMap();//创建全地图属性

		var gbg:GameBackGround = new GameBackGround();//实例化背景界面类
		this._gameStage.addChild(gbg);
		gbg.changeBackground();//用于每次关卡更新进行重新调用，地图解析完成，可以创建地图数据

		var lec:egret.Sprite = new egret.Sprite();//创建一个空的容器
		this._gameStage.addChild(lec);
		this.levm = new LevelReqViewManage(lec);//创建关卡控制器 创建游戏的关卡视图部分 把空的容器放到关卡控制器当中
		this.levm.createCurrentLevelReq();//创建当前关卡的过关条件元素，根据初始化计算完成的关卡过关条件来创建对应的图形

		var pvmc:egret.Sprite = new egret.Sprite();//创建一个空的容器
		this._gameStage.addChild(pvmc);
		console.log("创建一个空的容器");
		this.pvm = new PropViewManage(pvmc);//创建道具视图管理器
		console.log("创建道具视图管理器");

		var cc:egret.Sprite = new egret.Sprite();//创建一个空的容器
		this._gameStage.addChild(cc);
		this.evm = new ElementViewManage(cc);//创建元素视图控制器
		this.evm.showAllElement();//显示所有元素，并播放出场动画
		this.evm.addEventListener(ElementViewManageEvent.TAP_TWO_ELEMENT, this.viewTouchTap, this);
		this.evm.addEventListener(ElementViewManageEvent.REMOVE_ANIMATION_OVER, this.removeAniOver, this);
		this.evm.addEventListener(ElementViewManageEvent.UPDATE_MAP, this.createNewElement, this);
		this.evm.addEventListener(ElementViewManageEvent.UPDATE_VIEW_OVER,this.checkOtherElementLink,this)
		this.evm.addEventListener(ElementViewManageEvent.USE_PROP_CLICK,this.usePropClick,this)
	}

	/*-----------------------------视图管理器中存在两个被tap的元素，进行判断--------------------------------------*/
	private viewTouchTap(evt:ElementViewManageEvent) {
		var rel:boolean = Linklogic.canMove(evt.ele1, evt.ele2)//从二维地图中判断，两个元素是否可交换位置
		//如果可以交换位置
		if(rel){
			//用户点击两个元素之后，是否可以消除
			console.log("点击两个元素成功")
			var linerel:boolean = Linklogic.isHaveLineByIndex(GameData.elements[evt.ele1].location,GameData.elements[evt.ele2].location);
			//两个位置移动后可以消除
			//执行移动
			if(linerel){
				//移动，然后消除
				this.evm.changeLocationAndScale(evt.ele1,evt.ele2);
				GameData.stepNum--;//更新步数
				this.levm.updateStep();//关卡控制器进行刷新
			}
			//移动后返回原位置
			else{
				this.evm.changeLocationAndBack(evt.ele1,evt.ele2);
			}
		}
		//两个元素从空间位置上不可交换，设置新焦点
		else{
			this.evm.setNewElementFocus(evt.ele2);
		}
	}

	/*-----------------------------元素置换动画播放结束，数据操作，并播放删除动画--------------------------------------*/
    //即将删除的元素移动结束
    //开始搜索删除数据，并且播放删除动画
    //更新地图数据
    //更新其他数据
	//两个元素置换动画播放完成，执行该方法
	private removeAniOver(evt:ElementViewManageEvent){
		var len:number = Linklogic.lines.length;//存放消除的数据，遍历当前已被消除的元素的长度
		var rel:boolean;
		for(var i:number=0; i<len; i++){
			var etype:string = "";
			var l:number = Linklogic.lines[i].length;
			for(var t:number=0; t<l; t++){			
				etype = GameData.elements[Linklogic.lines[i][t]].type;
				//进行类型的判断，判断当前关卡的过关条件是否有相同的类型
				rel = this.levm.haveReqType(etype);
				//有相同关卡类型,运动到指定位置
				if(rel){
					//通过类型，获取当前元素再视图中的位置信息，元素消除之后要飞到跟他重叠的过关条件元素位置上去，然后再消除
					var p:egret.Point = this.levm.getPointByType(etype);
					//减少关卡中元素数量 当玩家消除3个类型1的元素之后，类型1还是过关条件的时候，需要对关卡数据进行修改
					GameData.levelreq.changeReqNum(etype,1);
					//更新关卡数据
					this.levm.update();
					//播放曲线动画，此类型动画用于可消除过关条件得情况，播放完成后，进行数量标记，标记完成后修改显示层级
					this.evm.playReqRemoveAn(Linklogic.lines[i][t], p.x, p.y);
				}
				else{
					//播放放大动画，播放后直接删除,用于可删除元素，但元素类型不是关卡过关条件
					this.evm.playRemoveAni(Linklogic.lines[i][t]);
				}
			}
		}
	}

	/*---------------------------所有元素都删除完毕后，创建新元素，并刷新视图---------------------------------*/
	private createNewElement(evt:ElementViewManageEvent) {
		//地图数据当中的地图位置的刷新
		this.mapc.updateMapLocation();//根据当前删除的地图元素，刷新所有元素的位置
		//刷新之后更新元素的位置，播放一个动画
		this.evm.updateMapData();//打乱顺序之后重新布局
	}

	/*-----------------------------删除动画完成后，检测地图中是否存在剩余可消除元素--------------------------------------*/
	//玩家删除了一组动画，随机选取了新的类型，进行重新的排列的动画效果，掉落完成之后，下面的元素又恰巧被重新连接
	private checkOtherElementLink(evt:ElementViewManage) {
		//地图中还有可消除的元素
		if(Linklogic.isHaveLine()){
			this.removeAniOver(null);//元素置换动画播放结束，数据操作，并播放删除动画
		}
		//地图中没有可消除的元素
		else{
			//下一次移动之后不可以被消除
			if(!Linklogic.isNextHaveLine()){
				var rel:boolean = false;
				//没有可消除的元素了,检查是否存在移动一步可消除的项目
				var next:boolean = true;
				while(next){
					Linklogic.chageOrder();//执行全局乱序
					//地图中没有可消除的元素
					if(!Linklogic.isHaveLine()){
						//下一次移动之后可以被消除
						if(Linklogic.isNextHaveLine()){
							next = false;
							rel = true;
						}
					}
				}
				if(rel){
				this.evm.updateOrder();//视图中乱序移动指令触发
				}	
			}
		}
		//检测步数和关卡数，更新步数与关卡数，检测游戏是否结束
		this.isGameOver();
	}

	/*-----------------------------检测当前游戏是否GameOver------------------------------*/
	private gameoverpanel:GameOverPanel;
	private isGameOver() {
		//当前面板是否被创建
		if(!this.gameoverpanel){
			//步数为0时，游戏结束
			if(GameData.stepNum == 0){
				this.gameoverpanel = new GameOverPanel();
				this._gameStage.addChild(this.gameoverpanel);//把游戏结束面板添加到舞台容器当中
				//当前所有关卡条件是否都被消除掉，判断玩家通关
				if(GameData.levelreq.isClear()){
					this.gameoverpanel.show(true);//展示游戏胜利界面
				}
				else{
					this.gameoverpanel.show(false);//展示游戏失败界面
				}
			}
			//步数不为0时
			else{
				//所有关卡条件都被消除掉，玩家通关
				if(GameData.levelreq.isClear()){
					this.gameoverpanel = new GameOverPanel();
					this._gameStage.addChild(this.gameoverpanel);
					this.gameoverpanel.show(true);//展示游戏胜利界面
				}
			}
		}
	}

	/*-----------------------------携带道具被点击--------------------------------------*/
	private usePropClick(evt:ElementViewManageEvent) {
		//使用道具
		//2个参数：1.道具的类型 2.我们需要操作的那个元素的location数据
		//更新道具视图中的图像和数据
		PropLogic.useProp(PropViewManage.proptype, evt.propToElementLocation);
		//使用道具，消除了元素，更新视图
		this.pvm.useProp();
		//元素置换动画播放结束，数据操作，并播放删除动画
		this.removeAniOver(null);
	}
}
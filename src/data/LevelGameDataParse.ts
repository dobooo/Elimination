//关卡数据解析
class LevelGameDataParse {
	public static parseLevelGameData(val:any){//解析独立数据 json里面解析完是object，定义any可以直接进行设置
		GameData.stepNum = val.step;//玩家的步数 val的数据来自l1.json里面的命名
		GameData.levelStepNum = val.step;//关卡里面的步数
		GameData.elementTypes = val.element;//关卡的类型
		GameData.levelBackgroundImageName = val.levelbgimg;//关卡的背景图
		LevelGameDataParse.parseLevelReq(val.levelreq);//因为是私有数据，公共类数据下方直接调用私有数据
	}
	private static parseLevelReq(val:any) {//解析过关条件
		GameData.levelreq.openChange();//启动关卡条件修改，当玩家完成一关，通关之后，需要将关卡元素清空
		var len:number = val.length;
		for(var i=0; i<len; i++){
			GameData.levelreq.addElement(val[i].type,val[i].num);
		}
	}
}
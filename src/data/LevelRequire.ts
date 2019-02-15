//关卡数据结构设计 
class LevelRequire {
	/*
        过关条件，内置一个数组，用来记录当前关卡需要消除多少种
        类型的元素。
        每种元素要消除的数 量为多少
     */
	public reqElements:LevelRequireElement[];//对象池，当前关卡的元素，所有过关元素的数据

	public constructor() {
		this.reqElements = [];
	}
	//获取过关条件的数量，一共有多少种元素需要消除
	public getLevelReqNum():number{
		return this.reqElements.length;
	}
	//添加关卡元素,添加类型与数据
	public addElement(type:string, num:number){
		var ele:LevelRequireElement = new LevelRequireElement();
		ele.num = num;
		ele.type = type;
		this.reqElements.push(ele);
	}
	//启动关卡条件修改，当玩家完成一关，通关之后，需要将关卡元素清空
	public openChange(){
		this.reqElements = [];
	}
	//减少关卡中元素数量 当玩家消除3个类型1的元素之后，类型1还是过关条件的时候，需要对关卡数据进行修改
	public changeReqNum(type:string, num:number){//type和num为玩家操作的type和num
		var l:number = this.getLevelReqNum();
		for(var i=0; i<l; i++){
			if(this.reqElements[i].type = type){
				this.reqElements[i].num -= num;
				return;
			}
		}
	}
	//当前所有关卡是否都被消除掉，判断玩家是否通关
	public isClear():boolean{
		var l:number = this.getLevelReqNum();
		for(var i=0; i<l; i++){
			if(this.reqElements[i].num > 0){//获得某一个元素的剩余数量不为0，代表未通关
				return false;
			}
		}
		return true;
	}
}
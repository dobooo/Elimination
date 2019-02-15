//地图控制器 
class MapControl {
	public constructor() {
	}

	//创建全地图属性
	public createElementAllMap(){
		this.createAllMap();
	}

	//可以创建任意数量的元素类型
    //在游戏初始时候，根据空行创建元素
    //在游戏过程中，根据数量创建元素
	public createElement(num:number):string[]{//返回一个数组，数组类型是字符串类型
		var types:string[] = [];
		for(var i=0; i<num; i++){
			//方法中传递了10，就返回10个类型，在types中加入数组，只需要10个类型数组
			types.push(this.createType());
		}
		return types;
	}

	//针对某一个数据元素更新它的类型，放入一个ID，对它的type值重新进行设定，具体为随机值，根据ID数，更改type值，也有可能type值不发生改变
	public changeTypeByID(id:number){
		GameData.elements[id].type = this.createType();
	}

	//根据当前删除的地图元素，刷新所有元素的位置
	//元素删除了3个，他们的位置需要重新排列，同时上方的元素需要向下移动，更新位置的功能，反复的计算location属性，计算完成后重新赋值
	public updateMapLocation(){

		//ID去重

		var ids:number[] = [];//用来记录更改的元素
		//存放消除的数据，这个数组记录了当前需要更改元素的所有信息，记录了当前玩家操作之后变化的所有元素
		var len:number = Linklogic.lines.length;
		//通过for循环完成了最基本的去重操作，同时针对每一个元素修改了他们的type值
		for(var i=0; i<len; i++){//里面是个数组，这个数组是一个二维数组，对里面的数据进行循环
			var l:number = Linklogic.lines[i].length;
			for(var t=0; t<l; t++){
				var rel:boolean = false;//创建一个变量，结果默认为false
				var ll:number = ids.length;
				for(var r=0; r<ll; r++){
					//需要进行数据的赋值，把删除的二维数组赋值到一维数组当中
					if(ids[r] == Linklogic.lines[i][t]){//如果当前的二维数组与一维数组相同就不对其进行操作
						rel = true;
					}
				}
				if(!rel){
					//修改其中的元素ID，针对修改的元素进行一个去重操作，如果有发生交叉的十字，其中一个元素的ID会出现两次，要做一个去重
					this.changeTypeByID(Linklogic.lines[i][t]);//更改Linklogic.lines[i][t]的ID
					ids.push(Linklogic.lines[i][t]);//设置完成之后把这个元素加入到数组当中
				}
			}
		}

		//将此次修改的元素，更新他们的位置

		//ids是此次被删除得元素ID，要更新其他得元素位置，并对这几个IDS定制新的类型和位置
		len = ids.length;
		//colarr存储列编号得数据，记录共有几列需要移动位置
		var colarr:number[] = [];//记录每个元素的列编号，因为元素的每次移动是向下移动
		for(var t=0; t<len; t++){
			rel = false;
			for(var i=0; i<colarr.length; i++){
				//有i代表取到了其中的列编号，我们需要重新计算它的行编号，因为下落都是从最顶部进行掉落
				if(colarr[i] == GameData.elements[ids[t]].location % GameData.MaxColumn){//如果当前元素的列编号=游戏元素location列编号
					return true;
				}
			}
			if(!rel){//如果=false，加入到数组当中
				colarr.push(GameData.elements[ids[t]].location % GameData.MaxColumn);
			}
		}

		//重新得到当前这列ID的排序

		//因为需要重新排列，我们需要根据列进行重新的顺序规划
		var coleids:number[];//列进行元素规划，对整行列进行调整
		len = colarr.length;//列编号的长度
		for(var t=0; t<len; t++){
			var newcolids:number[] = [];//当前这个新列的ID
			var removeids:number[] = [];//移除的ID
			for(var i=GameData.MaxRow-1; i>=0; i--){//逆向操作
				rel = false;
				for(var q=0; q<ids.length; q++){//此次修改的元素
					removeids.push(ids[q]);//先把需要移除的id添加进去
					rel = true;
				}
				if(!rel){//如果结果=false，代表不是此次修改的元素
					if(GameData.mapData[i][colarr[t]] != -1){
						newcolids.push(GameData.mapData[i][colarr[t]]);
					}
				}
			}

			//将新数组和要移除的数组进行合并
			newcolids = newcolids.concat(removeids);

			//将元素重新放入map中，并改变元素Location
			
			//如果消除一个横行3个元素，这3个被消除的元素和一共是3列，这些元素存放到数组当中，存放完重新放到map地图当中，更新location属性
			for(var i=GameData.MaxRow-1; i>=0; i--){
				if(GameData.mapData[i][colarr[t]] != -1){
					//把ID赋值给地图当中的元素
					GameData.mapData[i][colarr[t]] = newcolids[0];
					//更新location属性，然后删除第一位元素
					GameData.elements[newcolids[0]].location = i * GameData.MaxRow + colarr[t];
					newcolids.shift();

				}
			}
		}
	}

	//创建全部地图元素
    //游戏开始时调用
	private createAllMap() {
		//获取所有的元素数量，获取最大的元素数量
		var len:number = GameData.MaxRow * GameData.MaxColumn;
		var type:string = "";
		var havelink:boolean = true;//是否存在连接
		var id:number = 0;
		var ztype:string = "";//记录上方两个元素相同时的元素类型
		var htype:string = "";//记录左侧两个元素相同时的元素类型
		for(var i=0; i<GameData.MaxRow; i++){
			for(var t=0; t<GameData.MaxColumn; t++){
				//如果出现3个相连的情况，重新生成元素类型
				while(havelink){
					type = this.createType();
					//不能出现3个相连的情况
					//纵向判断
					if(i>1 && GameData.mapData[i-1][t] != -1 && GameData.mapData[i-2][t] != -1){
						//当前上一行，上方的两个元素是否相同
						if(GameData.elements[GameData.mapData[i-1][t]].type == GameData.elements[GameData.mapData[i-2][t]].type){
							//根据它当前的行数位置，来获取它上方的元素类型，记录变量的作用是一开始生成元素的时候，能够不发生自动连接的情况
							ztype = GameData.elements[GameData.mapData[i-1][t]].type;
						}
					}
					//横向判断
					if(t>1 && GameData.mapData[i][t-1] != -1 && GameData.mapData[i][t-2] != -1){
						//当前行，左侧的两个元素是否相同
						if(GameData.elements[GameData.mapData[i][t-1]].type == GameData.elements[GameData.mapData[i][t-2]].type){
							//根据它当前的行数位置，来获取它上方的元素类型，记录变量的作用是一开始生成元素的时候，能够不发生自动连接的情况
							htype = GameData.elements[GameData.mapData[i][t-1]].type;
						}
					}
					//如果当前的元素类型!=ztype&&htype，不存在连接，不可以被消除
					if(type != ztype && type != htype){
						havelink = false;
					}
				}
				id = GameData.unusedElements[0];//id为没有使用的元素id
				GameData.elements[id].type = type;//通过id来创建当前这个元素的type值
				GameData.elements[id].location = GameData.MaxRow * i + t;//获取元素位置
				GameData.mapData[i][t] = id;
				GameData.unusedElements.shift();//把未使用的第一位元素删除
				havelink = true;//重置状态
				ztype = "";
				htype = "";
			}
		}
	}
	//随机生成一个元素类型
	private createType():string {
		//获取当前元素的数组，当前关卡能够出现的元素
		return GameData.elementTypes[Math.floor(Math.random()*GameData.elementTypes.length)].toString();
	}
}
//算法文档
class Linklogic {

	//存放消除的数据
	public static lines:number[][];

	//搜索后可消除的数据，寻找可消除元素算法
	public static isHaveLine():boolean {
		Linklogic.lines = [];//数组初始化
		var currentType:string = "";//标记当前类型的存储器
		var typeNum:number = 0;//当前检索类型的数量
		//检索整个列
		for (var i=0; i<GameData.MaxRow; i++){
			//按行进行检索，检索一行当中的元素，判断了其中的一行
			for(var t=0; t<GameData.MaxColumn; t++){
				//地图数据当中-1表示不可用，不是-1表示有元素或者没有元素
				//当前类型不为-1的操作
				if(GameData.mapData[i][t] != -1){
					//当前类型与已标记类型不同，如果不同，代表上一组的检测结束了
					//当前类型与已标记类型不同的操作
					if(currentType != GameData.elements[GameData.mapData[i][t]].type){
						//如果上一组，计数>=3，上一组有3个或者3个以上的元素相连，是能够被消除的
						if(typeNum >= 3){
							var arr:number[] = [];//把刚才那组数据全部加入到这个数组当中
							for(var q=0; q<typeNum; q++){
								arr.push(GameData.mapData[i][t-q-1]);
							}
							Linklogic.lines.push(arr);
						}
						//如果类型不同了，要把当前这个类型进行更新,类型更新之后，新类型的计数器+1
						currentType = GameData.elements[GameData.mapData[i][t]].type;
						typeNum = 1;
					}
					//当前类型与已标记类型相同的操作
					else{
						typeNum++;
					}
				}
				//当前类型为-1的操作，相当于数据被截断了，被截断相当于对前期数据进行判断
				else{
					//如果上一组，计数>=3，上一组有3个或者3个以上的元素相连，是能够被消除的
					if(typeNum >=3){
						var arr:number[] = [];//把刚才那组数据全部加入到这个数组当中
							for(var q=0; q<typeNum; q++){
								arr.push(GameData.mapData[i][t-q-1]);
							}
							Linklogic.lines.push(arr);
					}
					//方块为-1，没有任何类型，将方块记录为
					currentType = '';
					typeNum = 0;
				}
			}
			//前面数据计算完成要做一个结尾处理，在一行处理之后要将所有的数据进行最终确认，有3个方块相连，但是在行结尾的情况
			//如果上一组，计数>=3，上一组有3个或者3个以上的元素相连，是能够被消除的
			if(typeNum >=3){
				var arr:number[] = [];//把刚才那组数据全部加入到这个数组当中
					for(var q=0; q<typeNum; q++){
						arr.push(GameData.mapData[i][t-q-1]);
					}
					Linklogic.lines.push(arr);
			}
			//方块为-1，没有任何类型，将方块记录为
			currentType = '';
			typeNum = 0;
		}
		//对列进行检索
		for(i=0; i<GameData.MaxRow; i++){
			for(t=0; t<GameData.MaxColumn; t++){
				//先判断-1的数据
				if(GameData.mapData[t][i] != -1){
					if(currentType != GameData.elements[GameData.mapData[t][i]].type){
						if(typeNum >=3){
							var arr:number[] = [];
							for(q=0; q<typeNum; q++){
								arr.push(GameData.mapData[t-q-1][i]);
							}
							Linklogic.lines.push(arr);
						}
						currentType = GameData.elements[GameData.mapData[t][i]].type;
						typeNum = 1;
					}
					else{
						typeNum++;
					}
				}
				else{
					if(typeNum >=3){
							var arr:number[] = [];
							for(q=0; q<typeNum; q++){
								arr.push(GameData.mapData[t-q-1][i]);
							}
							Linklogic.lines.push(arr);
						}
						currentType = '';
						typeNum = 0;
				}
			}
			if(typeNum >=3){
				var arr:number[] = [];
				for(q=0; q<typeNum; q++){
					arr.push(GameData.mapData[t-q-1][i]);
				}
				Linklogic.lines.push(arr);
			}
			currentType = '';
			typeNum = 0;
		}
		if(Linklogic.lines.length != 0){
			return true;
		}
		return false;
	}

	//预检测可消除算法
	//逐个分析，搜索横向与纵向两种情况，同时每个方向有两种拼接方式
    //-------方式1-------
	//   口    口
    // 口  ▇ ▇  口
    //   口    口
    //-------方式2--------
    //    口
    //  ▇  ▇
    //    口
	public static isNextHaveLine():boolean{
		//先计算行
		for(var i=0; i<GameData.MaxRow; i++){
			for(var t=0; t<GameData.MaxColumn; t++){
				//当前元素的值不为=-1，为-1，不进行判断
				//对当前元素进行判断
				if(GameData.mapData[i][t] != -1){
					//-------方式1-------
					//对当前元素的右侧一个元素进行判断
					//先排除极限值的算法,t<最大列-1，它不是靠在最右侧的方块
					//有一种情况是地图的方块=-1,地图方块=-1表示这个方块不可放置元素
					//再判断这个值的当前这个元素和它右侧这个元素的类型是否一致，如果相同，则做排序的操作
					//当前方块元素是否与下一方块元素一致
					if(t<GameData.MaxColumn-1 && GameData.mapData[i][t+1] != -1 && GameData.elements[GameData.mapData[i][t+1]].type == GameData.elements[GameData.mapData[i][t]].type){
						//寻找周围的6个点，周围6个点决定是否能够被消除
						//判断左边是否有空的方块
						if(t>0 && GameData.mapData[i][t-1] != -1){
							//横向判断，寻找左边的三个方块
							//先判断不越界，再判断不为空不为-1，再判断类型
							//函数if语句中会自己判断GameData.mapData[i-1][t-1]不为空,不为-1，代表GameData.mapData[i-1][t-1]有值
							if(i>0 && t>0 && GameData.mapData[i-1][t-1] && GameData.mapData[i-1][t-1] != -1 && GameData.elements[GameData.mapData[i-1][t-1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
							if(i<(GameData.MaxRow-1) && t>0 && GameData.mapData[i+1][t-1] && GameData.mapData[i+1][t-1] != -1 && GameData.elements[GameData.mapData[i+1][t-1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
							if(t>1 && GameData.mapData[i][t-2] && GameData.mapData[i][t-2] != -1 && GameData.elements[GameData.mapData[i][t-2]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
						}
						//判断右侧是否有空的方块,教程中t<GameData.MaxColumn-1，暂时不知为什么这边要-1，始终认为此处需要-2
						if(t<GameData.MaxColumn-2 && GameData.mapData[i][t+2] != -1){
							//横向判断，寻找右边的三个方块
							if(i>0 && t<(GameData.MaxColumn-2) && GameData.mapData[i-1][t+2] && GameData.mapData[i-1][t+2] != -1 && GameData.elements[GameData.mapData[i-1][t+2]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
							if(t<(GameData.MaxColumn-3) && GameData.mapData[i][t+3] && GameData.mapData[i][t+3] != -1 && GameData.elements[GameData.mapData[i][t+3]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
							if(i<(GameData.MaxRow-1) && t<(GameData.MaxColumn-2) && GameData.mapData[i+1][t+2] && GameData.mapData[i+1][t+2] != -1 && GameData.elements[GameData.mapData[i+1][t+2]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
						}
					}
					//对当前元素的下面一个元素进行判断
					if(i<GameData.MaxRow-1 && GameData.mapData[i+1][t] != -1 && GameData.elements[GameData.mapData[i+1][t]].type == GameData.elements[GameData.mapData[i][t]].type){
						//判断上方是否有空的方块
						if(i>0 && GameData.mapData[i-1][t] != -1){
							//纵向判断，寻找上面的三个方块
							if(i>1 && GameData.mapData[i-2][t] && GameData.mapData[i-2][t] != -1 && GameData.elements[GameData.mapData[i-2][t]].type == GameData.elements[GameData[i][t]].type){
								return true;
							}
							if(i>0 && t>0 && GameData.mapData[i-1][t-1] && GameData.mapData[i-1][t-1] != -1 && GameData.elements[GameData.mapData[i-1][t-1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
							if(i>0 && t<(GameData.MaxColumn-1) && GameData.mapData[i-1][t+1] && GameData.mapData[i-1][t+1] != -1 && GameData.elements[GameData.mapData[i-1][t+1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
						}
						//判断下方是否有空的方块
						if(i<(GameData.MaxRow-2) && GameData.mapData[i+2][t] != -1){
							//纵向判断，寻找下面的三个方块
							if(i<(GameData.MaxRow-2) && t>0 && GameData.mapData[i+2][t-1] && GameData.mapData[i+2][t-1] != -1 && GameData.elements[GameData.mapData[i+2][t-1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
							if(i<(GameData.MaxRow-2) && t<(GameData.MaxColumn-1) && GameData.mapData[i+2][t+1] && GameData.mapData[i+2][t+1] != -1 && GameData.elements[GameData.mapData[i+2][t+1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
							if(i<(GameData.MaxRow-3) && GameData.mapData[i+3][t] && GameData.mapData[i+3][t] != -1 && GameData.elements[GameData.mapData[i+3][t]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
						}
					}
					//-------方式2--------
					//对当前元素的右侧第2个方块进行判断
					if(t<(GameData.MaxColumn-2) && GameData.mapData[i][t+2] != -1 && GameData.elements[GameData.mapData[i][t+2]].type == GameData.elements[GameData.mapData[i][t]].type){
						//判断中间是否有空的方块
						if(t<(GameData.MaxColumn-1) && GameData.mapData[i][t+1] != -1){
							if(i>0 && t<(GameData.MaxColumn-1) && GameData.mapData[i-1][t+1] && GameData.mapData[i-1][t+1] != -1 && GameData.elements[GameData.mapData[i-1][t+1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
							if(i<(GameData.MaxRow-1) && t<(GameData.MaxColumn-1) && GameData.mapData[i+1][t+1] && GameData.mapData[i+1][t+1] != -1 && GameData.elements[GameData.mapData[i+1][t+1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
						}
					}
					//对当前元素的下方第2个方块进行判断
					if(i<(GameData.MaxRow-2) && GameData.mapData[i+2][t] != -1 && GameData.elements[GameData.mapData[i+2][t]].type == GameData.elements[GameData.mapData[i][t]].type){
						//判断中间是否有空的方块
						if(i<(GameData.MaxRow-1) && GameData.mapData[i+1][t] != -1){
							if(i<(GameData.MaxRow-1) && t>0 && GameData.mapData[i+1][t-1] && GameData.mapData[i+1][t-1] != -1 && GameData.elements[GameData.mapData[i+1][t-1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
							if(i<(GameData.MaxRow-1) && t<(GameData.MaxColumn-1) && GameData.mapData[i+1][t+1] && GameData.mapData[i+1][t+1] != -1 && GameData.elements[GameData.mapData[i+1][t+1]].type == GameData.elements[GameData.mapData[i][t]].type){
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	}

	//判断是否两个元素可以交换移动,选中的两个元素
	public static canMove(id1:number,id2:number):boolean{
		//获取两个元素的行与列
		//表示第一个元素的行,元素的location属性代表元素在方块中的哪一个位置
		var l1row:number = Math.floor(GameData.elements[id1].location/GameData.MaxRow);
		var l1col:number = GameData.elements[id1].location % GameData.MaxColumn;//对元素的实际编号进行求余

		var l2row:number = Math.floor(GameData.elements[id2].location/GameData.MaxRow);
		var l2col:number = GameData.elements[id2].location % GameData.MaxColumn;

		if(l1row == l2row){
			if(Math.abs(l1col-l2col) == 1){
				return true;
			}
		}
		if(l1col == l2col){
			if(Math.abs(l1row-l2row) == 1){
				return true;
			}
		}
		return false;
	}

	//全局乱序算法，当玩家当前的全部元素都无法进行移动时使用该算法
	public static chageOrder(){
		//把当前所有的元素放到一个一维数组当中
		var arr:number[] = [];
		for(var i=0; i<GameData.MaxRow; i++){
			for(var t=0; t<GameData.MaxColumn; t++){
				//一些地图元素的值为-1，表示当前这个位置不可用，需排除这些元素，再将里面的具体数据放入数组当中
				if(GameData.mapData[i][t] != -1){
					arr.push(GameData.mapData[i][t]);
				}
			}
		}
		//编写随机数
		var index:number = 0;//作为暂存数据,存放随机出的具体数的一位数组的下标，之后用于存放到地图数据当中
		for(var i=0; i<GameData.MaxRow; i++){
			for(var t=0; t<GameData.MaxColumn; t++){
				//随机数的计算，不能超出数组的长度，不能小于0，否则就会发生下标越界
				index = Math.floor(Math.random() * arr.length);
				GameData.mapData[i][t] = arr[index];
				//修改元素的location属性
				GameData.elements[arr[index]].location = i * GameData.MaxColumn + t;
				//因为这个元素已经被取出来了，所以接下来要做把这个元素删除的操作
				arr.slice(index, i);
			}
		}
	}

	//空间交换链接消除算法
	//用户点击两个元素之后，是否可以互相交换
	//交换是否可以消除
	//空间更新，放入数据控制器中
	public static isHaveLineByIndex(p1:number, p2:number):boolean{
		//p1是交换的第一个location属性，p2是交换的第二个location属性
		var p1n:number = p1;
		var p2n:number = p2;
		//只知道它的位置编号通过它的位置编号换算出行数和列数兑换出的结果在mapData中进行查找
		var p1id:number = GameData.mapData[Math.floor(p1 / GameData.MaxColumn)][p1 % GameData.MaxRow];
		var p2id:number = GameData.mapData[Math.floor(p2 / GameData.MaxColumn)][p2 % GameData.MaxRow];
		//通过mapData将他们的数据进行交换
		GameData.mapData[Math.floor(p1 / GameData.MaxColumn)][p1 % GameData.MaxRow] = p2id;
		GameData.mapData[Math.floor(p2 / GameData.MaxColumn)][p2 % GameData.MaxRow] = p1id;
		//判断交换之后是否能够正常连线
		var rel:boolean = Linklogic.isHaveLine();
		if(rel){
			//如果两个点可以进行交换，将两个元素的location属性进行交换
			GameData.elements[p1id].location = p2;
			GameData.elements[p2id].location = p1;
			return true;
		}
		else{
			//如果两个点交换后不可进行消除，把两个点再换回来
			GameData.mapData[Math.floor(p1 / GameData.MaxColumn)][p1 % GameData.MaxRow] = p1id;
			GameData.mapData[Math.floor(p2 / GameData.MaxColumn)][p2 % GameData.MaxRow] = p2id;
		}
		return false;
	}
}
//地图数据解析
class MapDataParse {
	//解析地图数据中不可用元素
	public static createMapData(val:number[]):void{//传入一个数组，而且数组里面的类型是number类型
		var len:number = val.length;//传入数组的长度
		GameData.unmapnum = len;//未使用地图的数量，有多少个方块在这个地图当中是灰色的，不显示的
		var index:number = 0;//数组当中的编号
		for(var i=0; i<len; i++){
			index = val[i]//取出数组里面的值，编号数据第x的方块是不可用的，
			var row:number = Math.floor(index/GameData.MaxColumn);
			var column:number = index % GameData.MaxRow;
			GameData.mapData[row][column] = -1;//-1表示方块不可用
		}
		GameData.currentElementNum = GameData.MaxRow * GameData.MaxColumn -len;//当前关卡游戏中，地图的可用元素数量
	}
}
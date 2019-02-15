var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//地图数据解析
var MapDataParse = (function () {
    function MapDataParse() {
    }
    //解析地图数据中不可用元素
    MapDataParse.createMapData = function (val) {
        var len = val.length; //传入数组的长度
        GameData.unmapnum = len; //未使用地图的数量，有多少个方块在这个地图当中是灰色的，不显示的
        var index = 0; //数组当中的编号
        for (var i = 0; i < len; i++) {
            index = val[i]; //取出数组里面的值，编号数据第x的方块是不可用的，
            var row = Math.floor(index / GameData.MaxColumn);
            var column = index % GameData.MaxRow;
            GameData.mapData[row][column] = -1; //-1表示方块不可用
        }
        GameData.currentElementNum = GameData.MaxRow * GameData.MaxColumn - len; //当前关卡游戏中，地图的可用元素数量
    };
    return MapDataParse;
}());
__reflect(MapDataParse.prototype, "MapDataParse");
//# sourceMappingURL=MapDataParse.js.map
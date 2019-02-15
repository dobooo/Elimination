var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//游戏基础基础数据封装，零碎数据的整合
//数据包括：玩家移动的步数，当前关卡背景根据不同关卡更换不同的背景，最大行数，最大列数，空白地图的数量
//单例模式，数据是唯一的，防止在游戏过程当中一个唯一数据出现多个内存副本，通过静态数据和静态方法实现
var GameData = (function () {
    function GameData() {
    }
    //对所有数据进行初始化
    GameData.initData = function () {
        //地图数据初始化
        GameData.mapData = new Array();
        for (var i = 0; i < GameData.MaxRow; i++) {
            var arr = new Array();
            GameData.mapData.push(arr);
            for (var t = 0; t < GameData.MaxColumn; t++) {
                //对于一个地图当中的元素，默认存放的是元素的ID，
                //如果存放的是-1，表示当前地图无法使用，如果为-2，表示当前这块地图是空的，可以使用，但是还没有放置任何元素的ID
                GameData.mapData[i].push(-2); //为每一个元素里面存放一个数据，
            }
        }
        //关卡数据初始化
        GameData.levelreq = new LevelRequire();
        //游戏元素的初始化
        GameData.elements = new Array();
        //未使用元素的初始化
        GameData.unusedElements = new Array();
        var len = GameData.MaxRow * GameData.MaxColumn;
        for (var q = 0; q < len; q++) {
            var ele = new GameElement(); //创建游戏元素
            ele.id = q;
            GameData.elements.push(ele);
            GameData.unusedElements.push(q); //未使用的元素填入元素的下标
        }
        GameData.stageW = egret.MainContext.instance.stage.stageWidth; //获取舞台的宽度
        GameData.stageH = egret.MainContext.instance.stage.stageHeight; //获取舞台的高度
    };
    GameData.unmapnum = 0; //标识当前地图当中还没有放置元素的，未使用地图的数量，有多少个方块在这个地图当中是灰色的，不显示的
    GameData.stepNum = 0; //玩家当前的剩余步数
    GameData.levelStepNum = 0; //当前关卡要求的步数 如果玩家的步数>关卡要求的步数，游戏结束
    GameData.levelBackgroundImageName = ''; //当前关卡的背景图
    GameData.MaxRow = 8; //行数
    GameData.MaxColumn = 8; //列数
    GameData.currentElementNum = 0; //当前关卡游戏中，地图的可用元素数量
    GameData.stageW = 0; //舞台的宽度
    GameData.stageH = 0; //舞台的高度
    return GameData;
}());
__reflect(GameData.prototype, "GameData");
//# sourceMappingURL=GameData.js.map
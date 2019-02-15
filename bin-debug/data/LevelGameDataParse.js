var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//关卡数据解析
var LevelGameDataParse = (function () {
    function LevelGameDataParse() {
    }
    LevelGameDataParse.parseLevelGameData = function (val) {
        GameData.stepNum = val.step; //玩家的步数 val的数据来自l1.json里面的命名
        GameData.levelStepNum = val.step; //关卡里面的步数
        GameData.elementTypes = val.element; //关卡的类型
        GameData.levelBackgroundImageName = val.levelbgimg; //关卡的背景图
        LevelGameDataParse.parseLevelReq(val.levelreq); //因为是私有数据，公共类数据下方直接调用私有数据
    };
    LevelGameDataParse.parseLevelReq = function (val) {
        GameData.levelreq.openChange(); //启动关卡条件修改，当玩家完成一关，通关之后，需要将关卡元素清空
        var len = val.length;
        for (var i = 0; i < len; i++) {
            GameData.levelreq.addElement(val[i].type, val[i].num);
        }
    };
    return LevelGameDataParse;
}());
__reflect(LevelGameDataParse.prototype, "LevelGameDataParse");
//# sourceMappingURL=LevelGameDataParse.js.map
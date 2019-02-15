var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//关卡数据结构设计 
var LevelRequire = (function () {
    function LevelRequire() {
        this.reqElements = [];
    }
    //获取过关条件的数量，一共有多少种元素需要消除
    LevelRequire.prototype.getLevelReqNum = function () {
        return this.reqElements.length;
    };
    //添加关卡元素,添加类型与数据
    LevelRequire.prototype.addElement = function (type, num) {
        var ele = new LevelRequireElement();
        ele.num = num;
        ele.type = type;
        this.reqElements.push(ele);
    };
    //启动关卡条件修改，当玩家完成一关，通关之后，需要将关卡元素清空
    LevelRequire.prototype.openChange = function () {
        this.reqElements = [];
    };
    //减少关卡中元素数量 当玩家消除3个类型1的元素之后，类型1还是过关条件的时候，需要对关卡数据进行修改
    LevelRequire.prototype.changeReqNum = function (type, num) {
        var l = this.getLevelReqNum();
        for (var i = 0; i < l; i++) {
            if (this.reqElements[i].type = type) {
                this.reqElements[i].num -= num;
                return;
            }
        }
    };
    //当前所有关卡是否都被消除掉，判断玩家是否通关
    LevelRequire.prototype.isClear = function () {
        var l = this.getLevelReqNum();
        for (var i = 0; i < l; i++) {
            if (this.reqElements[i].num > 0) {
                return false;
            }
        }
        return true;
    };
    return LevelRequire;
}());
__reflect(LevelRequire.prototype, "LevelRequire");
//# sourceMappingURL=LevelRequire.js.map
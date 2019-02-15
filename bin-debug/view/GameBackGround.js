var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
//背景界面类
//因为这个类需要在显示列表显示，所以这个类继承自egret.Sprite
var GameBackGround = (function (_super) {
    __extends(GameBackGround, _super);
    function GameBackGround() {
        return _super.call(this) || this;
    }
    //用于每次关卡更新进行重新调用
    GameBackGround.prototype.changeBackground = function () {
        this.cacheAsBitmap = false;
        this.removeChildren(); //移除界面上所有的内容
        this.createBackGroundImage(); //创建背景图
        this.createMapBg(); //创建地图网格
        this.createLevelReqBg(); //创建关卡背景图
        this.createStepBg(); //创建剩余步数
        this.cacheAsBitmap = true; //将所有的图片默认当成一张图片进行处理
    };
    //创建背景图
    GameBackGround.prototype.createBackGroundImage = function () {
        //背景图片没有初始化，先初始化背景图片
        if (!this.bgImage) {
            this.bgImage = new egret.Bitmap();
        }
        //初始化之后，添加texture属性
        this.bgImage.texture = RES.getRes(GameData.levelBackgroundImageName);
        this.bgImage.width = GameData.stageW;
        this.bgImage.height = GameData.stageH;
        this.addChild(this.bgImage);
        //道具背景的浅黑色半透明的图
        var propbg = new egret.Bitmap();
        propbg.texture = RES.getRes("propbg_png"); //xxx具体参照resdpot生成的默认图片ID
        propbg.width = GameData.stageW;
        propbg.height = GameData.stageH / 5 + 20;
        propbg.y = GameData.stageH - propbg.height;
        this.addChild(propbg);
    };
    //创建格子图
    GameBackGround.prototype.createMapBg = function () {
        //创建一个数组，数组所有的元素都是Bitmap位图
        if (!this.girdBg) {
            this.girdBg = new Array();
        }
        //建立小格子方块，小个子方块就是格子图内的元素
        var gird;
        var girdwidth = (GameData.stageW - 40) / GameData.MaxColumn;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.MaxColumn;
        for (var i; i < GameData.MaxRow; i++) {
            for (var t; t < GameData.MaxColumn; i++) {
                if (GameData.mapData[i][t] != -1) {
                    //创建N多个Bitmap对象
                    if (this.girdBg.length < i * GameData.MaxRow + t) {
                        this.girdBg.push(gird);
                    }
                    else {
                        gird = this.girdBg[i * GameData.MaxRow + t];
                    }
                    gird.width = girdwidth;
                    gird.height = girdwidth;
                    gird.x = 20 + girdwidth * t;
                    gird.y = startY + girdwidth * i;
                    //如果是单数行设置一个皮肤，如果是双数行设置一个皮肤
                    if ((i % 2 == 0 && t % 2 == 0) || (i % 2 == 1 && t % 2 == 1)) {
                        gird.texture = RES.getRes("elementbg1_png");
                    }
                    else {
                        gird.texture = RES.getRes("elementbg2_png");
                    }
                    this.addChild(gird);
                }
            }
        }
    };
    //关卡的背景图片，每个关卡的主体背景不是同一张图片，而是我们后面一个UI元素
    GameBackGround.prototype.createLevelReqBg = function () {
        var girdwidth = (GameData.stageW - 40) / GameData.MaxColumn;
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes("levelreqbg_png");
        //获取过关条件的数量，一共有多少种元素需要消除
        bg.width = GameData.levelreq.getLevelReqNum() * (10 + girdwidth) + 20;
        bg.height = girdwidth + 60;
        bg.x = 20;
        bg.y = 50;
        this.addChild(bg);
        var bgtxt = new egret.Bitmap();
        bgtxt.texture = RES.getRes("levelreqtitle_png");
        bgtxt.x = bg.x + (bg.width - bgtxt.width) / 2;
        bgtxt.y = bg.y - 18;
        this.addChild(bgtxt);
    };
    //剩余步数的背景图
    GameBackGround.prototype.createStepBg = function () {
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes("levelregbg_png");
        bg.width = 100;
        bg.height = 100;
        bg.x = GameData.stageW - 110;
        bg.y = 50;
        this.addChild(bg);
        var bgtxt = new egret.Bitmap();
        bgtxt.texture = RES.getRes("sursteptitle_png");
        bgtxt.x = bg.x + (bg.width - bgtxt.width) / 2;
        bgtxt.y = bg.y + 10;
        this.addChild(bgtxt);
    };
    return GameBackGround;
}(egret.Sprite));
__reflect(GameBackGround.prototype, "GameBackGround");
//# sourceMappingURL=GameBackGround.js.map
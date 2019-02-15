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
//封装游戏结束画面版的样式与行为
var GameOverPanel = (function (_super) {
    __extends(GameOverPanel, _super);
    function GameOverPanel() {
        var _this = _super.call(this) || this;
        _this._issuccess = false; //游戏是否过关了
        return _this;
    }
    GameOverPanel.prototype.show = function (issuccess) {
        this._issuccess = issuccess;
        console.log("播放动画");
        this._view = new egret.Bitmap();
        this._view.texture = RES.getRes("level_0002_background_png"); //定义了一个背景图，背景图是一定存在的
        this._view.width = GameData.stageW - 30;
        this._view.height = GameData.stageH / 2;
        this._view.x = this._view.width / -2;
        this._view.y = this._view.height / -2;
        this.addChild(this._view);
        this.x = GameData.stageW / 2;
        this.y = GameData.stageH / 2;
        this.scaleX = 0.1;
        this.scaleY = 0.1;
        egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 700, egret.Ease.backOut).call(this.playStarAni, this);
    };
    GameOverPanel.prototype.playStarAni = function () {
        /*
        var gameover:egret.Bitmap = new egret.Bitmap();
        gameover.texture = RES.getRes("gameovertitle_png");
        gameover.width = this._view.width / 2;
        gameover.height = 60;
        gameover.x = this._view.x + (this._view.width - gameover.width) / 2;
        gameover.y = this._view.y -10;
        gameover.scaleX = 0;
        gameover.scaleY = 0;
        this.addChild(gameover);
        egret.Tween.get(gameover).to({scaleX:1, scaleY:1}, 700, egret.Ease.bounceOut);
        */
        //如果过关了播放一张图片，如果没过关播放另一张图片
        console.log("播放失败动画");
        //成功动画
        if (this._issuccess) {
            var success1 = new egret.Bitmap();
            success1.texture = RES.getRes("success_png");
            success1.width = (this._view.width - 50) / 3;
            success1.height = success1.width;
            success1.x = (GameData.stageW - success1.width * 2) / 3 + this._view.x;
            success1.y = 150 + this._view.y;
            success1.scaleX = 1.5;
            success1.scaleY = 1.5;
            success1.alpha = 0;
            this.addChild(success1);
            egret.Tween.get(success1).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 700, egret.Ease.circIn);
            var success2 = new egret.Bitmap();
            success2.texture = RES.getRes("success_png");
            success2.width = (this._view.width - 50) / 3;
            success2.height = success2.width;
            success2.x = (GameData.stageW - success2.width * 2) / 3 + this._view.x;
            success2.y = 150 + this._view.y;
            success2.scaleX = 1.5;
            success2.scaleY = 1.5;
            success2.alpha = 0;
            this.addChild(success2);
            egret.Tween.get(success2).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 700, egret.Ease.circIn);
        }
        else {
            var fault1 = new egret.Bitmap();
            fault1.texture = RES.getRes("fail_png");
            fault1.width = (this._view.width - 50) / 3;
            fault1.height = fault1.width;
            fault1.x = (GameData.stageW - fault1.width * 2) / 3 + this._view.x;
            fault1.y = 150 + this._view.y;
            fault1.scaleX = 1.5;
            fault1.scaleY = 1.5;
            fault1.alpha = 0;
            this.addChild(fault1);
            egret.Tween.get(fault1).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 700, egret.Ease.circIn);
            var fault2 = new egret.Bitmap();
            fault2.texture = RES.getRes("fail_png");
            fault2.width = (this._view.width - 50) / 3;
            fault2.height = fault2.width;
            fault2.x = (GameData.stageW - fault2.width * 2) / 3 + this._view.x;
            fault2.y = 150 + this._view.y;
            fault2.scaleX = 1.5;
            fault2.scaleY = 1.5;
            fault2.alpha = 0;
            this.addChild(fault2);
            egret.Tween.get(fault2).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 700, egret.Ease.circIn);
        }
    };
    return GameOverPanel;
}(egret.Sprite));
__reflect(GameOverPanel.prototype, "GameOverPanel");
//# sourceMappingURL=GameOverPanel.js.map
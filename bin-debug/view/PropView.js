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
//封装道具视图的样式与行为
var PropView = (function (_super) {
    __extends(PropView, _super);
    //创建类的时候需要知道道具的类型
    function PropView(type) {
        var _this = _super.call(this) || this;
        _this._type = -1; //道具类型
        _this.id = -1;
        _this._num = 0; //道具数量
        _this._type = type;
        _this.init();
        return _this;
    }
    Object.defineProperty(PropView.prototype, "proptype", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    PropView.prototype.init = function () {
        this.createView();
        this.createNumText();
        console.log("创建图像");
        this.addChild(this._view_activate);
        this.addChild(this._view_box);
        this.addChild(this._numText);
        console.log("添加到舞台成功");
        this.setActivaState(true); //设置激活状态
    };
    PropView.prototype.createView = function () {
        var _interval = 15; //道具盒子之间的间隔
        var _width = (GameData.stageW - _interval * 6) / 5; //道具盒子的宽度
        if (!this._view_activate) {
            this._view_activate = new egret.Bitmap();
            this._view_activate.texture = RES.getRes(this.getActivaStateTexture(this._type));
            this._view_activate.width = _width;
            this._view_activate.height = _width;
        }
        if (!this._view_box) {
            this._view_box = new egret.Bitmap();
            this._view_box.texture = RES.getRes("propbox_png");
            this._view_box.width = this._view_activate.width + 10;
            this._view_box.height = this._view_activate.height + 10;
            this._view_box.x = -5;
            this._view_box.y = -5;
        }
    };
    PropView.prototype.createNumText = function () {
        this._numText = new egret.BitmapText();
        this._numText.font = RES.getRes("number_fnt");
        this._numText.x = this._view_activate.width - 31;
        console.log("创建文本");
    };
    Object.defineProperty(PropView.prototype, "num", {
        get: function () {
            return this._num;
        },
        set: function (val) {
            this._num = val;
            this._numText.text = val.toString();
            if (val <= 0) {
                this.setActivaState(false);
            }
            else {
                this.setActivaState(true);
            }
        },
        enumerable: true,
        configurable: true
    });
    PropView.prototype.setActivaState = function (val) {
        this.touchEnabled = val;
        if (val) {
            this._view_activate.texture = RES.getRes(this.getActivaStateTexture(this._type));
            console.log("设置激活状态成功");
            this._numText.font = RES.getRes("number_fnt");
            /* this._view_box.texture = RES.getRes("propbox_png");*/
        }
        else {
            this._view_activate.texture = RES.getRes(this.getDisableTexture(this._type));
            this._numText.font = RES.getRes("numberdisable_fnt");
            /* this._view_box.texture = RES.getRes("propboxdisable_png");*/
        }
    };
    PropView.prototype.getFocusTexture = function (type) {
        var textureName = "";
        switch (type) {
            case 0:
                textureName = "tongseactive_png";
                break;
            case 1:
                textureName = "zhadanactive_png";
                break;
            case 2:
                textureName = "zhenghangactive_png";
                break;
            case 3:
                textureName = "zhenglieactive_png";
                break;
            case 4:
                textureName = "chanziactive_png";
                break;
        }
        return textureName;
    };
    //状态为激活时需要获得的纹理,根据type属性获得不同的纹理名称
    PropView.prototype.getActivaStateTexture = function (type) {
        var textureName = "";
        switch (type) {
            case 0:
                textureName = "tongse_png";
                break;
            case 1:
                textureName = "zhadan_png";
                break;
            case 2:
                textureName = "zhenghang_png";
                break;
            case 3:
                textureName = "zhenglie_png";
                break;
            case 4:
                textureName = "chanzi_png";
                break;
        }
        return textureName;
    };
    PropView.prototype.getDisableTexture = function (type) {
        var textureName = "";
        switch (type) {
            case 0:
                textureName = "tongsedisable_png";
                break;
            case 1:
                textureName = "zhadandisable_png";
                break;
            case 2:
                textureName = "zhenghangdisable_png";
                break;
            case 3:
                textureName = "zhengliedisable_png";
                break;
            case 4:
                textureName = "chanzidisable_png";
                break;
        }
        return textureName;
    };
    //设置完焦点之后，需要在上方盖一层焦点图片，图片会盖住道具图片
    PropView.prototype.setFocus = function (val) {
        if (val) {
            this._view_activate.texture = RES.getRes(this.getFocusTexture(this._type));
            /*
            this._view_box.texture = RES.getRes("xxx");
            */
        }
        else {
            if (this._num > 0) {
                this._view_activate.texture = RES.getRes(this.getActivaStateTexture(this._type));
            }
            else {
                this._view_activate.texture = RES.getRes(this.getDisableTexture(this._type));
            }
            /*
            this._view_box.texture = RES.getRes("xxx");
            */
        }
    };
    return PropView;
}(egret.Sprite));
__reflect(PropView.prototype, "PropView");
//# sourceMappingURL=PropView.js.map
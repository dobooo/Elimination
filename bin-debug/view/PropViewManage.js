var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//道具管理器
var PropViewManage = (function () {
    function PropViewManage(root) {
        this._currentID = -1; //当前点击道具ID，如果为-1，表示没有选中任何道具，如果不为-1表示选中其中一种道具
        this._layer = root;
        this.init();
    }
    PropViewManage.prototype.init = function () {
        this._props = new Array();
        this.createData();
    };
    //创建所有道具元素的图片
    PropViewManage.prototype.createData = function () {
        for (var i = 0; i < 5; i++) {
            var prop = new PropView(i);
            prop.x = 15 + (5 + prop.width) * i;
            prop.y = GameData.stageH - prop.height - 10;
            this._layer.addChild(prop);
            this._props.push(prop);
            prop.num = Math.floor(Math.random() * 5);
            prop.id = i;
            prop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        }
    };
    PropViewManage.prototype.click = function (evt) {
        //获取当前的道具类型，设置它的焦点状态
        //如果玩家已经选取了一个道具，再点击道具
        if (this._currentID != -1) {
            this._props[this._currentID].setFocus(false); //就是换张图
            //当玩家第二次点击相同元素的时候，我们将这个道具设置成-1，取消选择
            if (this._currentID == evt.currentTarget.id) {
                this._currentID = -1;
                PropViewManage.proptype = -1;
            }
            else {
                this._currentID == evt.currentTarget.id;
                this._props[this._currentID].setFocus(true);
                PropViewManage.proptype = this._props[this._currentID].proptype;
            }
        }
        else {
            this._currentID == evt.currentTarget.id;
            this._props[this._currentID].setFocus(true);
            PropViewManage.proptype = this._props[this._currentID].proptype;
        }
    };
    //使用道具，消除了元素
    PropViewManage.prototype.useProp = function () {
        this._props[this._currentID].num--;
        this._props[this._currentID].setFocus(false);
        this._currentID = -1;
        PropViewManage.proptype = -1;
    };
    PropViewManage.proptype = -1; //道具类型，当前用户所选取的道具
    return PropViewManage;
}());
__reflect(PropViewManage.prototype, "PropViewManage");
//# sourceMappingURL=PropViewManage.js.map
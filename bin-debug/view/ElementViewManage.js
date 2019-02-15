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
//消除元素管理器 
var ElementViewManage = (function (_super) {
    __extends(ElementViewManage, _super);
    function ElementViewManage(elementLayer) {
        var _this = _super.call(this) || this;
        /*-----------------------------焦点相关控制--------------------------------------*/
        _this._currentTapID = -1; //当前被点击（即将获取焦点）的元素ID，如为-1则表示没有元素获取焦点或无点击对象
        /*-----------------------------动画播放控制--------------------------------------*/
        _this.removenum = 0; //即将删除的元素数量
        _this.moveeleNum = 0; //所要播放的动画数量
        /*-----------------------------更新整个地图中元素位置--------------------------------------*/
        //打乱顺序之后重新布局
        _this.moveLocElementNum = 0;
        _this._layer = elementLayer;
        _this.init();
        return _this;
    }
    //初始化所有数据变量
    ElementViewManage.prototype.init = function () {
        this.elementviews = new Array();
        var l = GameData.MaxColumn * GameData.MaxRow;
        var el;
        for (var i = 0; i < l; i++) {
            el = new ElementView(this._layer); //创建元素视图
            el.id = i;
            el.location = GameData.elements[i].location;
            this.elementviews.push(el);
            el.addEventListener(ElementViewManageEvent.REMOVE_ANIMATION_OVER, this.removeAniOver, this);
            el.addEventListener(egret.TouchEvent.TOUCH_TAP, this.elTap, this); //点击之后对其进行相应操作
            el.addEventListener(ElementViewManageEvent.UPDATE_MAP, this.updateMap, this);
            el.addEventListener(ElementViewManageEvent.UPDATE_VIEW_OVER, this.moveNewLocationOver, this);
        }
    };
    //元素被点击响应事件
    //判断当前元素焦点状态，是否需要改变，如果存在两个焦点，则派发TAP_TWO_ELEMENT,通知上层逻辑，对连个被点击元素进行数据计算
    ElementViewManage.prototype.elTap = function (evt) {
        if (PropViewManage.proptype == -1) {
            if (evt.currentTarget instanceof ElementView) {
                var ev = evt.currentTarget; //获取用户点击的元素
                //玩家是否点击了两个元素
                //当前被点击（即将获取焦点）的元素ID，如为-1则表示没有元素获取焦点或无点击对象
                if (this._currentTapID != -1) {
                    //用户对其中一个元素点击了两次
                    //用户第一次点击元素的时候，需要设置焦点，如果第二次点击相同元素，需要把焦点取消，这时候我们认为用户取消了选择
                    if (ev.id == this._currentTapID) {
                        ev.setFocus(false); //设置焦点
                        this._currentTapID = -1;
                    }
                    else {
                        var event = new ElementViewManageEvent(ElementViewManageEvent.TAP_TWO_ELEMENT);
                        event.ele1 = this._currentTapID;
                        event.ele2 = ev.id;
                        this.dispatchEvent(event);
                    }
                }
                else {
                    ev.setFocus(true);
                    this._currentTapID = ev.id;
                }
            }
        }
        else {
            //玩家是否点击了两个元素
            //当前被点击（即将获取焦点）的元素ID，如为-1则表示没有元素获取焦点或无点击对象
            if (this._currentTapID != -1) {
                this._currentTapID = -1;
            }
            //需要派发使用道具这个事件，使用道具之后，派发的事件对于上层接收到事件进行相应的数据逻辑调用
            var evts = new ElementViewManageEvent(ElementViewManageEvent.USE_PROP_CLICK);
            //propToElementLocation携带道具点击的元素位置
            evts.propToElementLocation = evt.currentTarget.location;
            this.dispatchEvent(evts);
        }
    };
    //改变焦点,将旧焦点取消，设置新对象焦点
    ElementViewManage.prototype.setNewElementFocus = function (location) {
        this.elementviews[this._currentTapID].setFocus(false);
        this.elementviews[location].setFocus(true);
        this._currentTapID = location;
    };
    /*-----------------------------播放交互动画，交换后再返回--------------------------------------*/
    //可以交换，但是交换后没有发生位置移动
    //移除焦点
    //播放一个交换的动画，然后两个位置再换回来
    //用户点击两个元素，它们之间有了交换，执行这个函数
    //判断焦点的前后位置，判断之后要对他们的层级，进行切换
    ElementViewManage.prototype.changeLocationAndBack = function (id1, id2) {
        //判断元素是否处在焦点状态，如果是焦点设置为false
        if (this.elementviews[id1].focus) {
            this.elementviews[id1].setFocus(false);
            //针对元素交换他们的显示列表位置
            if (this._layer.getChildIndex(this.elementviews[id1]) < this._layer.getChildIndex(this.elementviews[id2])) {
                this._layer.swapChildren(this.elementviews[id1], this.elementviews[id2]);
            }
            //交换完成后，两元素都执行moveAndBack方法，用来播放动画，层级在上面，播放增加true，true代表播放进行放大的缩放的一个显示效果
            this.elementviews[id1].moveAndBack(this.elementviews[id2].location, true);
            this.elementviews[id2].moveAndBack(this.elementviews[id1].location);
        }
        else {
            //如果当前元素没有焦点
            this.elementviews[id2].setFocus(false);
            //针对元素交换他们的显示列表位置
            if (this._layer.getChildIndex(this.elementviews[id1]) > this._layer.getChildIndex(this.elementviews[id2])) {
                this._layer.swapChildren(this.elementviews[id1], this.elementviews[id2]);
            }
            this.elementviews[id1].moveAndBack(this.elementviews[id2].location);
            this.elementviews[id2].moveAndBack(this.elementviews[id1].location, true);
        }
        this._currentTapID = -1;
    };
    /*-----------------------------播放删除动画--------------------------------------*/
    //元素确实能够被删除，能够被消除之后，播放这类型的动画
    ElementViewManage.prototype.changeLocationAndScale = function (id1, id2) {
        //判断元素是否处在焦点状态，如果是焦点设置为false
        if (this.elementviews[id1].focus) {
            this.elementviews[id1].setFocus(false);
            //针对元素交换他们的显示列表位置
            if (this._layer.getChildIndex(this.elementviews[id1]) < this._layer.getChildIndex(this.elementviews[id2])) {
                this._layer.swapChildren(this.elementviews[id1], this.elementviews[id2]);
            }
            //交换完成后，两元素都执行moveAndScale方法，移动并且缩放，缩放完成就直接删除，true代表播放进行放大的缩放的一个显示效果
            this.elementviews[id1].moveAndScale(this.elementviews[id2].location, true);
            this.elementviews[id2].moveAndScale(this.elementviews[id1].location);
        }
        else {
            //如果当前元素没有焦点
            this.elementviews[id2].setFocus(false);
            //针对元素交换他们的显示列表位置
            if (this._layer.getChildIndex(this.elementviews[id1]) > this._layer.getChildIndex(this.elementviews[id2])) {
                this._layer.swapChildren(this.elementviews[id1], this.elementviews[id2]);
            }
            this.elementviews[id1].moveAndScale(this.elementviews[id2].location);
            this.elementviews[id2].moveAndScale(this.elementviews[id1].location, true);
        }
        this._currentTapID = -1;
    };
    /*-----------------------------显示所有元素，并播放出场动画--------------------------------------*/
    //元素从上到下，掉落播放的一个动画过程
    ElementViewManage.prototype.showAllElement = function () {
        this._layer.removeChildren(); //先移除显示列表所有的子显示对象
        var girdwidth = (GameData.stageW - 40) / GameData.MaxColumn;
        var startY = (GameData.stageH - (GameData.stageW - 30) / 6 - 60) - girdwidth * GameData.MaxColumn; //最下方的y轴
        var ele;
        for (var i = 0; i < GameData.MaxRow; i++) {
            for (var t = 0; t < GameData.MaxColumn; t++) {
                if (GameData.mapData[i][t] != -1) {
                    ele = this.elementviews[GameData.mapData[i][t]];
                    ele.setTexture("e" + GameData.elements[GameData.mapData[i][t]].type + "_png");
                    ele.x = ele.targetX();
                    ele.y = startY - ele.width;
                    //播放掉落动画的函数
                    ele.show((50 * GameData.MaxColumn * GameData.MaxRow - 50 * GameData.unmapnum) - (i * GameData.MaxRow + t) * 50);
                }
            }
        }
    };
    //消除动画播放结束，当一个动画播放完成之后，把它进行删除
    //当一个动画播放完成之后，会回调这个方法，回调方法之后，进行数量标记，数量标记完成之后，派发事件，不做逻辑处理
    //消除元素的时候，有N个动画都需要消除，虽然所有的动画时间都设置为相同的时间，动画完成的先后顺序是不一样的，所以要做数量标记
    ElementViewManage.prototype.removeAniOver = function (evt) {
        this.removenum++;
        if (this.removenum == 2) {
            this.removenum = 0;
            this.dispatchEvent(evt);
        }
    };
    //播放曲线动画，此类型动画用于可消除过关条件得情况，实际是使用直线动画进行标记，播放完成后，进行数量标记，标记完成后修改显示层级
    ElementViewManage.prototype.playReqRemoveAn = function (id, tx, ty) {
        this.moveeleNum++;
        var el = this.elementviews[id];
        if (el.parent) {
            this._layer.setChildIndex(el, this._layer.numChildren);
        }
        el.playCurveMove(tx, ty);
    };
    //播放放大动画，播放后直接删除,用于可删除元素，但元素类型不是关卡过关条件
    ElementViewManage.prototype.playRemoveAni = function (id) {
        this.moveeleNum++;
        var el = this.elementviews[id];
        if (el.parent) {
            this._layer.setChildIndex(el, this._layer.numChildren);
        }
        el.playReMoveAni();
    };
    //删除动画完成，现在更新地图元素	
    ElementViewManage.prototype.updateMap = function (evt) {
        this.moveeleNum--;
        if (this.moveeleNum == 0) {
            this.dispatchEvent(evt);
        }
    };
    ElementViewManage.prototype.updateMapData = function () {
        var len = this.elementviews.length;
        this.moveLocElementNum = 0;
        //打乱顺序之后直接做循环遍历，更新它们的location
        for (var i = 0; i < len; i++) {
            this.elementviews[i].location = GameData.elements[i].location;
            this.elementviews[i].setTexture("e" + GameData.elements[i].type + "_png");
            this.elementviews[i].moveNewLocation(); //执行移动操作
        }
    };
    ElementViewManage.prototype.moveNewLocationOver = function (event) {
        this.moveLocElementNum++;
        if (this.moveLocElementNum == GameData.MaxColumn * GameData.MaxRow) {
            var evt = new ElementViewManageEvent(ElementViewManageEvent.UPDATE_VIEW_OVER);
            this.dispatchEvent(evt);
        }
    };
    /*-----------------------------乱序操作，移动全部元素位置--------------------------------*/
    //乱序移动指令触发
    ElementViewManage.prototype.updateOrder = function () {
        var len = this.elementviews.length;
        egret.Tween.removeAllTweens(); //当动画还在运动当中，暂停当前游戏场景所有动画
        for (var i = 0; i < len; i++) {
            this.elementviews[i].location = GameData.elements[i].location;
            this.elementviews[i].move();
        }
    };
    return ElementViewManage;
}(egret.EventDispatcher));
__reflect(ElementViewManage.prototype, "ElementViewManage");
//# sourceMappingURL=ElementViewManage.js.map
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
//道具算法设计
//可消除一个，点击道具之后点击任意一个元素，该元素被消除
//可消除一周，点击道具之后点击任意一个元素，它的上下左右4个点都会被消除
//可消除一行，点击道具之后点击任意一个元素，检索与它行相同行的元素进行消除
//可消除一列，点击道具之后点击任意一个元素，检索与它列相同行的元素进行消除
//可消除同色，点击道具之后点击任意一个元素，消除同色元素
var PropLogic = (function () {
    function PropLogic() {
    }
    //使用道具
    //2个参数：1.道具的类型 2.我们需要操作的那个元素的location数据
    PropLogic.useProp = function (proptype, ellocation) {
        //根据道具的不同类型，调用不同的方法
        switch (proptype) {
            case 0:
                PropLogic.tongse(ellocation);
                break;
            case 1:
                PropLogic.zhadan(ellocation);
                break;
            case 2:
                PropLogic.zhenghang(ellocation);
                break;
            case 3:
                PropLogic.zhenglie(ellocation);
                break;
            case 4:
                PropLogic.chanzi(ellocation);
                break;
        }
    };
    //消除同色元素算法
    PropLogic.tongse = function (loc) {
        //获取用户点击的元素类型,所有道具使用过后，Linklogic.lines都需要填入一些数据
        Linklogic.lines = [];
        //用来保存消除的元素
        var arr = [];
        //获取用户点击元素的type属性,我们已知用户点击的location属性，换算成行与列，在地图数据当中将对应的行列的元素id获取出来
        var type = GameData.elements[GameData.mapData[Math.floor(loc / GameData.MaxColumn)][loc % GameData.MaxRow]].type;
        //寻找出与type相同的元素
        for (var i = 0; i < GameData.MaxRow; i++) {
            for (var t = 0; t < GameData.MaxColumn; t++) {
                //如果在地图当中找到的同类元素不为-1，同时获取到的元素type值与被点击的type值相同，把元素加入arr当中
                if (GameData.mapData[i][t] != -1 && GameData.elements[GameData.mapData[i][t]].type == type) {
                    arr.push(GameData.mapData[i][t]);
                }
            }
        }
        //将当前生成的新数组，加入到Linklogic.lines数组中
        Linklogic.lines.push(arr);
    };
    //消除四周算法
    PropLogic.zhadan = function (loc) {
        //首先需要给Linklogic.lines对象，new一个新的数组
        Linklogic.lines = new Array();
        var i = Math.floor(loc / GameData.MaxColumn);
        var t = loc % GameData.MaxRow;
        var arr = new Array();
        //通过location属性获取行和列，获取到的二维坐标点的id先加入数组中
        arr.push(GameData.elements[GameData.mapData[i][t]].id);
        //判断上下左右的4个元素是否能够被消除
        if (i > 0 && GameData.mapData[i - 1][t] != -1) {
            arr.push(GameData.elements[GameData.mapData[i - 1][t]].id);
        }
        if (t > 0 && GameData.mapData[i][t - 1] != -1) {
            arr.push(GameData.elements[GameData.mapData[i][t - 1]].id);
        }
        if (t < GameData.MaxColumn - 1 && GameData.mapData[i][t + 1] != -1) {
            arr.push(GameData.elements[GameData.mapData[i][t + 1]].id);
        }
        if (i < GameData.MaxRow - 1 && GameData.mapData[i + 1][t] != -1) {
            arr.push(GameData.elements[GameData.mapData[i + 1][t]].id);
        }
        Linklogic.lines.push(arr);
    };
    //消除整行元素算法
    PropLogic.zhenghang = function (loc) {
        //首先需要给Linklogic.lines对象，new一个新的数组
        Linklogic.lines = new Array();
        var arr = new Array();
        //获取行号
        var i = Math.floor(loc / GameData.MaxColumn);
        //对列进行循环
        for (var t = 0; t < GameData.MaxColumn; t++) {
            if (GameData.mapData[i][t] != -1) {
                arr.push(GameData.elements[GameData.mapData[i][t]].id);
            }
        }
        Linklogic.lines.push(arr);
    };
    //消除整列元素算法
    PropLogic.zhenglie = function (loc) {
        //首先需要给Linklogic.lines对象，new一个新的数组
        Linklogic.lines = new Array();
        var arr = new Array();
        //获取列号
        var t = loc % GameData.MaxRow;
        //对行进行循环
        for (var i = 0; i < GameData.MaxRow; i++) {
            if (GameData.mapData[i][t] != -1) {
                arr.push(GameData.elements[GameData.mapData[i][t]].id);
            }
        }
        Linklogic.lines.push(arr);
    };
    //消除单一元素算法
    PropLogic.chanzi = function (loc) {
        //首先需要给Linklogic.lines对象，new一个新的数组
        Linklogic.lines = new Array();
        Linklogic.lines.push([GameData.elements[GameData.mapData[Math.floor(loc / GameData.MaxColumn)][loc % GameData.MaxRow]].id]);
    };
    return PropLogic;
}());
__reflect(PropLogic.prototype, "PropLogic");
//# sourceMappingURL=PropLogic.js.map
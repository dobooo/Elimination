//游戏基础基础数据封装，零碎数据的整合
//数据包括：玩家移动的步数，当前关卡背景根据不同关卡更换不同的背景，最大行数，最大列数，空白地图的数量
//单例模式，数据是唯一的，防止在游戏过程当中一个唯一数据出现多个内存副本，通过静态数据和静态方法实现
class GameData{//类设计成一个静态属性加静态方法的一个类
    public static unmapnum:number = 0;//标识当前地图当中还没有放置元素的，未使用地图的数量，有多少个方块在这个地图当中是灰色的，不显示的
    public static mapData:number[][];//地图数据
    public static stepNum:number = 0;//玩家当前的剩余步数
    public static levelStepNum:number = 0;//当前关卡要求的步数 如果玩家的步数>关卡要求的步数，游戏结束
    public static elementTypes:number[];//当前关卡出现的元素类型 教程中书写为
    public static levelreq:LevelRequire;//过关条件
    public static elements:GameElement[];//游戏实例的对象池，因为定义的长度和宽度最长都是8，最长实例最大的数值只会是64
    public static unusedElements:number[];//游戏中未使用的元素ID，在对象池当中没有使用的元素，用这个作为标记
    public static levelBackgroundImageName:string = '';//当前关卡的背景图
    public static MaxRow:number = 8;//行数
    public static MaxColumn:number = 8;//列数
    public static currentElementNum:number = 0;//当前关卡游戏中，地图的可用元素数量

    //对所有数据进行初始化
    public static initData(){
        //地图数据初始化
        GameData.mapData = new Array();
        for(var i=0; i<GameData.MaxRow; i++){
            var arr:Array<number> = new Array();
            GameData.mapData.push(arr);
            for(var t=0; t<GameData.MaxColumn; t++){
                //对于一个地图当中的元素，默认存放的是元素的ID，
                //如果存放的是-1，表示当前地图无法使用，如果为-2，表示当前这块地图是空的，可以使用，但是还没有放置任何元素的ID
                GameData.mapData[i].push(-2);//为每一个元素里面存放一个数据，
            }
        }
        //关卡数据初始化
        GameData.levelreq = new LevelRequire();
        //游戏元素的初始化
        GameData.elements = new Array();
        //未使用元素的初始化
        GameData.unusedElements = new Array();
        var len:number = GameData.MaxRow * GameData.MaxColumn;
        for(var q=0; q<len; q++){
            var ele:GameElement = new GameElement();//创建游戏元素
            ele.id = q;
            GameData.elements.push(ele);
            GameData.unusedElements.push(q);//未使用的元素填入元素的下标
        }
        GameData.stageW = egret.MainContext.instance.stage.stageWidth;//获取舞台的宽度
        GameData.stageH = egret.MainContext.instance.stage.stageHeight;//获取舞台的高度
    }
    public static stageW:number = 0;//舞台的宽度
    public static stageH:number = 0;//舞台的高度
}
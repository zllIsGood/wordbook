/**
 * debug模式收集数据的对象
 * @author kei
 * @since 2019-02-19
 */
class PartConfCollection {

    partName: string;

    partPos: Point;

    animPos: Point;

    scale: number;

    checkPointList: any;
}
window["PartConfCollection"] = PartConfCollection;
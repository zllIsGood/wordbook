/**
 * 坐标点对象
 */
class Point {

    id: number;

    x: number;

    y: number;

    constructor(x: number, y: number, id?: number) {
        this.x = x;
        this.y = y;
        this.id = id;
    }

}
window["Point"] = Point;
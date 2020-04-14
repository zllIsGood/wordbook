/**
 * 绘图工具
 * @author kei
 * @since 2020-02-20
 */
class BrushConfig {

    // 画笔素材
    public data: any;
    // 画笔宽度
    public width: number;
    // 画笔缩放
    public scale: number;
    // 绘图间隔
    public dist: number;


    constructor(data: any, width: number, scale: number, dist: number) {
        this.data = data;
        this.width = width;
        this.scale = scale;
        this.dist = dist;
    }

}
window["BrushConfig"] = BrushConfig;
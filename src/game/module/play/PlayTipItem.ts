/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 17:41:30 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-13 20:10:47
 */
class PlayTipItem extends eui.ItemRenderer {

    private lab: eui.Label;
    public data: { type: number, upGradeVo }

    public constructor() {
        super();
        this.skinName = "PlayTipItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
    }

    protected dataChanged() {
        let data = this.data
        if (data.type == 1) {
            let str = ''
            let upVo = data.upGradeVo
            str += `还差<font  color=0xFF3535>${upVo.count}</font>关\n`
            if (upVo.nextBonusState == 0) { //房屋升级
                str += `升级房屋`
            }
            else if (upVo.nextBonusState == 1) { //人物升级
                str += `升级人物`
            }
            else if (upVo.nextBonusState == 2) { //招贤
                str += `招贤`
            }
            this.lab.textFlow = new egret.HtmlTextParser().parser(str)
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

}
window["PlayTipItem"] = PlayTipItem;
/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 10:10:44 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-03 16:37:27
 */
class HeroInformationItem extends eui.ItemRenderer {

    private lab1: eui.Label;
    private lab2: eui.Label;
    public data: { type: number, description: string }

    public constructor() {
        super();
        this.skinName = "HeroInformationItemSkin";
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
        if (!data) {
            return
        }
        if (data.type == 1) {
            this.lab1.text = '人物传记'
        }
        this.lab2.text = data.description

    }


    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

}
window["HeroInformationItem"] = HeroInformationItem;
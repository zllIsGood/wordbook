/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 14:10:47 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-09 17:06:43
 */
class RoleJobItem extends eui.ItemRenderer {

    private lab: eui.Label;

    public constructor() {
        super();
        this.skinName = "RoleJobItemSkin";
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
        // console.log('RoleJobItem:' + data)
        this.lab.text = StringUtils.addChangeLine(data)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

}
window["RoleJobItem"] = RoleJobItem;
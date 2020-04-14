/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 12:22:39 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-07 12:30:00
 */
class EnergyFriendItem extends eui.ItemRenderer {

    private lab: eui.Label;
    private img: eui.Image;
    private bg: eui.Image;

    public constructor() {
        super();
        this.skinName = "EnergyFriendItemSkin";
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
        this.lab.text = data.num + ''
    }

    private setInactive() {
        this.img.source = 'energy_icon_inactive_png'
        this.bg.source = 'energy_help_bg_inactive_png'
    }

    private setActive() {
        this.img.source = 'energy_icon_png'
        this.bg.source = 'energy_help_bg_png'
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

}
window["EnergyFriendItem"] = EnergyFriendItem;
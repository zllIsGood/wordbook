/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 14:54:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-30 16:04:39
 */
class RoleLevelItem extends eui.ItemRenderer {

    private bg: eui.Image;
    private img1: eui.Image;
    private img2: eui.Image;
    private lab1: eui.Label;
    private lab2: eui.Label;
    public data: { cfg, curId, maxId }

    public constructor() {
        super();
        this.skinName = "RoleLevelItemSkin";
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
        let data = this.data.cfg
        if (!data) {
            return
        }
        this.lab1.text = data.name
        if (data.stageNum > 0) {

            this.lab2.text = `完成第${data.stageNum}关`
        }
        else {
            this.lab2.text = ''
        }

        let myid = this.data.curId
        let type = -1
        if (myid == data.id) {
            type = 0
        }
        else if (myid < data.id) {
            type = 1
        }
        this.img1.visible = !(this.data.maxId == data.id)
        this.setState(type)
    }

    private setState(type) {
        let color1 = 0x0C90D4
        let color2 = 0x174860
        let img1 = 'upgrade_dialog_bar_active_png'
        let img2 = 'radiobutton_unselect_png'
        let bg = 'upgrade_dialog_bg_active_png'
        if (type == 0) {
            color1 = 0x964501
            color2 = 0x6B3100
            img1 = 'upgrade_dialog_bar_inactive_png'
            img2 = 'upgrade_dialog_icon_current_png'
            bg = 'upgrade_dialog_bg_current_png'
        }
        else if (type == 1) {
            color1 = 0x808080
            color2 = 0x464646
            img1 = 'upgrade_dialog_bar_inactive_png'
            img2 = 'radiobutton_select_png'
            bg = 'upgrade_dialog_bg_inactive_png'
        }

        this.img1.source = img1
        this.img2.source = img2
        this.bg.source = bg
        this.lab1.textColor = color1
        this.lab2.textColor = color2
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

}
window["RoleLevelItem"] = RoleLevelItem;
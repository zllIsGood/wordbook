/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 20:19:44 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-03 16:47:47
 */
class HeroItem extends eui.ItemRenderer {

    private lab: eui.Label;
    private lab0: eui.Label;
    private checkbox: eui.CheckBox;
    private img: eui.Image;

    public constructor() {
        super();
        this.skinName = "HeroItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        if (this.currentState != 'mini') {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
        }
    }

    protected dataChanged() {
        let data = this.data
        if (!data) {
            return
        }
        this.lab.text = StringUtils.addChangeLine(data.name)

        let cfgStr = StringUtils.deleteChangeLine(data.data)
        let cfg = JSON.parse(cfgStr)
        let has = HeroModel.ins().getIsUnlock(data.id) //是否拥有
        if (has) {
            this.img.source = cfg.fullImg
        }
        else {
            this.img.source = cfg.outlineImg
        }

        this.checkbox.selected = !HeroModel.ins().isHide(data.id)

        if (this.currentState == 'mini') {
            this.checkbox.visible = false
            this.lab0.visible = false
        }
        else {
            this.checkbox.visible = has
            this.lab0.visible = has
        }
    }

    private onClick(e: egret.TouchEvent) {
        if (e.target == this.checkbox) {
            console.log(e.target, this.checkbox.selected, this.data.id)
            let hide = !this.checkbox.selected
            let ret = HeroModel.ins().setHideOrShow(this.data.id, hide)
            if (hide && !ret) {
                this.checkbox.selected = true
                wx.showToast({ icon: 'none', title: `至少显示一个人物` })
            }
            return
        }
        ViewManager.ins().open(HeroInformationWin, this.data)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

}
window["HeroItem"] = HeroItem;
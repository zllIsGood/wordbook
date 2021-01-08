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
    private bg: eui.Image;
    private grp0: eui.Group;
    private grp1: eui.Group;
    private grp2: eui.Group;
    private red: eui.Image;
    private img1: eui.Image;
    private img2: eui.Image;
    private img3: eui.Image;
    private lab1: eui.Label;
    private lab2: eui.Label;

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

        // let cfgStr = StringUtils.deleteChangeLine(data.data)
        // let cfg = JSON.parse(cfgStr)
        let isUpLevel = HeroModel.ins().getIsUpLevel(data.id) //是否升级了
        let cfg = isUpLevel ? data.data2 : data.data
        let has = HeroModel.ins().getIsUnlock(data.id) //是否拥有
        if (has) {
            this.img.source = cfg.fullImg
        }
        else {
            this.img.source = cfg.outlineImg
        }
        this.bg.source = has && isUpLevel ? 'hero_uplv_bg_png' : 'character_item_bg_png'

        this.checkbox.selected = !HeroModel.ins().isHide(data.id)

        if (this.currentState == 'mini') {
            this.grp0.visible = false
            this.grp1.visible = false
            this.grp2.visible = false
            this.red.visible = false

            return
        }

        this.grp0.visible = has
        this.grp1.visible = false
        this.grp2.visible = false
        this.red.visible = false
        egret.Tween.removeTweens(this.grp2)
        if (has && isUpLevel) {
            this.grp0.x = 48
        }
        else if (has && !isUpLevel) {
            this.grp0.x = 100
            this.grp1.visible = true

            let herodata = HeroModel.ins().getHeroData(data.id)
            let count = herodata.count == null ? 0 : herodata.count
            let maxcount = Main.energyConfig.sageUpgradeCount == null ? 3 : Main.energyConfig.sageUpgradeCount

            if (count >= maxcount) {
                let str = `<font  color=0x19a10b>${count}</font>/${maxcount}\n`
                this.lab1.textFlow = new egret.HtmlTextParser().parser(str)
                this.img1.source = 'hero_rect1_png'

                this.red.visible = true
                this.grp2.visible = true
                this.grp2.scaleX = this.grp2.scaleY = 1
                let tw = egret.Tween.get(this.grp2, { loop: true })
                tw.to({ scaleX: 0.8, scaleY: 0.8 }, 500)
                    .to({ scaleX: 1, scaleY: 1 }, 500)
            }
            else {
                let str = `<font  color=0xff0000>${count}</font>/${maxcount}\n`
                this.lab1.textFlow = new egret.HtmlTextParser().parser(str)
                this.img1.source = 'hero_rect2_png'
            }
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
        if (e.target == this.lab2 || e.target == this.img2 || e.target == this.grp2) {
            // console.log('HeroItem:', e)
            HeroModel.ins().upLevel(this.data.id)
            return
        }
        ViewManager.ins().open(HeroInformationWin, this.data)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        egret.Tween.removeTweens(this.grp2)
    }

}
window["HeroItem"] = HeroItem;
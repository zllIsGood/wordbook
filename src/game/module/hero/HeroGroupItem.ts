/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 20:20:57 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-11 12:20:57
 */
class HeroGroupItem extends eui.ItemRenderer {

    private lab: eui.Label
    private grp: eui.Group
    private tip: eui.Label
    private btn: BaseBtn

    public data: { data: any[], type: number }

    public constructor() {
        super();
        this.skinName = "HeroGroupItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this)
        MessageCenter.addListener(HeroModel.ins().postHero, this.dataChanged, this, )
    }

    protected dataChanged() {
        if (!this.data) {
            return
        }
        let data = this.data.data
        // let type = this.data.type

        this.grp.removeChildren()
        let boolBtn = true //
        for (let item of data) {
            let obj = new HeroItem()
            obj.data = item
            this.grp.addChild(obj)

            boolBtn = HeroModel.ins().getIsUnlock(item.id) ? boolBtn : false
        }
        let cd = data[0].cd
        let energy = data[0].energy
        let str = '集齐可'
        if (energy > 0) {
            str += '获得' + energy + '体力'
            if (cd > 0) {
                str += '    '
            }
        }
        if (cd > 0) {
            str += '减少' + cd + 's体力时间'
        }
        this.lab.text = data[0].sageTypeName //''
        this.tip.text = str

        this.upBtn(boolBtn)
    }

    private upBtn(b) {
        let arr = HeroModel.ins().getGroupAward()
        if (!arr) {
            return null
        }
        let type = this.data.data[0].sageType
        let state = b ? 1 : 0
        if (arr && arr.length > 0 && arr.indexOf(type) >= 0) {
            state = -1
        }
        if (state == 0) { //不可领取
            this.btn.enabled = false
            this.btn.icon = 'character_bonus_btn_disabled_png'
        }
        else if (state == 1) { //可领取
            this.btn.enabled = true
            this.btn.icon = 'character_bonus_btn_png'
        }
        else if (state == -1) { //已领取
            this.btn.enabled = false
            this.btn.icon = 'character_bonus_btn_received_png'
        }
    }

    private click() {
        let sageType = this.data.data[0].sageType
        console.log('sageType:' + sageType)
        HeroModel.ins().groupAward(sageType)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        this.grp.removeChildren()
        MessageCenter.ins().removeAll(this)
    }

}
window["HeroGroupItem"] = HeroGroupItem;
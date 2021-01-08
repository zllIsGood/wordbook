/* 招募
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 18:39:56 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-20 16:15:23
 */
class HeroSelectWin extends BaseEuiView {

    private card0: HeroSelectItem;
    private card1: HeroSelectItem;
    private card2: HeroSelectItem;
    private card3: HeroSelectItem;
    private isDaily = false

    constructor() {
        super();
        this.skinName = `HeroSelectSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.card0, this.onClick);
        this.addTouchEvent(this.card1, this.onClick);
        this.addTouchEvent(this.card2, this.onClick);
        this.addTouchEvent(this.card3, this.onClick);
        this.isDaily = param[0] ? true : false

        this.upView()
    }

    private upView() {
        for (let i = 0; i < 4; i++) {
            let select: HeroSelectItem = this['card' + i]
            select.data = { award: false }
        }
    }

    private upResult(data, n) {
        let other = data.other
        let j = 0
        for (let i = 0; i < 4; i++) {
            let select: HeroSelectItem = this['card' + i]
            if (i == n) {
                let name = '', img = null;
                if (data.award.awardType == 2) {
                    // let cfgStr = StringUtils.deleteChangeLine(data.award.sage.data)
                    // let cfg = JSON.parse(cfgStr)
                    let single = HeroModel.ins().getCfgById(data.award.sage.id)
                    let cfg = single.data
                    name = data.award.sage.name
                    img = cfg.fullImg
                }
                select.data = { award: true, awardType: data.award.awardType, energy: data.award.energy, name: name, img: img }
            }
            else {
                let name = '', img = null;
                if (other[j].awardType == 2) {
                    // let cfgStr = StringUtils.deleteChangeLine(other[j].sage.data)
                    // let cfg = JSON.parse(cfgStr)
                    let single = HeroModel.ins().getCfgById(other[j].sage.id)
                    let cfg = single.data
                    name = other[j].sage.name
                    img = cfg.fullImg
                }
                select.data = { award: true, awardType: other[j].awardType, energy: other[j].energy, name: name, img: img }
                // select.data = { award: true, awardType: other[j].awardType, energy: other[j].energy }
                j++
            }
        }
    }

    public close(...param: any[]): void {

    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.card0:
                this.select(0)
                break;
            case this.card1:
                this.select(1)
                break;
            case this.card2:
                this.select(2)
                break;
            case this.card3:
                this.select(3)
                break;
        }
    }

    private async select(n) {
        let data
        if (this.isDaily) {
            data = await HeroModel.ins().heroDaily()
            if (data == null) {
                wx.showToast({ icon: 'none', title: "今日次数不足" })
                return ViewManager.ins().close(this)
            }
        }
        else {
            data = await HeroModel.ins().hero()
        }
        this.upResult(data, n)
        ViewManager.ins().open(HeroResultWin, data)
    }

}
ViewManager.ins().reg(HeroSelectWin, LayerManager.UI_Popup);
window["HeroSelectWin"] = HeroSelectWin;
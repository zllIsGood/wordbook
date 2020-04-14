/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-09 15:09:58 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-09 16:16:12
 */
class HeroSelectItem extends eui.ItemRenderer {

    private energyNum: eui.Label;
    private imgE: eui.Image;
    private bg: eui.Image;
    private imgHero: eui.Image;
    public data: { award: boolean, awardType?, name?, img?, energy?}

    public constructor() {
        super();
        this.skinName = "HeroSelectItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {

    }

    protected dataChanged() {
        this.energyNum.text = ''
        this.imgE.visible = false
        this.imgHero.visible = false
        let data = this.data
        console.log('HeroSelectItem:' + data)
        if (!data) {
            this.bg.source = 'recruit_card_png'
            return
        }

        if (data.award) {
            this.bg.source = 'recruit_card_other_png'

            if (data.awardType == 0) {//体力
                this.energyNum.text = data.energy
                this.imgE.visible = true
            }
            else if (data.awardType == 1) { // 减少cd
                //
            }
            else if (data.awardType == 2) { //招贤
                this.imgHero.visible = true
                this.imgHero.source = data.img
            }
        }
        else {
            this.bg.source = 'recruit_card_png'
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

}
window["HeroSelectItem"] = HeroSelectItem;
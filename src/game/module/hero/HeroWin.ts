/* 招贤
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 14:26:03 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-21 14:30:22
 */
class HeroWin extends BaseEuiView {

    private closeBtn: BaseBtn;
    private list: eui.DataGroup;
    private scrol: eui.Scroller;
    private data

    constructor() {
        super();
        this.skinName = `HeroSkin`;
        this.list.itemRenderer = HeroGroupItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.data = param[0]
        this.upView()
        // AdService.createBannerAd(Ad.dialogBanner)
        App.ins().playBannerAd(Ad.dialogBanner)
    }

    private async upView() {
        await HeroModel.ins().groupAwardData()
        HeroModel.ins().getALLCfg(((data) => {
            let group = {}
            let arr = []
            for (let i in data) {
                let item = data[i]
                if (!group[item.sageType]) {
                    group[item.sageType] = []
                }
                group[item.sageType].push(item)
            }
            for (let k in group) {
                arr.push({ data: group[k], type: Number(k) })
            }
            this.list.dataProvider = new eui.ArrayCollection(arr)

            let curSageType = this.data.sageType
            let v = 0 //120 + 326
            let gap1 = 6
            let gap2 = 20
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].type == curSageType) {
                    break;
                }
                let row = Math.ceil(arr[i].data.length / 3)
                v += row * 326 + (row - 1) * gap1 + 120 + gap2
            }
            DisplayUtils.scrollVTo(this.scrol, v, v)
        }).bind(this))
    }



    public close(...param: any[]): void {
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
        this.data = null
        App.ins().destoryBanner()
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;

        }
    }

}
ViewManager.ins().reg(HeroWin, LayerManager.UI_Popup);
window["HeroWin"] = HeroWin;
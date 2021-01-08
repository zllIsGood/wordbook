/* 免费体力界面
 * @Author: zhoualnglang 
 * @Date: 2020-04-01 12:24:20 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-07 12:19:31
 */
class EnergyFreeWin extends BaseEuiView {

    private closeBtn: BaseBtn;
    private list: eui.List;

    constructor() {
        super();
        this.skinName = `EnergyFreeSkin`;
        this.list.itemRenderer = EnergyFreeItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);

        this.upView()
        App.ins().playBannerAd(Ad.dialogBanner)
    }

    private upView() {
        let data = [{ 'type': EnergyFreeType.watchAdAward }, { 'type': EnergyFreeType.tip },]
        this.list.dataProvider = new eui.ArrayCollection(data)
    }



    public close(...param: any[]): void {
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
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
ViewManager.ins().reg(EnergyFreeWin, LayerManager.UI_Popup);
window["EnergyFreeWin"] = EnergyFreeWin;
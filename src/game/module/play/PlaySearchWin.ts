/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-28 20:31:33 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-30 14:23:00
 */
class PlaySearchWin extends BaseEuiView {

    private btn: BaseBtn;
    private closeBtn: BaseBtn;
    private fun: Function
    private callthis

    constructor() {
        super();
        this.skinName = `PlaySearchSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.addTouchEvent(this.btn, this.onClick);

        this.fun = param[0]
        this.callthis = param[1]
        this.upView()
        // AdService.createBannerAd(Ad.dialogBanner)
        App.ins().playBannerAd(Ad.dialogBanner)
    }

    private upView() {
        if (App.ins().adNotScore()) {
            this.btn.icon = 'energy_dialog_watch_01_png'
        }
        else {
            this.btn.icon = 'score_search_png'
        }
    }



    public close(...param: any[]): void {
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
        App.ins().destoryBanner()
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.btn:
                ViewManager.ins().close(this)
                this.fun.call(this.callthis)
                break;
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;

        }
    }

}
ViewManager.ins().reg(PlaySearchWin, LayerManager.UI_Popup);
window["PlaySearchWin"] = PlaySearchWin;
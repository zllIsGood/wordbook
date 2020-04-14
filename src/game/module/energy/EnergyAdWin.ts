/* 体力-观看视屏获取
 * @Author: zhoualnglang 
 * @Date: 2020-04-07 11:25:00 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-07 12:32:53
 */
class EnergyAdWin extends BaseEuiView {

    private closeBtn: BaseBtn;
    private btn: BaseBtn;

    constructor() {
        super();
        this.skinName = `EnergyAdSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.addTouchEvent(this.btn, this.onClick);

        this.upView()
    }

    private upView() {

    }



    public close(...param: any[]): void {
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;
            case this.btn:
                console.log("watch ad btn click!");
                AdService.watchAd(AwardType.WATCH_AD_AWARD);
                break;
        }
    }

}
ViewManager.ins().reg(EnergyAdWin, LayerManager.UI_Popup);
window["EnergyAdWin"] = EnergyAdWin;
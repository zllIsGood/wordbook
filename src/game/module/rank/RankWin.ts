/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-01 12:23:52 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-11 11:09:14
 */
class RankWin extends BaseEuiView {

    private btn: BaseBtn;
    private closeBtn: BaseBtn;

    constructor() {
        super();
        this.skinName = `EnergySkin`;
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

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.btn:
                // ViewManager.ins().open()
                break;
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;

        }
    }

}
ViewManager.ins().reg(RankWin, LayerManager.UI_Popup);
window["RankWin"] = RankWin;
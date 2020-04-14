/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-01 16:07:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-07 19:00:33
 */
class RePlayWin extends BaseEuiView {

    private btn: BaseBtn;
    private closeBtn: BaseBtn;
    private fun: Function
    private callthis

    constructor() {
        super();
        this.skinName = `RePlaySkin`;
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
ViewManager.ins().reg(RePlayWin, LayerManager.UI_Popup);
window["RePlayWin"] = RePlayWin;
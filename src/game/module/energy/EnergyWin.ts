/* 体力用完了
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 15:44:27 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-08 18:38:27
 */

class EnergyWin extends BaseEuiView {

    private btnL: BaseBtn;
    private btnR: BaseBtn;
    private closeBtn: BaseBtn;
    private leftTimeLab: eui.Label;
    private energyLab: eui.Label;

    constructor() {
        super();
        this.skinName = `EnergySkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.addTouchEvent(this.btnR, this.onClick);
        this.addTouchEvent(this.btnL, this.onClick);
        this.observe(UserModel.ins().postData, this.upView);

        this.upView()
    }

    private upView() {
        let userModel = UserModel.ins()
        let isOver = userModel.isMaxEnergy()
        let time = userModel.getEnergyRefresh()
        // let num = userModel.getEnergy()
        TimerManager.ins().remove(this.timer, this)
        if (isOver) {
            this.energyLab.text = '您的体力已经满了哦'
            this.leftTimeLab.text = ''
        }
        else {
            this.energyLab.text = '全部恢复：' + DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_5)
            this.leftTimeLab.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_0)

            if (time > 0) {
                TimerManager.ins().doTimer(1000, 0, this.timer, this)
            }
        }
    }

    private timer() {
        let time = UserModel.ins().getEnergyRefresh()
        if (time > 0) {
            this.leftTimeLab.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_0)
        }
        else {
            TimerManager.ins().remove(this.timer, this)
            this.leftTimeLab.text = ''
        }
    }

    public close(...param: any[]): void {
        TimerManager.ins().remove(this.timer, this)
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.btnR:
                ViewManager.ins().open(EnergyFreeWin)
                ViewManager.ins().close(this)
                break;
            case this.btnL:
                let time = UserModel.ins().getEnergyRefresh()
                if (time > 0) {
                    //
                }
                else {
                    UserModel.ins().refreshEnergy()
                }
                break;
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;

        }
    }

}
ViewManager.ins().reg(EnergyWin, LayerManager.UI_Popup);

window["EnergyWin"] = EnergyWin
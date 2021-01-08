/* 体力-观看视屏获取
 * @Author: zhoualnglang 
 * @Date: 2020-04-07 11:25:00 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-30 12:28:22
 */
class EnergyAdWin extends BaseEuiView {

    private closeBtn: BaseBtn;
    private btn: BaseBtn;
    private count: eui.Label;
    private titleImg: eui.Image;
    private lab: eui.Label;

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
        // AdService.createBannerAd(Ad.dialogBanner)
        App.ins().playBannerAd(Ad.dialogBanner)
    }

    private upView() {
        let cfg = Main.energyConfig
        this.count.text = cfg.watchAdAward

        if (App.ins().adNotScore()) {
            this.titleImg.source = 'energy_ad_title_png'
            this.lab.text = '观看完30秒视频\n即可获得'
            this.btn.icon = 'energy_dialog_watch_01_png'
        }
        else {
            this.titleImg.source = 'energy_score_title_png'
            let c = ScoreService.getScoreNeed()
            this.lab.text = `使用${c}积分即可获得`
            this.btn.icon = 'energy_score_btn_png'
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
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;
            case this.btn:
                console.log("watch ad btn click!");
                // AdService.watchAd(AwardType.WATCH_AD_AWARD);
                App.ins().playRewardVideoAd(AwardType.WATCH_AD_AWARD);
                break;
        }
    }

}
ViewManager.ins().reg(EnergyAdWin, LayerManager.UI_Popup);
window["EnergyAdWin"] = EnergyAdWin;
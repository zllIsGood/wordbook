/* 体力-邀请好友 分享录屏
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 12:09:56 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-18 18:09:27
 */
class EnergyFriendWin extends BaseEuiView {

    private closeBtn: BaseBtn;
    private btn: BaseBtn;
    private item1: EnergyFriendItem;
    private item2: EnergyFriendItem;
    private item3: EnergyFriendItem;

    constructor() {
        super();
        this.skinName = `EnergyFriendSkin`;
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
        let cfgAward = Main.energyConfig.shareVideoAward
        this.item1.data = { num: cfgAward }
        this.item2.data = { num: cfgAward }
        this.item3.data = { num: cfgAward }
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
                // RecordService.recordShare()
                let query = JSON.stringify({ share: true })
                wx.shareAppMessage({
                    title: '我要分享',
                    query: query,
                    imageUrl: GlobalConfig.helpImgUrl,
                    success: function (res) {
                        console.log('拉起分享 成功');
                        console.log(res);
                        AdService.shareVideoAward()
                    },
                    fail: function (res) {
                        console.log('拉起分享 失败');
                        console.log(res);
                    }
                });
                break;
        }
    }


}
ViewManager.ins().reg(EnergyFriendWin, LayerManager.UI_Popup);
window["EnergyFriendWin"] = EnergyFriendWin;
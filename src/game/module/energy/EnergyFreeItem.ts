/* 获取体力组件
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 11:10:06 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-07 12:22:07
 */
class EnergyFreeItem extends eui.ItemRenderer {

    private img: eui.Image;
    private role2: eui.Image;
    private lab1: eui.Label;
    private lab2: eui.Label;
    private btn: BaseBtn;

    public data: { type: EnergyFreeType }

    public constructor() {
        super();
        this.skinName = "EnergyFreeItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

    protected dataChanged() {
        let type = this.data.type
        let cfg = Main.energyConfig
        let num = 0
        let str
        let icon
        let img
        if (type == EnergyFreeType.share) {
            str = '分享获取'
            num = cfg.shareProgramAward //shareVideoAward
            icon = 'energy_dialog_share_btn_png'
            img = 'energy_dialog_share_png'
        }
        else if (type == EnergyFreeType.watchAdAward) {
            str = '观看广告'
            num = cfg.watchAdAward
            icon = 'energy_dialog_watch_png'
            img = 'energy_dialog_ad_png'
        }

        this.lab1.text = str
        this.lab2.textFlow = new egret.HtmlTextParser().parser(`获得：<font color = '#747474'>${num}</font>`)
        this.img.source = img
        this.btn.icon = icon
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.btn:
                let data = this.data
                ViewManager.ins().close(EnergyFreeWin)

                if (data.type == EnergyFreeType.share) {
                    let query = JSON.stringify({ share: true })
                    wx.shareAppMessage({
                        title: '我要分享',
                        query: query,
                        imageUrl: './resource/assets/other/help_cover.png',
                        success: function (res) {
                            console.log('拉起分享 成功');
                            console.log(res);
                            AdService.shareProgramAward()
                        },
                        fail: function (res) {
                            console.log('拉起分享 失败');
                            console.log(res);
                        }
                    });
                    // ViewManager.ins().open(EnergyFriendWin)
                    // RecordService.recordShare()
                }
                else if (data.type == EnergyFreeType.watchAdAward) {
                    ViewManager.ins().open(EnergyAdWin)
                }
                break;
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
    }

}
enum EnergyFreeType {
    share = 1, //分享
    watchAdAward = 2, //广告
}
window["EnergyFreeItem"] = EnergyFreeItem;
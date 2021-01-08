/* 设置界面
 * @Author: zhoualnglang 
 * @Date: 2020-05-08 14:54:54 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-08 16:48:29
 */
class SetWin extends BaseEuiView {

    private verLab: eui.Label
    private userProto: eui.Label
    private priviteProto: eui.Label
    private protoGrp: eui.Group
    private closeBtn: BaseBtn
    private set_about: eui.Image
    appLab: eui.Label

    /**版本号*/
    private version = {
        app: 'V2.3',
    }

    public constructor() {
        super();
        this.skinName = 'SetSkin'
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.priviteProto, this.onClick);
        this.addTouchEvent(this.userProto, this.onClick);
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.addTouchEvent(this.set_about, this.onClick);

        this.upView()
        App.ins().playBannerAd(Ad.loadingBanner)
    }

    private upView() {
        this.userProto.textFlow = new egret.HtmlTextParser().parser(`<u>服务协议</u>`)
        this.priviteProto.textFlow = new egret.HtmlTextParser().parser(`<u>隐私政策</u>`)
        this.verLab.text = this.version.app
        this.appLab.text = '单词喵' //'猫咪学单词'
    }


    public close(...param: any[]): void {
        App.ins().destoryBanner()
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.priviteProto:
                ViewManager.ins().open(UserProtoDetialWin, UserProtoDetialWinOpen.private)
                // https://h5.zmfamily.cn/#/GamePrivacyAgreement
                break;
            case this.userProto:
                ViewManager.ins().open(UserProtoDetialWin, UserProtoDetialWinOpen.user)
                // https://h5.zmfamily.cn/#/GameUserServiceAgreement
                break;
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;
            case this.set_about:  //关于我们
                let url = 'https://h5.zmfamily.cn/#/WordAboutUs'
                // let url = 'https://h5.zmfamily.cn/#/GameAboutUs'
                if (window && window.open) {
                    window.open(url)
                }
                else {
                    Openadsdk.OpenURL(null, null, url)
                }
                break;
        }
    }

}

ViewManager.ins().reg(SetWin, LayerManager.UI_Popup);
window["SetWin"] = SetWin;
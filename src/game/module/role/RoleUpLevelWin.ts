/* 角色升级
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 14:29:35 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-21 14:57:57
 */
class RoleUpLevelWin extends BaseEuiView {

    private topImg: eui.Image;
    private closeBtn: BaseBtn;
    private list: eui.List;
    private scrol: eui.Scroller;

    constructor() {
        super();
        this.skinName = `RoleUpLevelSkin`;
        this.list.itemRenderer = RoleLevelItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);

        this.upView()
        // AdService.createBannerAd(Ad.dialogBanner)
        App.ins().playBannerAd(Ad.dialogBanner)
    }

    private upView() {
        this.topImg.source = 'protagonist_dialog_title_png'
        RoleModel.ins().getALLCfg((cfgs) => {
            let arr = []
            let curId = UserModel.ins().getRoleId()
            for (let i in cfgs) {
                arr.push({ cfg: cfgs[i], curId: curId })
            }
            arr.sort((a, b) => {
                return (b.cfg.id - a.cfg.id)
            })
            let maxId = arr[0].cfg.id
            for (let i in arr) {
                arr[i].maxId = maxId
            }
            this.list.dataProvider = new eui.ArrayCollection(arr)

            let index = 0
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].cfg.id == arr[i].curId) {
                    index = i
                    break
                }
            }
            let v1 = 95 + 12
            let v = v1 * (index == 0 ? 0 : index - 1)
            let maxv = v1 * arr.length - 12 - 640
            maxv = maxv >= 0 ? maxv : 0
            DisplayUtils.scrollVTo(this.scrol, v, maxv)
        })
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
ViewManager.ins().reg(RoleUpLevelWin, LayerManager.UI_Popup);
window["RoleUpLevelWin"] = RoleUpLevelWin;
/* 角色升级
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 14:29:35 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-13 16:42:41
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
            this.list.dataProvider = new eui.ArrayCollection(arr)

            let index = 0
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].cfg.id == arr[i].id) {
                    index = i
                    break
                }
            }
            let v1 = 95 + 12
            let v = v1 * index
            DisplayUtils.scrollVTo(this.scrol, v)
        })
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

        }
    }

}
ViewManager.ins().reg(RoleUpLevelWin, LayerManager.UI_Popup);
window["RoleUpLevelWin"] = RoleUpLevelWin;
/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 09:54:22 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-03 16:36:30
 */
class HeroInformationWin extends BaseEuiView {

    private closeBtn: BaseBtn;
    private heroItem: HeroItem;
    private grp: eui.Group;

    private data

    constructor() {
        super();
        this.skinName = `HeroInformationSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.data = param[0] ? param[0] : null
        this.upView()
    }

    private upView() {
        let data = this.data
        if (!data) {
            return
        }
        this.heroItem.data = data

        this.grp.removeChildren()
        let item = new HeroInformationItem()
        item.data = { type: 1, description: data.description }
        this.grp.addChild(item)
    }



    public close(...param: any[]): void {
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
        this.data = null
        this.grp.removeChildren()
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
ViewManager.ins().reg(HeroInformationWin, LayerManager.UI_Popup);
window["HeroInformationWin"] = HeroInformationWin;
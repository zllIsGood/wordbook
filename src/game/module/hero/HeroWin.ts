/* 招贤
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 14:26:03 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-03 15:52:34
 */
class HeroWin extends BaseEuiView {

    private closeBtn: BaseBtn;
    private list: eui.DataGroup;
    private scrol: eui.Scroller;

    constructor() {
        super();
        this.skinName = `HeroSkin`;
        this.list.itemRenderer = HeroGroupItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);

        this.upView()
    }

    private upView() {
        HeroModel.ins().getALLCfg((data) => {
            let group = {}
            let arr = []
            for (let i in data) {
                let item = data[i]
                if (!group[item.sageType]) {
                    group[item.sageType] = []
                }
                group[item.sageType].push(item)
            }
            for (let k in group) {
                arr.push({ data: group[k], type: Number(k) })
            }
            this.list.dataProvider = new eui.ArrayCollection(arr)
            // DisplayUtils.scrollerToBottom(this.scrol)
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
ViewManager.ins().reg(HeroWin, LayerManager.UI_Popup);
window["HeroWin"] = HeroWin;
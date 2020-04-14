/* 单词本
 * @Author: zhoualnglang 
 * @Date: 2020-04-01 12:23:18 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-09 18:47:58
 */
class WordBookWin extends BaseEuiView {

    private btn: BaseBtn;
    private closeBtn: BaseBtn;
    private btnL: BaseBtn;
    private btnR: BaseBtn;
    private bookImg: eui.Image;
    private list: eui.DataGroup;
    private scrol: eui.Scroller;

    constructor() {
        super();
        this.skinName = `WordBookSkin`;
        this.list.itemRenderer = WordGroupItem
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.addTouchEvent(this.btn, this.onClick);
        this.addTouchEvent(this.btnL, this.onClick);
        this.addTouchEvent(this.btnR, this.onClick);

        this.upView(1)
    }

    private async upView(typenum) {
        let type = typenum
        let data1 = await WordModel.ins().getWordList(0)
        let data2 = await WordModel.ins().getWordList(1)
        this.btnL.label = '未掌握（' + data1.length + '）'
        this.btnR.label = '已掌握（' + data2.length + '）'
        let arr
        if (type == 1) {
            this.btnL.icon = 'glossary_tab_selected_png'
            this.btnR.icon = 'glossary_tab_not_select_png'
            arr = WordModel.ins().getWordGroup(0)
        }
        else if (type == 2) {
            this.btnL.icon = 'glossary_tab_not_select_png'
            this.btnR.icon = 'glossary_tab_selected_png'
            arr = WordModel.ins().getWordGroup(1)
        }
        if (arr) {
            // console.log(arr)
            this.list.dataProvider = new eui.ArrayCollection(arr)
            this.scrol.visible = true
            this.bookImg.visible = false
        }
        else {
            this.scrol.visible = false
            this.bookImg.visible = true
        }
    }



    public close(...param: any[]): void {
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.btn:
                // ViewManager.ins().open()
                break;
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;
            case this.btnL:
                this.upView(1)
                break;
            case this.btnR:
                this.upView(2)
                break;
        }
    }

}
ViewManager.ins().reg(WordBookWin, LayerManager.UI_Popup);
window["WordWin"] = WordBookWin;
window["WordBookWin"] = WordBookWin;
/* 单词组件
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 16:05:34 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-09 19:29:24
 */
class WordItem extends eui.ItemRenderer {

    private img: eui.Image;
    private lab1: eui.Label;
    private lab2: eui.Label;
    public data: { word: string, source: string, type: WordItemType, id?}

    public constructor() {
        super();
        this.skinName = "WordItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

    protected dataChanged() {
        let data = this.data
        this.lab1.text = data.word
        this.lab2.text = data.source
        let type = WordModel.ins().isAddBook(data.word)
        if (type) {
            this.img.source = 'star_bright_png'
        }
        else {
            this.img.source = 'star_gray_png'
        }
    }

    private onClick() {
        if (this.data.type == WordItemType.fromPlay) {
            ViewManager.ins().open(WordDetilsWin, {
                word: this.data.word,
                from: WordDetilsOpenType.fromPlay,
                source: this.data.source
            })
            ViewManager.ins().close(WordBookWin)
        }
        if (this.data.type == WordItemType.fromBook1) {
            ViewManager.ins().open(WordDetilsWin, {
                word: this.data.word,
                from: WordDetilsOpenType.fromBook1,
                source: this.data.source,
                wid: this.data.id
            })
            ViewManager.ins().close(WordBookWin)
        }
        if (this.data.type == WordItemType.fromBook2) {
            ViewManager.ins().open(WordDetilsWin, {
                word: this.data.word,
                from: WordDetilsOpenType.fromBook2,
                source: this.data.source,
                wid: this.data.id
            })
            ViewManager.ins().close(WordBookWin)
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this)
    }

}
const enum WordItemType {
    fromPlay = 1,
    fromBook1 = 2,
    fromBook2 = 3,
}
window["WordItem"] = WordItem;
/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 16:09:16 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-09 18:45:04
 */
class WordGroupItem extends eui.ItemRenderer {

    private lab: eui.Label;
    private grp: eui.Group;
    public data: { data, type, s }

    public constructor() {
        super();
        this.skinName = "WordGroupItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
    }

    protected dataChanged() {
        let data = this.data
        if (!data || !data.data) {
            return
        }
        // console.log(this.name + data, data.data, data.data)
        this.lab.text = data.s
        this.grp.removeChildren()
        for (let item of data.data) {
            let obj = new WordItem()
            obj.data = {
                word: item.word,
                source: item.source,
                type: data.type,
                id: item.wbId,
            }
            this.grp.addChild(obj)
        }
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.grp.removeChildren()
    }

}
window["WordGroupItem"] = WordGroupItem;
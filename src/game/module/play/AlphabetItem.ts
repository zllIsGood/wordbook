/* 字母组件
 * @Author: zhoualnglang 
 * @Date: 2020-04-01 16:30:51 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-11 17:24:32
 */
class AlphabetItem extends eui.ItemRenderer {

    private img: eui.Image;
    private lab: eui.Label;
    public data: { alphabet?: string; state?: AlphabetItemState, num: number, input?: string, x?, y?, fromWord?: string[] }
    private imgArray = ['square_input_png', 'square_input_wrong_png', 'square_state_blank_png', 'square_state_letter_png', 'square_state_locked_png', 'square_state_wrong_png', 'play_letter_select_png', 'play_letter_select_png']

    public constructor() {
        super();
        this.skinName = "AlphabetItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.anchorOffsetX = 26
        this.anchorOffsetY = 26
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
    }

    public upDate() {
        this.dataChanged()
        if (this.data.state == AlphabetItemState.locked) {
            egret.Tween.removeTweens(this)
            DisplayUtils.setScale(this, 0.9)
            let tw = egret.Tween.get(this, { loop: false })
            tw.to({ scaleX: 1.2, scaleY: 1.2 }, 200).to({ scaleX: 1, scaleY: 1 }, 200)
        }
    }

    protected dataChanged() {
        let data = this.data
        let bool = true
        if (data && data.alphabet) {
            this.img.source = this.imgArray[data.state]
            if (data.state == AlphabetItemState.input || data.state == AlphabetItemState.blank) {
                bool = false
            }
            if (data.state == AlphabetItemState.state_wrong || data.state == AlphabetItemState.input_wrong) {
                this.lab.text = data.input
            }
            else {
                this.lab.text = data.alphabet
            }
        }
        else {
            this.img.source = this.imgArray[AlphabetItemState.blank]
            this.lab.text = ''
        }
        this.lab.visible = bool
    }

    public upColor() {
        let color = 0x2D1C08 //0xC81A2A
        let data = this.data
        if (data.state == AlphabetItemState.state_wrong || data.state == AlphabetItemState.input_wrong) {
            color = !PlayModel.ins().isWordErr(data) ? color : 0xC81A2A
        }
        this.lab.textColor = color
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        egret.Tween.removeTweens(this)
    }
}

/**字母状态*/
const enum AlphabetItemState {
    input = 0, //当前放入
    input_wrong = 1, //当前放入错误
    blank, //空放入
    stage, //非空
    locked, //正确
    state_wrong, //错误
    bottom_show, //下方显示
    bottom_hide, //下方隐藏
}
window["AlphabetItem"] = AlphabetItem;
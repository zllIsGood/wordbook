/* 招募结果界面
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 18:41:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-13 20:14:25
 */
class HeroResultWin extends BaseEuiView {

    private closeBtn: BaseBtn;
    private img1: eui.Image;
    private img2: eui.Image;
    private img3: eui.Image;
    private img4: eui.Image;
    private img5: eui.Image;
    private img6: eui.Image;
    private imgE: eui.Image;
    private imgHero: eui.Image;
    private lab: eui.Label;
    private grp: eui.Group

    private result

    constructor() {
        super();
        this.skinName = `HeroResultSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);

        this.result = param[0]
        this.upView()
        // this.playTw()
    }

    private upView() {
        console.log(this.result)
        let data = this.result.award
        this.imgE.visible = false
        this.imgHero.visible = false
        let str: string = '获得'
        if (data.awardType == 0) {//体力
            this.imgE.visible = true
            str += data.energy + '体力值'
        }
        else if (data.awardType == 1) { // 减少cd
            //
        }
        else if (data.awardType == 2) { //招贤
            this.imgHero.visible = true
            let cfgStr = StringUtils.deleteChangeLine(data.sage.data)
            let cfg = JSON.parse(cfgStr)
            this.imgHero.source = cfg.fullImg
            str += data.sage.name
        }
        this.lab.text = str

        this.playTw()
    }

    private playTw() {
        let tw
        // tw = egret.Tween.get(this.img1, { loop: true })
        // tw.to({ rotation: 180 }, 1000).to({ rotation: 360 }, 1000)
        tw = egret.Tween.get(this.img2, { loop: true })
        tw.to({ rotation: -180 }, 1000).to({ rotation: -360 }, 1000)
        tw = egret.Tween.get(this.img3, { loop: true })
        tw.to({ rotation: 180 }, 1000).to({ rotation: 360 }, 1000)
        tw = egret.Tween.get(this.img4, { loop: true })
        tw.to({ scaleX: 0.4, scaleY: 0.4 }, 1000).to({ scaleX: 1, scaleY: 1 }, 1000)
        tw = egret.Tween.get(this.img5, { loop: true })
        tw.to({ scaleX: 0.4, scaleY: 0.4 }, 1000).to({ scaleX: 1, scaleY: 1 }, 1000)
        tw = egret.Tween.get(this.img6, { loop: true })
        tw.to({ scaleX: 0.4, scaleY: 0.4 }, 1000).to({ scaleX: 1, scaleY: 1 }, 1000)
    }

    public close(...param: any[]): void {
        this.result = null
        // egret.Tween.removeTweens(this.img1)
        egret.Tween.removeTweens(this.img2)
        egret.Tween.removeTweens(this.img3)
        egret.Tween.removeTweens(this.img4)
        egret.Tween.removeTweens(this.img5)
        egret.Tween.removeTweens(this.img6)
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.closeBtn:
                ViewManager.ins().close(this)
                ViewManager.ins().close(HeroSelectWin)
                break;

        }
    }

}
ViewManager.ins().reg(HeroResultWin, LayerManager.UI_Popup);
window["HeroResultWin"] = HeroResultWin;
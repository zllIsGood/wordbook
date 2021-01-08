/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 17:49:00 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-20 19:54:31
 */
class PlayFinshWin extends BaseEuiView {

    private returnBtn: BaseBtn;
    private nextBtn: BaseBtn;
    private wordGrp: eui.Group;
    private energyNum: eui.Label;
    private leftTimeLab: eui.Label;
    private energyBtn: BaseBtn;
    private shareBtn: BaseBtn;
    private stageGrp: eui.Group;
    private stageNumGrp: eui.Group;
    private red: eui.Image;
    private grp: eui.Group
    private mc: MovieClip
    private checkbox: eui.CheckBox

    constructor() {
        super();
        this.skinName = `PlayFinshSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.returnBtn, this.onClick);
        this.addTouchEvent(this.energyBtn, this.onClick);
        this.addTouchEvent(this.shareBtn, this.onClick);
        this.addTouchEvent(this.nextBtn, this.onNext);
        this.observe(WordModel.ins().postBook, this.upWord)
        this.observe(UserModel.ins().postData, this.upTop)

        SoundManager.ins().playEffect('pass_mp3')
        this.upView()
        // AdService.createBannerAd(Ad.playBanner)
        App.ins().playBannerAd(Ad.playBanner)
    }

    private upView() {
        this.showCheck()
        this.playTw()
        this.upTop()
        this.upWord()
        this.upStage()
        this.playMc()
    }

    private showCheck() {
        if (!App.ins().isOpenAd() || Main.gamePlatform != Main.platformApp) {
            this.checkbox.visible = false
            return
        }
        let b = false
        let num = UserModel.ins().getStageNum()
        let c = Main.energyConfig.stageWatchAdInterval
        c = c > 0 ? c : 3
        if (num % c == (c - 1)) {
            b = true
        }
        this.checkbox.visible = true
        this.checkbox.selected = b
    }

    private playTw() {
        if (App.ins().isShowShareBtn()) {
            this.shareBtn.visible = true
            egret.Tween.removeTweens(this.shareBtn)
            this.shareBtn.scaleX = 1
            this.shareBtn.scaleY = 1
            let tw = egret.Tween.get(this.shareBtn, { loop: true })
            tw.to({ scaleX: 1, scaleY: 1 }, 500)
                .to({ scaleX: 0.92, scaleY: 0.92 }, 500)
                .to({ scaleX: 1, scaleY: 1 }, 500)
        }
        else {
            this.shareBtn.visible = false
        }
    }

    private playMc() {
        if (!this.mc) {
            this.mc = new MovieClip()
        }
        else {
            DisplayUtils.removeFromParent(this.mc)
        }
        this.grp.addChild(this.mc)
        let cfg = GlobalConfig.getHeroResult()
        this.mc.x = cfg.x
        this.mc.y = cfg.y
        this.mc.playFile(App.ins().getResRoot() + cfg.url, 1)
    }

    private upStage() {
        this.red.visible = false
        let upVo = Main.userData.upGradeVo
        let bool = false
        let strImg
        if (upVo && upVo.count > 0) {
            if (upVo.nextBonusState == 0) {
                bool = true
                strImg = 'number_house_png'
            }
            else if (upVo.nextBonusState == 1) {
                bool = true
                strImg = 'number_protagonist_png'
            }
            else if (upVo.nextBonusState == 2) {
                bool = true
                strImg = 'number_character_png'
            }
            else if (upVo.nextBonusState == 3) {
                //
            }
        }
        if (upVo && upVo.count == 0 && upVo.nextBonusState != 3) {
            this.red.visible = true
        }
        this.stageGrp.visible = bool
        if (bool) {
            let imgarr = StringUtil.getImgByNumber(upVo.count)
            this.stageGrp.removeChildren()
            let obj = new eui.Image()
            obj.source = 'number_need_png'
            this.stageGrp.addChild(obj)
            for (let i = 0; i < imgarr.length; i++) {
                obj = new eui.Image()
                obj.source = imgarr[i]
                this.stageGrp.addChild(obj)
            }
            obj = new eui.Image()
            obj.source = strImg
            this.stageGrp.addChild(obj)
        }

        this.stageNumGrp.removeChildren()
        let obj = new eui.Image()
        obj.source = 'number_no_png'
        this.stageNumGrp.addChild(obj)
        let num = UserModel.ins().getStageNum()
        let numArr = StringUtil.getImgByNumber(num)
        for (let i = 0; i < numArr.length; i++) {
            obj = new eui.Image()
            obj.source = numArr[i]
            this.stageNumGrp.addChild(obj)
        }
        obj = new eui.Image()
        obj.source = 'number_level_png'
        this.stageNumGrp.addChild(obj)
    }

    private async upWord() {
        this.wordGrp.removeChildren()
        let words = JSON.parse(PlayModel.ins().oldStage.words) as any[]

        for (let i in words) {
            let word = words[i].word
            let src = await WordModel.ins().getWordSource(word)

            let data = { word: word, source: src, type: WordItemType.fromPlay } //
            let obj = new WordItem()
            obj.data = data
            this.wordGrp.addChild(obj)
        }
    }

    private upTop() {
        let userModel = UserModel.ins()
        let isOver = userModel.isMaxEnergy()
        let time = userModel.getEnergyRefresh()
        let num = userModel.getEnergy()
        this.energyNum.text = num + ''

        TimerManager.ins().remove(this.timer, this)
        if (isOver) {
            this.leftTimeLab.text = '已满'
        }
        else {
            this.leftTimeLab.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_3)
            if (time > 0) {
                TimerManager.ins().doTimer(1000, 0, this.timer, this)
            }
        }
    }

    private timer() {
        let time = UserModel.ins().getEnergyRefresh()
        if (time > 0) {
            this.leftTimeLab.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_3)
        }
        else {
            TimerManager.ins().remove(this.timer, this)
            // this.leftTimeLab.text = '已满'
            this.leftTimeLab.text = DateUtils.getFormatBySecond(time, DateUtils.TIME_FORMAT_3)
            UserModel.ins().refreshEnergy()
        }
    }

    public close(...param: any[]): void {
        PlayModel.ins().oldStage = null
        this.wordGrp.removeChildren()
        this.stageGrp.removeChildren()
        this.stageNumGrp.removeChildren()
        TimerManager.ins().remove(this.timer, this)
        DisplayUtils.removeFromParent(this.mc)
        egret.Tween.removeTweens(this.shareBtn)
        this.mc = null
        App.ins().destoryBanner()
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.returnBtn:
                ViewManager.ins().close(this)
                ViewManager.ins().open(HomeWin)
                break;
            case this.energyBtn:
                ViewManager.ins().open(EnergyAdWin)
                break;
            case this.shareBtn:
                UserModel.ins().postVideoShare()
                this.shareBtn.visible = false
                break;
        }
    }

    private async onNext(e: egret.TouchEvent) {
        if (!this.checkbox.visible) {
            this.toNext()
            return
        }
        if (!this.checkbox.selected) {
            this.toNext()
            return
        }
        App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
            AdService.adAddTip(this.toNext.bind(this))
        }).bind(this))
    }

    private async toNext() {
        if (UserModel.ins().getEnergy() > 0 /*|| UserModel.ins().isStartStage()*/) {
            let canPlay = await PlayModel.ins().play()
            if (canPlay) {
                ViewManager.ins().open(PlayWin)
                ViewManager.ins().close(this)
            }
            else {
                wx.showToast({ icon: 'none', title: "已全部通关" })
            }
        }
        else {
            if (App.ins().hideAdIcon()) {
                // App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                //     AdService.watchAdAward(this.toNext.bind(this))
                // }).bind(this))
                wx.showToast({ icon: 'none', title: "体力不足" })
            }
            else {
                ViewManager.ins().open(EnergyAdWin/*EnergyWin*/)
            }
        }
    }
}
ViewManager.ins().reg(PlayFinshWin, LayerManager.UI_Popup);
window["PlayFinshWin"] = PlayFinshWin;
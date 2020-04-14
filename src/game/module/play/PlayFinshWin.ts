/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-02 17:49:00 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-13 20:09:12
 */
class PlayFinshWin extends BaseEuiView {

    private returnBtn: BaseBtn;
    private nextBtn: BaseBtn;
    private wordGrp: eui.Group;
    private energyNum: eui.Label;
    private leftTimeLab: eui.Label;
    private energyBtn: BaseBtn;
    private stageGrp: eui.Group;
    private stageNumGrp: eui.Group;
    private grp: eui.Group
    private mc: MovieClip

    constructor() {
        super();
        this.skinName = `PlayFinshSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.returnBtn, this.onClick);
        this.addTouchEvent(this.nextBtn, this.onClick);
        this.addTouchEvent(this.energyBtn, this.onClick);
        this.observe(WordModel.ins().postBook, this.upWord)
        this.observe(UserModel.ins().postData, this.upTop)

        SoundManager.ins().playEffect('pass_mp3')
        this.upView()
    }

    private upView() {
        this.upTop()
        this.upWord()
        this.upStage()
        this.playMc()
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
        this.mc.playFile(cfg.url, 1)
    }

    private upStage() {
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
        // this.removeTouchEvent(this.returnBtn, this.onClick);
        // this.removeObserve();
        DisplayUtils.removeFromParent(this.mc)
        this.mc = null
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.returnBtn:
                ViewManager.ins().close(this)
                ViewManager.ins().open(HomeWin)
                break;
            case this.nextBtn:
                if (UserModel.ins().getEnergy() > 0) {
                    ViewManager.ins().close(this)
                    ViewManager.ins().open(PlayWin)
                }
                else {
                    // wx.showToast({ icon: 'none', title: "体力不足" })
                    ViewManager.ins().open(EnergyWin)
                }
                break;
            case this.energyBtn:
                ViewManager.ins().open(EnergyFreeWin)
                break;
        }
    }

}
ViewManager.ins().reg(PlayFinshWin, LayerManager.UI_Popup);
window["PlayFinshWin"] = PlayFinshWin;
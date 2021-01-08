/* 主页
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 10:27:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-20 19:58:05
 */
class HomeWin extends BaseEuiView {

    private role: RoleItem;
    private heroGrp: eui.Group;
    private heroGrp0: eui.Group;
    private heroGrp1: eui.Group;
    private bg: eui.Image;
    private house: eui.Image;
    private roleJob: RoleJobItem;

    /**体力按钮*/
    private energyBtn: BaseBtn;
    private energyNum: eui.Label;
    private leftTimeLab: eui.Label;

    private recruitRed: eui.Image
    private recruitkBtn: BaseBtn;
    private setBtn: BaseBtn;
    private rankBtn: BaseBtn;
    private freeBtn: BaseBtn;
    private wordBtn: BaseBtn;
    private musicBtn: BaseBtn;
    private playBtn: BaseBtn;
    private upgradeBtn: BaseBtn;
    private stageGrp: eui.Group;
    private mainGrp: eui.Group;
    private mc: MovieClip


    constructor() {
        super();
        this.skinName = `HomeSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.energyBtn, this.onClick);
        this.addTouchEvent(this.recruitkBtn, this.onClick);
        this.addTouchEvent(this.setBtn, this.onClick);
        this.addTouchEvent(this.rankBtn, this.onClick);
        this.addTouchEvent(this.freeBtn, this.onClick);
        this.addTouchEvent(this.wordBtn, this.onClick);
        this.addTouchEvent(this.musicBtn, this.onClick);
        this.addTouchEvent(this.upgradeBtn, this.onClick);
        this.addTouchEvent(this.roleJob, this.openRoleLevel);
        this.addTouchEvent(this.role, this.openRoleLevel);
        this.addTouchEvent(this.house, this.openHouse);
        this.addTouchEvent(this.playBtn, this.onPlay);

        this.observe(UserModel.ins().postData, this.upView);
        this.observe(HeroModel.ins().postHero, this.setHero);
        this.observe(HeroModel.ins().postHero, this.setHero);
        this.observe(HouseModel.ins().postUpLevel, this.upgradeMc);
        this.observe(HeroModel.ins().postDailyRecruit, this.upRecruitkBtn);

        this.freeBtn.visible = !App.ins().hideAdIcon()

        this.upRecruitkBtn()
        this.upView()
        this.setHero()
        StageUtils.ins().adaptationIpx2(this.bg)
        this.setUserProto()
        SoundManager.ins().playBg()
    }

    private setUserProto() {
        let show = Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS
        this.setBtn.visible = show
    }

    private upView() {
        this.upRole()
        this.upHouse()
        this.upTop()
        this.upBottom()
    }

    private upRecruitkBtn() {
        let c = HeroModel.ins().dailyRecruitCount
        this.recruitkBtn.label = c + ''
        let bool = /*App.ins().isOpenAd() &&*/ Main.gamePlatform != Main.platformTT/*Main.gamePlatform == Main.platformApp*/
        this.recruitkBtn.visible = bool

        this.recruitRed.visible = bool && c > 0
    }

    private setHero() {
        this.clearHero()
        let heroCfgs = HeroModel.ins().getHeroShowData()
        if (!heroCfgs) {
            return
        }

        let data0 = heroCfgs.show0
        let w = 150
        let x = 75
        for (let cfg of data0) {
            let obj = new RoleItem()
            this.heroGrp0.addChild(obj)
            obj.data = cfg
            obj.x = x
            x += w
            obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this)
        }
        let data1 = heroCfgs.show1
        x = 0
        for (let cfg of data1) {
            let obj = new RoleItem()
            this.heroGrp1.addChild(obj)
            obj.data = cfg
            obj.x = x
            x += w
            obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this)
        }
    }

    private clearHero() {
        let child0 = this.heroGrp0.$children
        for (let i in child0) {
            child0[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this)
        }
        this.heroGrp0.removeChildren()
        let child1 = this.heroGrp1.$children
        for (let i in child1) {
            child1[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this)
        }
        this.heroGrp1.removeChildren()
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
            else {
                UserModel.ins().refreshEnergy()
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

    private upBottom() {
        this.rankBtn.visible = RankModel.ins().isExist()
        let musicOpen = UserModel.ins().musicOpen
        if (musicOpen) {
            this.musicBtn.icon = 'index_bgm_on_btn_png'
        }
        else {
            this.musicBtn.icon = 'index_bgm_off_btn_png'
        }

        let upVo = Main.userData.upGradeVo
        let count: number
        let bool1 = false
        let bool2 = false
        let bc: boolean
        let strImg
        if (upVo) {
            count = upVo.count
            bc = count == 0
            if (upVo.nextBonusState == 0) { //房屋升级
                if (bc) {
                    this.upgradeBtn.icon = 'upgrade_action_house_png'
                    bool1 = true
                }
                else {
                    strImg = 'number_house_png'
                    bool2 = true
                }
            }
            else if (upVo.nextBonusState == 1) { //人物升级
                if (bc) {
                    this.upgradeBtn.icon = 'upgrade_action_protagonist_png'
                    bool1 = true
                }
                else {
                    strImg = 'number_protagonist_png'
                    bool2 = true
                }
            }
            else if (upVo.nextBonusState == 2) { //招贤
                if (bc) {
                    this.upgradeBtn.icon = 'upgrade_action_character_png'
                    bool1 = true
                }
                else {
                    strImg = 'number_character_png'
                    bool2 = true
                }
            }
            else if (upVo.nextBonusState == 3) {
                //
            }
        }
        this.upgradeBtn.visible = bool1
        this.stageGrp.visible = bool2
        if (bool2) {
            let imgarr = StringUtil.getImgByNumber(count)
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
    }

    private upRole() {
        RoleModel.ins().getSingle(UserModel.ins().getRoleId(), (data) => {
            this.role.data = data
            this.roleJob.data = data.name
        })
    }

    private upHouse() {
        HouseModel.ins().getSingle(UserModel.ins().getHouseId(), (data) => {
            let str = data.data as string
            str = StringUtils.deleteChangeLine(str)
            let obj = JSON.parse(str)
            this.house.source = obj.houseImg
            this.bg.source = obj.bgImg
        })
    }

    public close(...param: any[]): void {
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
        this.clearHero()
        TimerManager.ins().remove(this.timer, this)
        this.stageGrp.removeChildren()
        SoundManager.ins().stopBg()
        DisplayUtils.removeFromParent(this.mc)
    }

    private openHouse() {
        SoundManager.ins().playEffect('square_tap_mp3')
        ViewManager.ins().open(HouseWin)
    }

    private openRoleLevel() {
        SoundManager.ins().playEffect('square_tap_mp3')
        ViewManager.ins().open(RoleUpLevelWin)
    }

    private openHeroWin(e: egret.TouchEvent) {
        SoundManager.ins().playEffect('square_tap_mp3')
        let t = e.currentTarget as RoleItem
        ViewManager.ins().open(HeroWin, t.data)
    }

    private async onPlay(e: egret.TouchEvent) {
        if (UserModel.ins().getEnergy() > 0 || UserModel.ins().isStartStage()) {
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
            // wx.showToast({ icon: 'none', title: "体力不足" })
            if (App.ins().hideAdIcon()) {
                // App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
                //     AdService.watchAdAward(this.onPlay.bind(this))
                // }).bind(this))
                wx.showToast({ icon: 'none', title: "体力不足" })
            }
            else {
                ViewManager.ins().open(EnergyAdWin/*EnergyWin*/)
            }
        }
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.energyBtn:
                if (!App.ins().hideAdIcon()) {
                    ViewManager.ins().open(EnergyAdWin)
                }
                break;
            case this.setBtn:
                ViewManager.ins().open(SetWin)
                break;
            case this.rankBtn:
                RankModel.ins().show()
                break;
            case this.freeBtn:
                ViewManager.ins().open(EnergyFreeWin/*EnergyAdWin*/)
                break;
            case this.wordBtn:
                ViewManager.ins().open(WordBookWin)
                break;
            case this.musicBtn:
                UserModel.ins().musicOpen = !UserModel.ins().musicOpen
                this.upBottom()
                break;
            case this.upgradeBtn:
                let upVo = Main.userData.upGradeVo
                if (upVo) {
                    if (upVo.nextBonusState == 0) {
                        HouseModel.ins().upLevel()
                    }
                    else if (upVo.nextBonusState == 1) {
                        RoleModel.ins().upLevel()
                    }
                    else if (upVo.nextBonusState == 2) {
                        ViewManager.ins().open(HeroSelectWin)
                    }
                }
                break;
            case this.recruitkBtn:
                let cs = Main.energyConfig.dailyRecruitCount
                let c = HeroModel.ins().dailyRecruitCount
                if (cs == c) {
                    ViewManager.ins().open(HeroSelectWin, true)
                }
                else {
                    App.ins().watchAdCall(AwardType.TIP_VIDEO, () => {
                        ViewManager.ins().open(HeroSelectWin, true)
                    })
                }
                break;
        }
    }

    private upgradeMc() {
        if (!this.mc) {
            this.mc = new MovieClip()
        }
        else {
            DisplayUtils.removeFromParent(this.mc)
        }
        this.mainGrp.addChild(this.mc)
        let cfg = GlobalConfig.getUpHouseMc()
        this.mc.x = cfg.x
        this.mc.y = cfg.y
        this.mc.playFile(App.ins().getResRoot() + cfg.url, 1, this.upView.bind(this))  //必须刷新下整个界面
    }
}
ViewManager.ins().reg(HomeWin, LayerManager.UI_Main);
window["HomeWin"] = HomeWin;
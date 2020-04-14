/* 主页
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 10:27:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-13 16:34:43
 */
class HomeWin extends BaseEuiView {

    private role: RoleItem;
    private heroGrp: eui.Group;
    private bg: eui.Image;
    private house: eui.Image;
    private roleJob: RoleJobItem;

    /**体力按钮*/
    private energyBtn: BaseBtn;
    private energyNum: eui.Label;
    private leftTimeLab: eui.Label;

    private rankBtn: BaseBtn;
    private freeBtn: BaseBtn;
    private wordBtn: BaseBtn;
    private musicBtn: BaseBtn;
    private playBtn: BaseBtn;
    private upgradeBtn: BaseBtn;
    private stageGrp: eui.Group;


    constructor() {
        super();
        this.skinName = `HomeSkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.energyBtn, this.onClick);
        this.addTouchEvent(this.rankBtn, this.onClick);
        this.addTouchEvent(this.freeBtn, this.onClick);
        this.addTouchEvent(this.wordBtn, this.onClick);
        this.addTouchEvent(this.musicBtn, this.onClick);
        this.addTouchEvent(this.playBtn, this.onClick);
        this.addTouchEvent(this.upgradeBtn, this.onClick);
        this.addTouchEvent(this.roleJob, this.openRoleLevel);
        this.addTouchEvent(this.role, this.openRoleLevel);
        this.addTouchEvent(this.house, this.openHouse);

        this.observe(UserModel.ins().postData, this.upView);
        this.observe(HeroModel.ins().postHide, this.setHero);
        this.upView()
        this.adaptationIpx()
    }

    public adaptationIpx() {
        let w = StageUtils.ins().getWidth()
        let h = StageUtils.ins().getHeight()
        let bi = (h / w) / (1547 / 750)
        if (bi > 1) {
            DisplayUtils.setScale(this.bg, bi)
        }
        else {
            DisplayUtils.setScale(this.bg, 1)
        }
    }

    private upView() {
        this.upMap()
        this.upTop()
        this.upBottom()
        this.setHero()
    }

    private setHero() {
        this.clearHero()
        let ids = HeroModel.ins().getHeroShow()
        if (!ids || ids.length == 0) {
            return
        }

        // HeroModel.ins().getIds(ids, (data) => {
        let data = ids.length > 8 ? ids.slice(0, 8) : ids
        console.log(data)
        let w = 160
        let h = 132
        let x = 560
        let y = 0
        for (let cfg of data) {
            let obj = new RoleItem()
            this.heroGrp.addChildAt(obj, 0)
            obj.data = cfg.sage
            obj.x = x
            obj.y = y
            x -= w
            if (x < 0) {
                x = 560
                y -= h
            }
        }

        let child = this.heroGrp.$children
        for (let i in child) {
            child[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this)
        }
        // })
    }

    private clearHero() {
        let child = this.heroGrp.$children
        for (let i in child) {
            child[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.openHeroWin, this)
        }
        this.heroGrp.removeChildren()
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

    private upMap() {
        this.upHouse()
        this.upRole()
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
    }

    private openHouse() {
        ViewManager.ins().open(HouseWin)
    }

    private openRoleLevel() {
        ViewManager.ins().open(RoleUpLevelWin)
    }

    private openHeroWin(e: egret.TouchEvent) {
        ViewManager.ins().open(HeroWin)
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.energyBtn:
                ViewManager.ins().open(EnergyFreeWin)
                break;
            case this.rankBtn:
                // ViewManager.ins().open(RankWin)
                break;
            case this.freeBtn:
                ViewManager.ins().open(EnergyFreeWin)
                break;
            case this.wordBtn:
                ViewManager.ins().open(WordBookWin)
                break;
            case this.musicBtn:
                UserModel.ins().musicOpen = !UserModel.ins().musicOpen
                this.upBottom()
                break;
            case this.playBtn:
                if (UserModel.ins().getEnergy() > 0 || UserModel.ins().isStartStage()) {
                    ViewManager.ins().open(PlayWin)
                    ViewManager.ins().close(this)
                }
                else {
                    // wx.showToast({ icon: 'none', title: "体力不足" })
                    ViewManager.ins().open(EnergyWin)
                }
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

        }
    }

}
ViewManager.ins().reg(HomeWin, LayerManager.UI_Main);
window["HomeWin"] = HomeWin;
/* 关卡玩法界面
 * @Author: zhoualnglang 
 * @Date: 2020-04-01 13:47:19 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-30 14:23:58
 */
class PlayWin extends BaseEuiView {

    private returnBtn: BaseBtn;
    private courseBtn: BaseBtn;
    private tipBtn: BaseBtn;
    private replayBtn: BaseBtn;
    private grp1: eui.Group;
    private grp2: eui.Group;
    private stageNumGrp: eui.Group;
    private playTip: PlayTipItem;
    private searchGrp: eui.Group;
    private searchLabGrp: eui.Group;
    private searchLab: eui.Label;
    private searchLab0: eui.Label;
    private searchLab1: eui.Label;
    private searchImg: eui.Image;

    private topItems: AlphabetItem[]
    private bottomItems: AlphabetItem[]

    constructor() {
        super();
        this.skinName = `PlaySkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.courseBtn, this.onClick);
        this.addTouchEvent(this.returnBtn, this.onClick);
        this.addTouchEvent(this.replayBtn, this.onClick);
        this.addTouchEvent(this.searchGrp, this.onSearchGrp);
        this.addTouchEvent(this.tipBtn, this.tip);

        this.searchGrp.mask = new egret.Rectangle(0, 0, 714, 42)
        this.initView()
        this.initTip()
        this.upSearch()
        UserModel.ins().postVideoStart()
    }

    private async initTip() {
        this.playTip.visible = false
        let upVo = await PlayModel.ins().getNextUpgrade()

        if (upVo && upVo.nextBonusState != 3 && upVo.count > 0) {
            this.playTip.data = { type: 1, upGradeVo: upVo }
            this.playTip.visible = true
        }
        else {
            this.playTip.visible = false
        }
    }

    private onSearchGrp() {
        console.log('onSearchGrp btn!')
        let showMeans = PlayModel.ins().showMeans
        if (!showMeans) {
            ViewManager.ins().open(PlaySearchWin, this.upMean, this)
            // App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
            //     PlayModel.ins().setShowMeans(true)
            //     this.upSearch()
            // }).bind(this))
        }
    }

    private upMean() {
        App.ins().watchAdCall(AwardType.TIP_VIDEO, (() => {
            PlayModel.ins().setShowMeans(true)
            this.upSearch()
        }).bind(this))
    }

    private async upSearch() {
        let showMeans = PlayModel.ins().showMeans
        let showTw = false
        let str = null
        let item = this.getCurItem()
        if (showMeans && item) {
            this.searchLabGrp.visible = true
            this.searchImg.visible = false
            this.searchLab.visible = false
            showTw = true
            let fromWord = item.data.fromWord

            for (let i in fromWord) {
                if (str == null) {
                    str = ''
                }
                else {
                    str += '  '
                }
                let m_word = PlayModel.ins().getStageWord(fromWord[i])
                if (m_word.isHorizon) {
                    str += `横向:`
                }
                else {
                    str += `纵向:`
                }
                let wordDate = await WordModel.ins().getWord(fromWord[i])
                for (let item of wordDate.basic.explains) {
                    str += `${item};`
                }
            }
        }
        else {
            this.searchLabGrp.visible = false
            this.searchImg.visible = true
            this.searchLab.visible = true
        }
        if (showTw) {
            this.searchLab0.text = str
            this.searchLab1.text = str
            egret.Tween.removeTweens(this)
            this.weight = 0
            this.changeSearch()
            let width = this.searchLab0.width
            if (width > this.searchGrp.width) {
                let tw = egret.Tween.get(this, { loop: true, onChange: this.changeSearch, onChangeObj: this })
                tw.wait(500).to({ weight: 1 }, width * 30).call(() => {
                    this.weight = 0
                }, this)
            }
            else {
                this.searchLab1.text = ''
            }
        }
        else {
            egret.Tween.removeTweens(this)
            this.searchLab0.text = ''
            this.searchLab1.text = ''
        }
    }
    private weight = 0
    private changeSearch() {
        this.searchLab0.x = this.searchLab0.width * (-this.weight)
        this.searchLab1.x = this.searchLab0.width * (-this.weight + 1)
    }

    private initView() {
        this.grp1.removeChildren()
        this.grp2.removeChildren()
        this.topItems = []
        this.bottomItems = []

        let topWords = PlayModel.ins().getTopWords()
        let bottomWords = PlayModel.ins().getBottomWords()

        for (let item of topWords) {
            let obj = new AlphabetItem()
            obj.currentState = 'top'
            obj.data = item
            this.grp1.addChild(obj)
            obj.x = item.x * 57 + 20 + 26
            obj.y = item.y * 57 + 20 + 26
            if (item.isBlank) {
                this.addTouchEvent(obj, this.onTop)
            }
            this.topItems.push(obj)
        }
        let x = 0 + 26, y = 0 + 26;
        for (let item of bottomWords) {
            let obj = new AlphabetItem()
            obj.currentState = 'bottom'
            obj.data = item
            obj.x = x
            obj.y = y
            obj.scaleX = 1.175
            obj.scaleY = 1.175
            if (x >= (700 - 94)) {
                y += 94 + 10
                x = 0 + 26
            }
            else {
                x += 94 + 7
            }
            this.grp2.addChild(obj)
            if (item.state == AlphabetItemState.bottom_hide) {
                obj.visible = false
            }
            this.addTouchEvent(obj, this.onBottom)
            this.bottomItems.push(obj)
        }

        this.upTipCount()
        this.upStage()
        this.upTopColor()
        if (!this.getCurItem()) {
            this.goWin()
        }
    }

    private upTipCount() {
        let c = PlayModel.ins().tipCount
        if (c > 0) {
            this.tipBtn.miniLabel = String(c)
            this.tipBtn.icon = 'tip_btn_png'
        }
        else {
            this.tipBtn.miniLabel = ''
            // this.tipBtn.icon = 'tip_btn_share_png'
            if (App.ins().adNotScore()) {
                this.tipBtn.icon = App.ins().hideAdIcon() ? 'tip_btn_png' : 'tip_btn_share_png'
            }
            else {
                this.tipBtn.icon = 'tip_btn_score_png'
            }
        }
    }

    private upStage() {
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



    public close(...param: any[]): void {
        this.topItems = null
        this.bottomItems = null
        this.stageNumGrp.removeChildren()
        UserModel.ins().postVideoStop()
        egret.Tween.removeTweens(this)
    }

    private onTop(e: egret.TouchEvent) {
        SoundManager.ins().playEffect('square_tap_mp3')
        let target = e.currentTarget as AlphabetItem
        let cur = this.getCurItem()
        // console.log(target, target.data, cur)
        if (target.data.state != AlphabetItemState.locked /*&& cur != target*/) {
            cur.data.state = (cur.data.state == AlphabetItemState.input) ? AlphabetItemState.blank : AlphabetItemState.state_wrong
            if (target.data.state == AlphabetItemState.blank) {
                target.data.state = AlphabetItemState.input
            }
            else if (target.data.state == AlphabetItemState.state_wrong || target.data.state == AlphabetItemState.input_wrong) {
                let hide = this.bottomItems[target.data.num]
                hide.visible = true
                hide.data.state = AlphabetItemState.bottom_show
                hide.upDate()
                target.data.state = AlphabetItemState.input
                target.data.num = -1
                target.data.input = null
            }
            cur.upDate()
            target.upDate()
            this.upTopColor()
            this.upSearch()
        }
    }

    private onBottom(e: egret.TouchEvent) {
        let target = e.currentTarget as AlphabetItem
        let cur = this.getCurItem()
        this.inputWord(cur, target)
    }

    private inputWord(cur: AlphabetItem, target: AlphabetItem) {
        target.visible = false
        target.data.state = AlphabetItemState.bottom_hide
        if (cur.data.num != -1) { //已经选了1个 需要放回
            let hide = this.bottomItems[cur.data.num]
            hide.visible = true
            hide.data.state = AlphabetItemState.bottom_show
            hide.upDate()
        }
        cur.data.num = target.data.num
        let char = this.bottomItems[cur.data.num].data.alphabet
        cur.data.input = char

        let locks = PlayModel.ins().getStateWord(cur.data)
        if (locks.type == 1) {
            SoundManager.ins().playEffect('finish_mp3')
            this.upLock(locks.data)
            this.resetNext(cur)
        }
        else if (locks.type == -1) {
            SoundManager.ins().playEffect('error_mp3')
            cur.data.state = AlphabetItemState.input_wrong
            cur.upDate()
        }
        else {
            SoundManager.ins().playEffect('letter_tap_mp3')
            cur.data.state = AlphabetItemState.state_wrong //input_wrong
            cur.upDate()
            this.resetNext(cur)
        }
        this.upTopColor()
        this.upSearch()
    }

    private getCurItem() {
        for (let item of this.topItems) {
            if (item.data.state == AlphabetItemState.input || item.data.state == AlphabetItemState.input_wrong) {
                return item
            }
        }
    }

    private getTopItem(lock) {
        for (let item of this.topItems) {
            if (item.data.x == lock.x && item.data.y == lock.y) {
                return item
            }
        }
    }

    private upTopColor() {
        if (!this.topItems) {
            return
        }
        for (let item of this.topItems) {
            item.upColor()
        }
    }

    private upLock(locks: any[]) {
        if (!locks || locks.length == 0) {
            return
        }
        for (let item of locks) {
            let obj = this.getTopItem(item)
            obj.data.state = AlphabetItemState.locked
            obj.upDate()
        }
    }

    private resetNext(cur: AlphabetItem) {
        let win = true
        let next: AlphabetItem = null
        let sameItem: AlphabetItem = null
        for (let item of this.topItems) {
            if (item != cur) {
                let state = item.data.state
                if (state == AlphabetItemState.blank) {
                    win = false
                    let isSame = PlayModel.ins().isSame(item.data.fromWord, cur.data.fromWord)
                    if (isSame) {
                        sameItem = sameItem ? sameItem : item
                    }
                    next = next ? next : item
                }
                else if (state == AlphabetItemState.state_wrong) {
                    win = false
                    next = next ? next : item
                }
            }
        }

        if (win) {
            this.goWin()
            return
        }
        next = sameItem ? sameItem : next
        next.data.state = (next.data.state == AlphabetItemState.blank) ? AlphabetItemState.input : AlphabetItemState.input_wrong
        next.upDate()
    }

    private async goWin() {
        await PlayModel.ins().playFinsh()
        TimerManager.ins().doTimer(1000, 1, () => {
            ViewManager.ins().close(this)
            ViewManager.ins().open(PlayFinshWin)
        }, this)
    }

    private replay() {
        for (let child of this.grp1.$children) {
            this.removeTouchEvent(child, this.onClick)
        }
        for (let child of this.grp2.$children) {
            this.removeTouchEvent(child, this.onClick)
        }
        this.topItems = null
        this.bottomItems = null
        PlayModel.ins().replay()
        this.initView()
    }

    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.returnBtn:
                ViewManager.ins().open(HomeWin)
                ViewManager.ins().close(this)
                break;
            case this.courseBtn:
                ViewManager.ins().open(CoursePlayWin)
                break;
            case this.replayBtn:
                ViewManager.ins().open(RePlayWin, this.replay, this)
                break;
        }
    }

    private async tip() {
        console.log('tip')
        if (PlayModel.ins().tipCount > 0) {
            await PlayModel.ins().playTip()
            this.showTip()
            this.upTipCount()
        }
        else {
            if (App.ins().hideAdIcon()) {
                return
            }
            App.ins().watchAdCall(AwardType.TIP_VIDEO, this.showTip.bind(this))
        }
    }

    private showTip() {
        let cur = this.getCurItem()
        if (!cur) {
            return
        }
        let bot = this.getShowBottom(cur.data.alphabet)
        if (!bot) {
            this.reWord(cur.data.alphabet)
            bot = this.getShowBottom(cur.data.alphabet)
        }
        this.inputWord(cur, bot)

        this.upTopColor()
    }

    private reWord(alphabet: string) {
        let ret = null
        for (let item of this.topItems) {
            if (item.visible && (item.data.state == AlphabetItemState.state_wrong || item.data.state == AlphabetItemState.input_wrong) && item.data.input == alphabet) {
                ret = item
                break;
            }
        }
        if (ret) {
            this.resetAlphabet(ret)
        }
    }

    /**将字母放回去*/
    private resetAlphabet(obj: AlphabetItem) {
        if (obj.data.state == AlphabetItemState.blank) {
            obj.data.state = AlphabetItemState.input
        }
        else if (obj.data.state == AlphabetItemState.state_wrong || obj.data.state == AlphabetItemState.input_wrong) {
            let hide = this.bottomItems[obj.data.num]
            hide.visible = true
            hide.data.state = AlphabetItemState.bottom_show
            hide.upDate()
            obj.data.state = AlphabetItemState.blank
            obj.data.num = -1
            obj.data.input = null
        }
        obj.upDate()
    }

    private getShowBottom(alphabet: string) {
        for (let item of this.bottomItems) {
            if (item.visible && item.data.alphabet == alphabet) {
                return item
            }
        }
        return null
    }
}
ViewManager.ins().reg(PlayWin, LayerManager.UI_Main);
window["PlayWin"] = PlayWin;
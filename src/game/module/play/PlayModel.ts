/* 关卡模块
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 10:20:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-13 19:33:32
 */
class PlayModel extends BaseClass {

    public static ins(): PlayModel {
        return super.ins();
    }

    public constructor() {
        super();

    }

    /**关卡单词数据*/
    public stage = null
    private stageWords: { blankList, firstLetterX, firstLetterY, isHorizon, word: string }[] = null
    private wordGroup: {} = null
    private topWords: { alphabet: string, x: number, y: number, isBlank: boolean, state: AlphabetItemState, num: number, input?: string, fromWord: string[] }[] = null
    private bottomWords: { alphabet: string, state: AlphabetItemState, num: number }[] = null
    public oldStage = null
    private _tipCount: number = 0
    public set tipCount(n) {
        this._tipCount = n
    }
    public get tipCount() {
        return this._tipCount
    }

    public replay() {
        this.topWords = null
        this.bottomWords = null
    }
    public getTopWords() {
        if (!this.topWords) {
            this.initWords()
        }
        return this.topWords
    }
    public getBottomWords() {
        if (!this.bottomWords) {
            this.initWords()
        }
        return this.bottomWords
    }
    public isWordErr(data) {
        let fromWord = data.fromWord as string[]
        let allt = false
        let allf = false
        for (let s of fromWord) {
            let bool = true
            let all = true
            let group = this.wordGroup[s]
            for (let item of group) {
                if (item.isBlank) {
                    if (item.num == -1) {
                        all = false
                        bool = false
                    }
                    else {
                        if (item.input != item.alphabet) {
                            bool = false
                        }
                    }
                }
            }
            if (all) {
                if (bool) {
                    allt = true
                }
                else {
                    allf = true
                }
            }
        }
        return !allt && allf
    }
    public isSame(fromWord1: string[], fromWord2: string[]) {
        for (let i of fromWord1) {
            for (let j of fromWord2) {
                if (i == j) {
                    return true
                }
            }
        }
        return false
    }
    public getStateWord(data) {
        let fromWord = data.fromWord as string[]
        let allt = []
        let allf = []
        for (let s of fromWord) {
            let bool = true
            let all = true
            let group = this.wordGroup[s]
            for (let item of group) {
                if (item.isBlank) {
                    if (item.num == -1) {
                        all = false
                        bool = false
                    }
                    else {
                        if (item.input != item.alphabet) {
                            bool = false
                        }
                    }
                }
            }
            if (all) {
                if (bool) {
                    allt.push(group)
                }
                else {
                    allf.push(group)
                }
            }
        }
        let ret = { type: 0, data: [] }
        if (allt.length > 0) {
            ret = { type: 1, data: allt }
        }
        else if (allf.length > 0) {
            ret = { type: -1, data: allf }
        }
        // console.log(ret, JSON.stringify(ret), JSON.stringify(allt))
        if (ret.data.length > 0) {
            let r = []
            let x = []
            let y = []
            for (let it of ret.data) {
                for (let item of it) {
                    if ((x.indexOf(item.x) < 0 && y.indexOf(item.y) < 0) || x.indexOf(item.x) != y.indexOf(item.y)) {
                        r.push(item)
                        x.push(item.x)
                        y.push(item.y)
                    }
                }
            }
            ret.data = r
        }
        return ret
    }
    private initWords() {
        if (this.stageWords == null) {
            this.stageWords = JSON.parse(this.stage.words) as any[]
            this.wordGroup = {}
        }
        // let arr = JSON.parse(this.stage.words) as any[]
        let words = []
        let initInput = false //初始化1个焦点
        for (let item of this.stageWords/*arr*/) {
            this.wordGroup[item.word] = []
            for (let i in item.blankList) {
                item.blankList[i] = Number(item.blankList[i])
            }
            let len = item.word.length
            let x = item.firstLetterY
            let y = item.firstLetterX
            let isHorizon = item.isHorizon
            for (let i = 0; i < len; i++) {
                let state = AlphabetItemState.stage
                let isBlank = (<Number[]>item.blankList).indexOf(i) >= 0
                if (isBlank) {
                    if (initInput) {
                        state = AlphabetItemState.blank
                    }
                    else {
                        initInput = true
                        state = AlphabetItemState.input
                    }
                }
                let obj = {
                    alphabet: item.word[i],
                    x: x,
                    y: y,
                    isBlank: isBlank,
                    state: state,
                    num: -1,
                    fromWord: [item.word]
                }
                if (isHorizon) {
                    x++
                }
                else {
                    y++
                }
                if (obj.isBlank) {
                    let add = true
                    for (let word of words) {
                        if (word.x == obj.x && word.y == obj.y) {
                            add = false
                            word.fromWord.push(item.word)
                            obj = word
                        }
                    }
                    if (add) {
                        words.push(obj)
                    }
                }
                else {
                    words.push(obj)
                }
                this.wordGroup[item.word].push(obj)
            }
        }
        this.topWords = words
        let bottomWords = []
        let arr2 = (<string>this.stage.blankLetters).split(',')
        for (let i in arr2) {
            bottomWords.push({
                alphabet: arr2[i],
                state: AlphabetItemState.bottom_show,
                num: Number(i),
            })
        }
        this.bottomWords = bottomWords
    }

    public async play() {
        if (this.stage == null) {
            let res = await RequestUtil.getPromise({ url: encodeURI(Main.host + Api.STAGE_PLAY) });
            console.log("STAGE_PLAY data:", res);
            if (res.code === 0) {
                this.stage = res.data.stage
                this.tipCount = res.data.remainTipsCount
                this.upUserData(res.data.userData)
            }
        }
        return
    }

    public async playFinsh() {
        let res = await RequestUtil.getPromise({ url: encodeURI(Main.host + Api.STAGE_FINSH) });
        console.log("STAGE_FINSH data:", res);
        if (res.code === 0) {
            this.upUserData(res.data.nud)
            this.oldStage = this.stage
            this.stage = null
            this.stageWords = null
            this.wordGroup = null
            this.topWords = null
            this.bottomWords = null
        }
    }

    public async playTip() {
        let res = await RequestUtil.getPromise({ url: encodeURI(Main.host + Api.STAGE_TIPS) });
        console.log("STAGE_TIPS data:", res);
        if (res.code === 0) {
            this.tipCount = res.data
        }
    }

    private upUserData(data) {
        if (data) {
            UserModel.ins().upUserData(data)
        }
    }
}
MessageCenter.compile(PlayModel);
window["PlayModel"] = PlayModel;
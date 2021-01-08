/* 单词-词典模块
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 10:20:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-30 13:53:54
 */
class WordModel extends BaseClass {

    public static ins(): WordModel {
        return super.ins();
    }

    public constructor() {
        super();

    }

    public words: any = {}
    public wordsSource: any = {}
    public wordsErr: any = {}
    public hasAddBook: any = {}
    /**学习中*/
    public wordBook1: any[] = null
    /**已掌握*/
    public wordBook2: any[] = null

    /**是否显示分享*/
    public isShowShare() {
        if (Main.gamePlatform == Main.platformTT) {
            return true
        }
        else if (Main.gamePlatform == Main.platformApp) {
            return false
        }
        else if (Main.gamePlatform == Main.platformIOS) {
            return false
        }
        else if (Main.gamePlatform == Main.platformH5) {
            return false
        }
        return false
    }

    public isReportErr(word: string) {
        if (this.wordsErr[word]) {
            return true
        }
        return false
    }

    /** 0 = 学习中， 1=已掌握 */
    private changeState(wbId: number, state: number) {
        if (state == 0 && this.wordBook1 == null) {
            this.wordBook1 = []
        }
        if (state == 1 && this.wordBook2 == null) {
            this.wordBook2 = []
        }
        let tar = state == 0 ? this.wordBook2 : this.wordBook1
        let des = state == 0 ? this.wordBook1 : this.wordBook2
        for (let i = 0; i < tar.length; i++) {
            if (tar[i].wbId == wbId) {
                tar[i].state = state
                let word = tar.splice(i, 1)
                des.push(word[0])
                break;
            }
        }
    }

    /**是否已加入生词本*/
    public isAddBook(word) {
        if (this.hasAddBook[word]) {
            return true
        }
        if (this.wordBook1) {
            for (let item of this.wordBook1) {
                if (item.word == word) {
                    return true
                }
            }
        }
        if (this.wordBook2) {
            for (let item of this.wordBook2) {
                if (item.word == word) {
                    return true
                }
            }
        }
        return false
    }

    /** 0 = 学习中， 1=已掌握 */
    public getWordGroup(type): any[] {
        let book = type == 0 ? this.wordBook1 : this.wordBook2
        if (!book || book.length == 0) {
            return null
        }
        let arr = []
        let obj = {} as any
        for (let i in book) {
            let str = book[i].word as string
            let s = str[0]
            if (!obj[s]) {
                obj[s] = []
            }
            obj[s].push(book[i])
        }
        let ty = type == 0 ? WordItemType.fromBook1 : WordItemType.fromBook2
        obj
        for (let i in obj) {
            arr.push({ data: obj[i], type: ty, s: i })
        }
        arr.sort((a, b) => {
            let bool = a.s < b.s
            return bool ? -1 : 1
        })
        return arr
    }

    /** 0 = 学习中， 1=已掌握 */
    public getBookWord(type, wid) {
        let book = type == 0 ? this.wordBook1 : this.wordBook2
        if (!book || book.length == 0) {
            return null
        }
        for (let item of book) {
            if (item.wbId == wid) {
                return JSON.parse(item.dirt)
            }
        }
        return null
    }

    public async getWordSource(word: string) {
        if (!this.wordsSource[word]) {
            await this.query(word)
        }
        return this.wordsSource[word]
    }

    public async getWord(word: string) {
        if (!this.words[word]) {
            await this.query(word)
        }
        return this.words[word]
    }

    private async query(word: string) {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.STAGE_WORD),
            data: {
                word: word
            }
        });
        console.log("STAGE_WORD data:", res);
        if (res.code === 0) {
            this.words[res.data.dict.word] = JSON.parse(res.data.dict.response)
            this.wordsSource[res.data.dict.word] = res.data.source
            if (res.data.hasAdd) {
                this.hasAddBook[res.data.dict.word] = true
            }
        }
    }

    public async addWord(word: string) {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.WORD_ADD),
            data: {
                word: word
            }
        });
        console.log("WORD_ADD data:", res);
        if (res.code === 0) {
            this.hasAddBook[word] = true
            this.postAdd()
            this.getWordList(0, true)
        }
    }
    /** 0 = 学习中， 1=已掌握 needRefresh强制更新 */
    public async getWordList(state: number, needRefresh = false) {
        if (!needRefresh) {
            if (this.wordBook1 && state == 0) {
                return this.wordBook1
            }
            if (this.wordBook2 && state == 1) {
                return this.wordBook2
            }
        }
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.WORD_LIST),
            data: {
                state: state
            }
        });
        console.log("WORD_LIST data:", res);
        if (res.code === 0) {
            if (state == 0) {
                this.wordBook1 = res.data
            }
            else {
                this.wordBook2 = res.data
            }
            if (needRefresh) {
                this.postBook()
            }
            return res.data
        }
    }

    /** 0 = 学习中， 1=已掌握 */
    public async changeWordState(wbId: number, state: number) {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.WORD_CHANGESTATE),
            data: {
                wbId: wbId,
                state: state
            }
        });
        console.log("WORD_CHANGESTATE data:", res);
        if (res.code === 0) {
            this.changeState(wbId, state)
            this.postBook()
            return true
        }
        return false
    }

    public async reportErrWord(word: string) {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.WORD_ERR),
            data: {
                word: word
            }
        });
        console.log("WORD_ERR data:", res);
        if (res.code === 0) {
            this.wordsErr[word] = true
            this.postErr()
        }
    }

    public postAdd() {

    }

    public postErr() {

    }

    public postBook() {

    }
}
MessageCenter.compile(WordModel);
window["WordModel"] = WordModel;
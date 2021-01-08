/* 招贤纳士模块
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 10:20:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-20 19:57:06
 */
class HeroModel extends BaseClass {

    public static ins(): HeroModel {
        return super.ins();
    }

    public constructor() {
        super();

    }

    private heroCfg: any[] = null
    private singleCfg = null
    private pages: number = 0
    private isAllGet = false
    private hideIds = null
    private hasAwardHero: number[] = null

    public setCfg(cfg) {
        this.heroCfg = cfg
        this.isAllGet = true
    }

    /**每日剩余招募次数*/
    private _dailyRecruitCount = 0
    /**每日剩余招募次数*/
    public get dailyRecruitCount() {
        let s = CacheUtil.get(Constant.DAILY_RECRUIT_DATA)
        if (!s || s == '') {
            this.dailyRecruitCount = Main.energyConfig.dailyRecruitCount
        }
        else {
            let obj = JSON.parse(s)
            let day = DateUtils.nowDay()
            if (day != obj.freshDay) {
                this.dailyRecruitCount = Main.energyConfig.dailyRecruitCount
            }
        }
        return this._dailyRecruitCount
    }
    public set dailyRecruitCount(c: number) {
        this._dailyRecruitCount = c > 0 ? c : 0
        let obj = { count: this._dailyRecruitCount, freshDay: DateUtils.nowDay() }
        CacheUtil.set(Constant.DAILY_RECRUIT_DATA, JSON.stringify(obj))
        this.postDailyRecruit()
    }

    /**是否隐藏*/
    public isHide(id) {
        if (this.hideIds == null) {
            let s = CacheUtil.get(Constant.HERO_HIDE)
            if (!s || s == '') {
                this.hideIds = []
                CacheUtil.set(Constant.HERO_HIDE, JSON.stringify(this.hideIds))
                return false
            }
            else {
                this.hideIds = JSON.parse(s)
            }

        }
        let i = this.hideIds.indexOf(id)
        return i >= 0
    }

    public setHideOrShow(id, hide) {
        if (this.hideIds == null) {
            this.hideIds = []
        }
        if (hide) {
            let show = this.getHeroShow()
            if (!show || show.length <= 1) { //必须要显示1个
                return false
            }
            this.hideIds.push(id)
        }
        else {
            let i = this.hideIds.indexOf(id)
            this.hideIds.splice(i, 1)
        }
        CacheUtil.set(Constant.HERO_HIDE, JSON.stringify(this.hideIds))
        this.postHero()
        return true
    }

    public getIsUnlock(id: number[]) {
        let heros = UserModel.ins().getHeros()
        if (heros && heros.length > 0) {
            for (let i in heros) {
                if (heros[i].sageId == id) {
                    return true
                }
            }
        }
        return false
    }
    /**判断是否已升级*/
    public getIsUpLevel(id: number): boolean {
        // return true //tset
        let heros = UserModel.ins().getHeros()
        if (heros && heros.length > 0) {
            for (let i in heros) {
                if (heros[i].sageId == id && heros[i].level > 0) {
                    return true
                }
            }
        }
        return false
    }
    /*获取已存在的单个贤士数据*/
    public getHeroData(id: number) {
        let heros = UserModel.ins().getHeros()
        if (heros && heros.length > 0) {
            for (let i in heros) {
                if (heros[i].sageId == id) {
                    return heros[i]
                }
            }
        }
        return null
    }
    /**获取显示的角色*/
    public getHeroShowData(): { show0: any[], show1: any[] } {
        let heros = this.getHeroShow()
        if (heros && heros.length > 0) {
            let obj = { show0: [], show1: [] }
            for (let i = 0; i < heros.length; i++) {
                if (i <= 4) {
                    obj.show1.push(heros[i])
                }
                else if (i <= 9) {
                    obj.show0.push(heros[i])
                }
                else {
                    if ((i - 9) & 1) {
                        obj.show1.push(heros[i])
                    }
                    else {
                        obj.show0.push(heros[i])
                    }
                }
            }
            return obj
        }
        else {
            return null
        }
    }
    private getHeroShow() {
        let ids = UserModel.ins().getHeros()
        if (!ids || ids.length == 0) {
            return null
        }
        let ret = []
        for (let item of ids) {
            if (!this.isHide(item.sageId)) {
                // ret.push(item.sage)
                ret.push(this.getCfgById(item.sageId))
            }
        }
        return ret
    }
    /**fun 回调*/
    public getALLCfg(fun) {
        if (this.heroCfg == null) {
            this.getHeroCfg(fun)
        }
        else {
            fun(this.heroCfg)
        }
    }

    public getCfgById(id) {
        for (let item of this.heroCfg) {
            if (item.id == id) {
                return item
            }
        }
        return null
    }

    public async getHeroCfg(fun?) {
        this.heroCfg = []
        let page = 1
        await this.getPage(page)
        let bool = true
        while (!this.isAllGet && bool) {
            page++
            bool = await this.getPage(page)
        }
        if (fun) {
            fun(this.heroCfg)
        }
    }

    public async  getPage(page: number) {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.HERO_PAGE),
            data: {
                current: page,
                size: 20,
            }
        });
        console.log("HERO_PAGE data:", res);
        if (res.code === 0) {
            let data = res.data
            for (let i in data.records) {
                this.heroCfg.push(data.records[i])
            }
            this.pages = data.pages
            if (data.current >= data.pages) {
                this.isAllGet = true
            }
            return true
        }
        else {
            console.error(res)
            return false
        }
    }
    /*勿用*/
    /*public async  getSingle(id: number, fun) {
        if (this.singleCfg && this.singleCfg.is == id) {
            fun(this.singleCfg)
        }
        else {
            let res = await RequestUtil.getPromise({
                url: encodeURI(Main.host + Api.HERO_GET),
                data: {
                    sageId: id,
                }
            });
            console.log("HERO_GET data:", res);
            if (res.code === 0) {
                this.singleCfg = res.data
                fun(this.singleCfg)
            }
        }
    }*/

    /*勿用*/
    /*public async  getIds(ids: number[], fun) {
        if (this.singleCfg) {
            fun(this.singleCfg)
        }
        else if (this.heroCfg) {
            let ret = []
            for (let i in ids) {
                ret.push(this.getCfgById(ids[i]))
            }
            fun(ret)
        }
        else {
            let res = await RequestUtil.postPromise({
                url: encodeURI(Main.host + Api.HERO_LIST),
                data: {
                    sageIdList: ids,
                }
            });
            console.log("HERO_LIST data:", res);
            if (res.code === 0) {
                this.singleCfg = res.data
                fun(this.singleCfg)
            }
        }
    }*/

    public async  hero() {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.HERO),
        });
        console.log("HERO data:", res);
        if (res.code === 0) {
            // this.singleCfg = null
            // this.singleCfg = res.data.person
            if (res.data.award.awardType == 2) {
                UserModel.ins().pushHero(res.data.award.sage)
                this.postHero()
            }
            UserModel.ins().upUserData(res.data.userData)
            return res.data
        }
    }

    public async  heroDaily() {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.HERO_DAILY),
        });
        console.log("HERO_DAILY data:", res);
        if (res.code === 0) {
            this.dailyRecruitCount--
            if (res.data.award.awardType == 2) {
                UserModel.ins().pushHero(res.data.award.sage)
                this.postHero()
            }
            return res.data
        }
        return null
    }

    public async  upLevel(id: number) {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.HERO_UP_LEVEL),
            data: {
                sageId: id
            }
        });
        console.log("HERO_UP_LEVEL data:", res);
        if (res.code === 0) {
            UserModel.ins().upLevelHero(res.data.sageId)
            this.postHero()
        }
    }

    public async  groupAward(type) {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.HERO_GROUP_AWARD),
            data: {
                sageType: type
            }
        });
        console.log("HERO_GROUP_AWARD data:", res);
        if (res.code === 0) {
            if (this.hasAwardHero == null) {
                this.hasAwardHero = []
            }
            this.hasAwardHero.push(type)
        }
    }

    /**获取已领取的奖励组*/
    public getGroupAward() {
        if (this.hasAwardHero) {
            return this.hasAwardHero
        }
        return null
    }
    public async  groupAwardData() {
        if (this.hasAwardHero) {
            return this.hasAwardHero
        }
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.HERO_GROUP_HASAWARD),
        });
        console.log("HERO_GROUP_HASAWARD data:", res);
        if (res.code === 0) {
            if (res.data) {
                this.hasAwardHero = res.data
            }
            else {
                this.hasAwardHero = []
            }
            return this.hasAwardHero
        }
    }

    public postHero() {

    }
    public postDailyRecruit() {

    }
}
MessageCenter.compile(HeroModel);
window["HeroModel"] = HeroModel;
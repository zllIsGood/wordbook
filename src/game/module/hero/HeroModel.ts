/* 招贤纳士模块
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 10:20:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-11 12:22:54
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

    /**是否隐藏*/
    public isHide(id) {
        if (this.hideIds == null) {
            let s = egret.localStorage.getItem(Constant.HERO_HIDE)
            if (s == '') {
                this.hideIds = []
                egret.localStorage.setItem(Constant.HERO_HIDE, JSON.stringify(this.hideIds))
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
        egret.localStorage.setItem(Constant.HERO_HIDE, JSON.stringify(this.hideIds))
        this.postHide()
        return true
    }

    public getIsUnlock(id: number[]) {
        let heros = UserModel.ins().getHeros()
        if (heros && heros.length > 0) {
            for (let i in heros) {
                if (heros[i].sage.id == id) {
                    return true
                }
            }
        }
        return false
    }
    /**获取显示的角色*/
    public getHeroShow() {
        let ids = UserModel.ins().getHeros()
        if (!ids || ids.length == 0) {
            return null
        }
        let ret = []
        for (let item of ids) {
            if (!this.isHide(item.sage.id)) {
                ret.push(item)
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
            }
            UserModel.ins().upUserData(res.data.userData)
            return res.data
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

        }
    }

    /**获取已领取的奖励组*/
    public async  groupAwardDate() {
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

    public postHide() {

    }
}
MessageCenter.compile(HeroModel);
window["HeroModel"] = HeroModel;
/* 房子模块
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 10:20:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-22 15:15:41
 */
class HouseModel extends BaseClass {

    public static ins(): HouseModel {
        return super.ins();
    }

    public constructor() {
        super();

    }

    private houseCfg: any[] = null
    public singleCfg = null
    private pages: number = 0
    private isAllGet = false

    /**fun 回调*/
    public getALLCfg(fun) {
        if (this.houseCfg == null) {
            this.getHouseCfg(fun)
        }
        else {
            fun(this.houseCfg)
        }
    }

    public getCfgById(id) {
        for (let item of this.houseCfg) {
            if (item.id == id) {
                return item
            }
        }
        return null
    }

    public async getHouseCfg(fun?) {
        this.houseCfg = []
        let page = 1
        await this.getPage(page)
        let bool = true
        while (!this.isAllGet && bool) {
            page++
            bool = await this.getPage(page)
        }
        if (fun) {
            fun(this.houseCfg)
        }
    }

    public async  getPage(page: number) {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.HOUSE_PAGE),
            data: {
                current: page,
                size: 20,
            }
        });
        console.log("HOUSE_PAGE data:", res);
        if (res.code === 0) {
            let data = res.data
            for (let i in data.records) {
                this.houseCfg.push(data.records[i])
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

    public async  getSingle(id: number, fun) {
        if (this.singleCfg && this.singleCfg.id == id) {
            fun(this.singleCfg)
        }
        else if (this.isAllGet && this.houseCfg) {
            let ret = this.getCfgById(id)
            fun(ret)
        }
        else {
            let res = await RequestUtil.getPromise({
                url: encodeURI(Main.host + Api.HOUSE_GET),
                data: {
                    houseId: id,
                }
            });
            console.log("HOUSE_GET data:", res);
            if (res.code === 0) {
                this.singleCfg = res.data
                fun(this.singleCfg)
            }
        }
    }

    public async  upLevel() {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.HOUSE_UP),
        });
        console.log("HOUSE_UP data:", res);
        if (res.code === 0) {
            this.singleCfg = res.data.house ? res.data.house : this.singleCfg
            // UserModel.ins().upUserData(res.data.userData)
            Main.userData = res.data.userData
            this.postUpLevel()
        }
    }

    public postUpLevel() {

    }
}
MessageCenter.compile(HouseModel);
window["HouseModel"] = HouseModel;
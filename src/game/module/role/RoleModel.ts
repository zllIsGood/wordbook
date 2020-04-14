/* 主角模块
 * @Author: zhoualnglang 
 * @Date: 2020-04-03 10:20:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-08 18:20:01
 */
class RoleModel extends BaseClass {

    public static ins(): RoleModel {
        return super.ins();
    }

    public constructor() {
        super();

    }

    private roleCfg: any[] = null
    public singleCfg = null
    private pages: number = 0
    private isAllGet = false

    /**fun 回调*/
    public getALLCfg(fun) {
        if (this.roleCfg == null) {
            this.getRoleCfg(fun)
        }
        else {
            fun(this.roleCfg)
        }
    }

    public getCfgById(id) {
        for (let item of this.roleCfg) {
            if (item.id == id) {
                return item
            }
        }
        return null
    }

    public async getRoleCfg(fun?) {
        this.roleCfg = []
        let page = 1
        await this.getPage(page)
        let bool = true
        while (!this.isAllGet && bool) {
            page++
            bool = await this.getPage(page)
        }
        if (fun) {
            fun(this.roleCfg)
        }
    }

    public async  getPage(page: number) {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.PERSION_PAGE),
            data: {
                current: page,
                size: 20,
            }
        });
        console.log("PERSION_PAGE data:", res);
        if (res.code === 0) {
            let data = res.data
            for (let i in data.records) {
                this.roleCfg.push(data.records[i])
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
        else if (this.roleCfg) {
            let ret = this.getCfgById(this.roleCfg)
            fun(ret)
        }
        else {
            let res = await RequestUtil.getPromise({
                url: encodeURI(Main.host + Api.PERSION_GET),
                data: {
                    personId: id,
                }
            });
            console.log("PERSION_GET data:", res);
            if (res.code === 0) {
                this.singleCfg = res.data
                fun(this.singleCfg)
            }
        }
    }

    public async  upLevel() {
        let res = await RequestUtil.getPromise({
            url: encodeURI(Main.host + Api.PERSION_UPPERSION),
        });
        console.log("PERSION_UPPERSION data:", res);
        if (res.code === 0) {
            this.singleCfg = res.data.person
            UserModel.ins().upUserData(res.data.userData)
        }
    }
}
MessageCenter.compile(RoleModel);
window["RoleModel"] = RoleModel;
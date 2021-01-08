/* loading界面
 * @Author: zhoualnglang 
 * @Date: 2020-04-09 12:38:22 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-06-20 14:21:16
 */

class LoadingUI extends BaseEuiView {

    public bg: eui.Image;
    public loadingBar: eui.Rect;
    public loadingStatus: eui.Rect;

    private loadingBanner: any;
    private isLoaded = false

    public constructor() {
        super();
        this.skinName = "LoadingUISkin";
    }

    public open(...param: any[]): void {
        this.observe(UserModel.ins().postUserProto, this.startGame, this)
        // StageUtils.ins().adaptationIpx(this.bg)
        // this.upView()
    }

    /**开始loading*/
    public static start() {
        let view = ViewManager.ins().getView(LoadingUI) as LoadingUI
        if (view) {
            view.upView()
            App.ins().playBannerAd(Ad.loadingBanner)
        }
    }
    /**设置进度*/
    public static setLoadingState(p: number) {
        let view = ViewManager.ins().getView(LoadingUI) as LoadingUI
        if (view) {
            view.setLoadingState(p)
        }
    }

    private async upView() {
        let loading = new MyLoading(this);

        await this.loadCfg()

        let group = []
        let rolecfg: any = await this.getRole()
        // let datastr = StringUtils.deleteChangeLine(rolecfg.data)
        // let ob = JSON.parse(datastr)
        let ob = rolecfg.data
        if (ob.extraParts) {
            group.push(ob.extraParts.img)
        }
        group.push(rolecfg.bodyImg)
        group.push(rolecfg.headImg)
        let house: any = await this.getHouse()
        group.push(house.houseImg)
        group.push(house.bgImg)
        let heros = this.getHeroImg()
        for (let i in heros) {
            group.push(heros[i])
        }

        // console.log(group)
        this.urls = group
        this.remoteNum = group.length

        RES.loadGroup("main", 0, loading)
        // this.loadingBanner = App.ins().playBannerAd(Ad.loadingBanner);

    }

    private urls = []
    private remoteNum = 0
    private preNum = 0
    private currentNum
    public next() {
        this.setLoadingState(this.currentNum / (this.preNum + this.remoteNum) * 0.7 + 0.3)
        this.currentNum++
        let source = this.urls.pop()
        if (source) {
            if (RES.hasRes(source)) {
                let data = RES.getRes(source);
                if (data) {
                    this.next()
                }
                else {
                    RES.getResAsync(source, this.next, this);
                }
            }
            else {
                RES.getResByUrl(source, this.next, this, RES.ResourceItem.TYPE_IMAGE);
            }
        }
        else {
            this.isLoaded = true
            if (!App.ins().getShowUserProto()) {
                Main.startGame()
            }
            else {
                this.startGame()
            }
        }
    }

    private startGame() {
        if (this.isLoaded) {
            let view = ViewManager.ins().isShow(UserProtoWin)
            if (!view) {
                Main.startGame()
            }
        }
    }

    private getHeroImg() {
        let ret = []
        let heroCfgs = HeroModel.ins().getHeroShowData()
        if (!heroCfgs) {
            return ret
        }

        let data0 = heroCfgs.show0
        for (let cfg of data0) {
            let data = cfg
            // let datastr = StringUtils.deleteChangeLine(data.data)
            // let ob = JSON.parse(datastr)
            let isUpLevel = HeroModel.ins().getIsUpLevel(data.id) //是否升级了
            let ob = isUpLevel ? data.data2 : data.data
            if (ob.extraParts) {
                ret.push(ob.extraParts.img)
            }
            ret.push(isUpLevel ? data.bodyImg2 : data.bodyImg)
            ret.push(isUpLevel ? data.headImg2 : data.headImg)
        }
        let data1 = heroCfgs.show1
        for (let cfg of data1) {
            let data = cfg
            // let datastr = StringUtils.deleteChangeLine(data.data)
            // let ob = JSON.parse(datastr)
            let isUpLevel = HeroModel.ins().getIsUpLevel(data.id) //是否升级了
            let ob = isUpLevel ? data.data2 : data.data
            if (ob.extraParts) {
                ret.push(ob.extraParts.img)
            }
            ret.push(isUpLevel ? data.bodyImg2 : data.bodyImg)
            ret.push(isUpLevel ? data.headImg2 : data.headImg)
        }
        return ret
    }

    private async getRole() {
        return new Promise((resolve, reject) => {
            RoleModel.ins().getSingle(UserModel.ins().getRoleId(), (data) => {
                resolve(data)
            })
        })
    }

    private async getHouse() {
        return new Promise((resolve, reject) => {
            HouseModel.ins().getSingle(UserModel.ins().getHouseId(), (data) => {
                let str = data.data as string
                str = StringUtils.deleteChangeLine(str)
                let obj = JSON.parse(str)
                resolve(obj)
            })
        })
    }

    public close(...param: any[]): void {
        App.ins().destoryBanner()
        this.isLoaded = false
    }

    public onProgress(current: number, total: number, isLast?: boolean) {

        this.setLoadingState(current / (total + this.remoteNum) * 0.7 + 0.3)
        if (current >= total) {
            console.log('加载完')
            this.preNum = total
            this.currentNum = total
            // 最后一个加载完
            // this.startGame()
            this.next()
        }
    }

    public async loadCfg() {
        let data = await RES.getResByUrl(Main.res_url + '?' + Math.random(), null, null, RES.ResourceItem.TYPE_JSON) //确保不受缓存的影响
        this.setLoadingState(0.2)
        let hero = await RES.getResByUrl(data.heroUrl, null, null, RES.ResourceItem.TYPE_JSON)
        HeroModel.ins().setCfg(hero)
        this.setLoadingState(0.25)
        let person = await RES.getResByUrl(data.personUrl, null, null, RES.ResourceItem.TYPE_JSON)
        RoleModel.ins().setCfg(person)
        this.setLoadingState(0.3)
    }

    public setLoadingState(p: number) {
        this.loadingStatus.width = p * (this.loadingBar.width - 6);
    }

    protected onComplete(): void {

    }

}
ViewManager.ins().reg(LoadingUI, LayerManager.UI_LOADING);
window["LoadingUI"] = LoadingUI;
/* 用户模块
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 16:24:25 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-06 20:01:46
 */
class UserModel extends BaseClass {

    public static ins(): UserModel {
        return super.ins();
    }

    public constructor() {
        super();

    }

    private _musicOpen: boolean = null;
    public get musicOpen() {
        if (this._musicOpen == null) {
            let s = CacheUtil.get(Constant.MUSIC_OPEN)
            if (s == '0') {
                this._musicOpen = false
            }
            else {
                this._musicOpen = true
            }
        }
        return this._musicOpen
    }
    public set musicOpen(b: boolean) {
        this._musicOpen = b
        let n = b ? '1' : '0'
        CacheUtil.set(Constant.MUSIC_OPEN, n)
        if (b) {
            SoundManager.ins().playBg(/*'bgm_mp3'*/)
        }
        else {
            SoundManager.ins().stopBg()
        }
    }

    public login() {
        WxService.login()
    }

    public async getData() {
        let res = await RequestUtil.getPromise({ url: encodeURI(Main.host + Api.USER_GET_USER_DATA) });
        console.log("USER_GET_USER_DATA data:", res);
        if (res.code === 0) {

        }
    }

    /**确保只刷新1次*/
    private isRefreshing = false
    public async refreshEnergy() {
        if (this.isRefreshing) {
            return
        }
        this.isRefreshing = true
        await TimerManager.ins().deleyPromisse(1000)
        let res = await RequestUtil.postPromise({ url: encodeURI(Main.host + Api.USER_REFRESH) });
        console.log("USER_REFRESH data:", res);
        if (res.code === 0) {
            this.upUserData(res.data)
            this.setRefreshTimer()
        }
        this.isRefreshing = false
    }

    /**定时刷新体力*/
    public setRefreshTimer() {
        let time = this.getEnergyRefresh()
        if (time > 0) {
            TimerManager.ins().doTimer(time * 1000, 1, () => {
                this.refreshEnergy()
            }, this)
        }
        else {
            this.refreshEnergy()
        }
    }

    /**获取剩余体力值*/
    public getEnergy(): number {
        return Main.userData.energy
    }
    /**是否体力已满*/
    public isMaxEnergy(): boolean {
        let cur = this.getEnergy()
        if (cur >= Main.energyConfig.maxEnergy) {
            return true
        }
        return false
    }
    /**体力倒计时-->秒*/
    public getEnergyRefresh(): number {
        if (!Main.userData.refreshTime) {
            return 0
        }
        let refreshTime = Main.userData.refreshTime ? Main.userData.refreshTime : DateUtil.getUnixtime();
        let interval = Main.energyConfig.refreshInterval ? Main.energyConfig.refreshInterval : 1200;
        let lastTimestamp = refreshTime * 1000;
        let endTimestamp = lastTimestamp + interval * 1000;
        let restSeconds = Math.ceil((endTimestamp - Date.now()) / 1000);
        restSeconds = restSeconds > 0 ? restSeconds : 0;
        // console.log('体力倒计时-->秒:' + restSeconds)
        return restSeconds
    }
    /**全部体力倒计时-->秒*/
    public getMaxCdRefresh() {
        let max = Main.energyConfig.maxEnergy
        let interval = Main.energyConfig.refreshInterval ? Main.energyConfig.refreshInterval : 1200
        let allCd = this.getEnergyRefresh() + (max - 1) * interval
        return allCd
    }

    /**获取房子id*/
    public getHouseId(): number {
        return Main.userData.houseId
    }

    /**获取主角id*/
    public getRoleId(): number {
        return Main.userData.personId
    }

    /**贤士*/
    public getHeros() {
        return Main.sageList
    }

    /**贤士*/
    public pushHero(data) {
        if (!Main.sageList) {
            Main.sageList = []
        }
        for (let item of Main.sageList) {
            if (item.sageId == data.id) { //重复加1
                item.count = item.count == null ? (0 + 1) : (item.count + 1)
                return
            }
        }
        Main.sageList.push({ sageId: data.id, sage: data, count: 0, level: 0 })
    }
    /**贤士升级*/
    public upLevelHero(id: number) {
        if (!Main.sageList) {
            return
        }
        for (let item of Main.sageList) {
            if (item.sageId == id) {
                item.count = 0
                item.level = 1
                return
            }
        }
    }

    /**当前关数*/
    public getStageNum() {
        return Main.userData.stageNum
    }

    /**完成关数*/
    public getStageFinNum() {
        return Main.userData.stageNum
    }

    /**是否开启了1关但没完成*/
    public isStartStage() {
        return Main.userData.stageNum == (Main.userData.stageFinNum + 1)
    }

    /**刷新数据*/
    public upUserData(data) {
        Main.userData = data
        this.postData()
    }

    /**刷新数据*/
    public upHeroData(data) {
        Main.sageList = data
        this.postData()
    }

    public postVideoStart() {

    }
    public postVideoStop() {

    }
    public postVideoShare() {

    }

    /**派发消息*/
    public postData() {

    }

    postUserProto() {

    }
}
MessageCenter.compile(UserModel);
window["UserModel"] = UserModel
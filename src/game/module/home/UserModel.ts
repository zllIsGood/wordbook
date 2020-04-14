/* 用户模块
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 16:24:25 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-11 16:57:55
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
            let s = egret.localStorage.getItem(Constant.MUSIC_OPEN)
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
        egret.localStorage.setItem(Constant.MUSIC_OPEN, n)
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

    public async refreshEnergy() {
        let res = await RequestUtil.postPromise({ url: encodeURI(Main.host + Api.USER_REFRESH) });
        console.log("USER_REFRESH data:", res);
        if (res.code === 0) {
            this.upUserData(res.data)
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
        let restSeconds = Math.round((endTimestamp - Date.now()) / 1000);
        restSeconds = restSeconds > 0 ? restSeconds : 0;
        // console.log('体力倒计时-->秒:' + restSeconds)
        return restSeconds
    }


    /**获取房子id*/
    public getHouseId(): number {
        return Main.userData.houseId
    }

    /**获取主角id*/
    public getRoleId(): number {
        return Main.userData.personId
    }

    /**配角*/
    public getHeros(): any[] {
        return Main.sageList
    }

    /**配角*/
    public pushHero(data) {
        if (!Main.sageList) {
            Main.sageList = []
        }
        Main.sageList.push({ sageId: data.id, sage: data })
    }

    public getStageNum() {
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

    /**派发消息*/
    public postData() {

    }
}
MessageCenter.compile(UserModel);
window["UserModel"] = UserModel
/*
 * @Author: zhoualnglang 
 * @Date: 2020-04-21 11:20:05 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-12 12:01:51
 */
class App extends BaseClass {
    public static ins(): App {
        return super.ins();
    }

    public constructor() {
        super();

    }

    public getResRoot() {
        if (Main.gamePlatform == Main.platformTT) {

        }
        else if (Main.gamePlatform == Main.platformApp) {

        }
        else if (Main.gamePlatform == Main.platformIOS) {

        }
        else if (Main.gamePlatform == Main.platformH5) {
            if (window['res_root']) {
                return window['res_root'] + 'resource/'
            }
        }
        return 'resource/'
    }

    private _deviceId: string = null // '12ff03950a2150c4'
    public get deviceId() {
        // console.log('getdeviceId:', this._deviceId)
        return this._deviceId
    }
    public set deviceId(_deviceId) {
        this._deviceId = _deviceId
    }

    public async initDeviceId() {
        return new Promise((resolve, reject) => {
            if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) {
                Openadsdk.GetDevice((json) => {
                    console.log("GetDevice:" + json)
                    this.deviceId = '' + json
                    resolve()
                }, this, '')
            }
            else if (Main.gamePlatform == Main.platformH5) {
                let uid = ''
                if (location && location.search) {
                    let str = location.search.substring(1)
                    let parms = str.split('&')
                    for (let i in parms) {
                        let arr = parms[i].split('=')
                        if (arr[0] == 'uuid') {
                            uid = arr[1]
                        }
                    }
                }
                this.deviceId = uid
                resolve()
            }
            else {
                resolve()
            }
        })
    }

    public async login() {
        if (Main.gamePlatform == Main.platformTT) {
            await WxService.login()
        }
        else if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) {
            await wx.login()
        }
        else if (Main.gamePlatform == Main.platformH5) {
            await wx.login()
        }
    }

    /**观看视频广告来回调*/
    public watchAdCall(awardType: number, fun: Function) {
        if (Main.gamePlatform == Main.platformTT) {
            AdService.watchAdTip(awardType, fun)
        }
        else if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) {
            AndroidAd.Reward(awardType, fun)
        }
        else if (Main.gamePlatform == Main.platformH5) {
            ScoreService.Reward(awardType, fun)
        }
    }

    public playRewardVideoAd(awardType?) {
        if (Main.gamePlatform == Main.platformTT) {
            AdService.watchAd(awardType)
        }
        else if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) {
            AndroidAd.Reward(awardType)
        }
        else if (Main.gamePlatform == Main.platformH5) {
            ScoreService.Reward(awardType)
        }
    }

    public playBannerAd(ad?: string) {
        if (Main.gamePlatform == Main.platformTT) {
            return AdService.createBannerAd(ad)
        }
        else if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) {
            AndroidAd.Banner()
            return null
        }
    }

    public destoryBanner() {
        if (Main.gamePlatform == Main.platformTT) {
            AdService.destoryBanner()
        }
        else if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) {
            AndroidAd.CloseBannerAd()
        }
    }

    public isShowShareBtn() {
        if (Main.gamePlatform == Main.platformTT) {
            let stopTime = new Date().getTime();
            if (stopTime - Main.recordStartTime > Main.recordTime) {
                return true
            }
        }
        return false
    }

    private hasPlaySplash = false
    /**开屏广告 限安卓*/
    public splash() {
        if ((Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) && this.isOpenAd()) {
            if (!this.hasPlaySplash) {
                AndroidAd.Splash()
                this.hasPlaySplash = true
            }
        }
    }

    public async  reqAd() {
        return new Promise((resolve, reject) => {
            if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformTT) {
                let obj = {
                    url: encodeURI(Main.host + Api.AD_CONFIG),
                    header: {
                        zmgGameId: Main.adId,
                        zmgPlatform: Main.gamePlatform,
                        zmgVersion: Main.version
                    },
                    data: {
                    },
                    method: 'GET',
                    success: (res) => {
                        console.log("request success!", res);
                        if (res.data.data) {
                            let bool = res.data.data.showAd
                            App.ins().setOpenAd(bool)
                            App.ins().setAdConfig(res.data.data.configList)
                        }
                        resolve()
                    },
                    fail: (res) => {
                        console.log("request fail!", res);
                        resolve()
                    }
                }
                wx.request(obj)
            }
            else {
                resolve()
            }
        })
    }
    // AdPos 0开屏广告 1banner 2激励视频
    // AdType 0自家  1穿山甲   2广点通
    adConfig = { splash: [], banner: [], video: [] }
    public setAdConfig(cfgs) {
        this.adConfig = { splash: [], banner: [], video: [] }
        for (let i in cfgs) {
            let cfg = cfgs[i]
            if (cfg.weight <= 0) {
                continue;
            }
            if (cfg.adPos == 0) {
                this.adConfig.splash.push(cfg)
            }
            else if (cfg.adPos == 1) {
                this.adConfig.banner.push(cfg)
            }
            else if (cfg.adPos == 2) {
                this.adConfig.video.push(cfg)
            }
        }
        let obj = { version: Main.version, isOpenAd: this._openAd, adConfig: this.adConfig }
        CacheUtil.set(Constant.AD_CFG, JSON.stringify(obj))
    }
    /**0开屏广告 1banner 2激励视频*/
    public getAd(adPos: number) {
        let obj = { type: 1, url: '', img: '', text: '' }
        let arr
        if (adPos == 0) {
            arr = this.adConfig.splash
        }
        else if (adPos == 1) {
            arr = this.adConfig.banner
        }
        else if (adPos == 2) {
            arr = this.adConfig.video
        }
        let wvs = []
        let weight = 0
        for (let i in arr) {
            weight = weight + arr[i].weight
            wvs.push(weight)
        }
        let ran = Math.random() * wvs[wvs.length - 1]
        let windex = 0
        for (let j = 0; j < wvs.length; j++) {
            if (ran <= wvs[j]) {
                windex = j
                break
            }
        }
        let cfg = arr[windex]
        obj.type = cfg.adType
        if (obj.type == 0) {
            let urls = JSON.parse(cfg.url)
            obj.url = urls.url ? urls.url : ''
            obj.img = urls.img ? urls.img : ''
            obj.text = urls.text ? urls.text : ''
        }
        return obj
    }

    // public setOpenAdConfig(cfg) {
    //     if (cfg == null) {
    //         return
    //     }
    //     this.adTypeCfg.screen = cfg.screen.csj / (cfg.screen.csj + cfg.screen.gdt)
    //     this.adTypeCfg.banner = cfg.banner.csj / (cfg.banner.csj + cfg.banner.gdt)
    //     this.adTypeCfg.video = cfg.video.csj / (cfg.video.csj + cfg.video.gdt)
    // }
    // private adTypeCfg = { screen: 0.7, banner: 0.7, video: 0.7 }
    // /**0穿山甲  1广点通*/
    // public getAdType(type: number) {
    //     let ran = Math.random()
    //     if (type == 1) {
    //         return (ran < this.adTypeCfg.screen ? 0 : 1)
    //     }
    //     else if (type == 2) {
    //         return (ran < this.adTypeCfg.banner ? 0 : 1)
    //     }
    //     else if (type == 3) {
    //         return (ran < this.adTypeCfg.video ? 0 : 1)
    //     }
    // }
    private _openAd = false
    public setOpenAd(bool) {
        this._openAd = bool ? true : false
    }
    /**广告是否开启 过审时会关闭*/
    public isOpenAd() {
        return this._openAd
    }
    /**是否需要隐藏广告图标*/
    public hideAdIcon() {
        return (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) && !this.isOpenAd()
    }
    /**播放开屏*/
    public playOpenAd() {
        let s = CacheUtil.get(Constant.AD_CFG)
        if (!s || s == '') {

        }
        else {
            let obj = JSON.parse(s)
            if (obj.version == Main.version) {
                this._openAd = obj.isOpenAd
                this.adConfig = obj.adConfig ? obj.adConfig : this.adConfig
                this.splash()
            }
        }
    }

    /**获取是否显示用户协议界面*/
    public getShowUserProto() {
        if (Main.gamePlatform == Main.platformApp || Main.gamePlatform == Main.platformIOS) {
            let s = CacheUtil.get(Constant.USER_PROTO)
            if (s != '1') {
                return true
            }
        }
        return false
    }
    public setShowUserProto(bool: boolean) {
        let s = bool ? '1' : '0'
        CacheUtil.set(Constant.USER_PROTO, s)
    }

    /**false为积分 true未广告*/
    public adNotScore() {
        if (Main.gamePlatform == Main.platformH5) {
            return false
        }
        return true
    }
}
window["App"] = App;
const sdk = {
    RewardVideoAd: "TTRewardVideoAd",
    SplashAd: "TTSplashAd",
    FullScreenVideoAd: "TTFullScreenVideoAd",
    BannerExpressAd: "TTBannerExpressAd",
    InteractionAd: "TTInteractionAd",
}
class Openadsdk {
    public static RewardVideoAd(callBack: Function, callObj: any, json: string) {
        Openadsdk.addCallBack(sdk.RewardVideoAd, callBack, callObj, json);
    }
    public static SplashAd(callBack: Function, callObj: any, json: string) {
        Openadsdk.addCallBack(sdk.SplashAd, callBack, callObj, json);
    }
    public static FullScreenVideoAd(callBack: Function, callObj: any, json: string) {
        Openadsdk.addCallBack(sdk.FullScreenVideoAd, callBack, callObj, json);
    }
    public static BannerExpressAd(callBack: Function, callObj: any, json: string) {
        Openadsdk.addCallBack(sdk.BannerExpressAd, callBack, callObj, json);
    }
    public static InteractionAd(callBack: Function, callObj: any, json: string) {
        Openadsdk.addCallBack(sdk.InteractionAd, callBack, callObj, json);
    }
    public static GetDevice(callBack: Function, callObj: any, json: string) {
        // Openadsdk.addCallBack('getDeviceCode', callBack, callObj, json);
        egret.ExternalInterface.addCallback('setDeviceCode', function (message: string) {
            if (callBack && callObj) {
                callBack.apply(callObj, [message]);
            }
        });
        egret.ExternalInterface.call('getDeviceCode', json);
    }
    public static CloseBannerAd(callBack: Function = null, callObj: any = null, json: string = '') {
        Openadsdk.addCallBack('closeAd', callBack, callObj, json);
    }
    public static OpenURL(callBack: Function = null, callObj: any = null, json: string = '') {
        Openadsdk.addCallBack('OpenURL', callBack, callObj, json);
    }

    public static addCallBack(type: string, callBack: Function, callObj: any, json: string) {
        egret.ExternalInterface.addCallback(type + "-js", function (message: string) {
            if (callBack && callObj) {
                callBack.apply(callObj, [message]);
            }
        });
        egret.ExternalInterface.call(type, json);
    }
}
window["Openadsdk"] = Openadsdk;
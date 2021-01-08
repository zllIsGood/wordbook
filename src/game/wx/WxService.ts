/**
 * 微信业务
 * @author kei
 * @since 2019-02-27
 */
class WxService {

    public static async login(): Promise<boolean> {
        let res = await wxapi.login().catch(err => console.error(err));
        if (res) {
            return RequestUtil.postPromise({
                url: encodeURI(Main.host + Api.USER_LOGIN),
                data: {
                    code: res.code,
                    anonymousCode: res.anonymousCode,
                }
            }).then(res => {
                if (res.code === 0 && StringUtil.isNotBlank(res.data.token)) {
                    let loginRes = res.data;
                    Main.isLogin = true;
                    Main.userData = loginRes.gameData.userData;
                    Main.sageList = loginRes.gameData.sageList;
                    Main.energyConfig = loginRes.gameData.energyConfig;
                    App.ins().setOpenAd(!loginRes.gameData.isReview)
                    HouseModel.ins().singleCfg = loginRes.gameData.house
                    RoleModel.ins().singleCfg = loginRes.gameData.person
                    LoginUtil.setToken(loginRes.token);
                    LoginUtil.setUserId(loginRes.userId);
                    return true;
                } else {
                    console.error("登录请求失败!", res);
                    wx.showToast({ icon: 'none', title: "登录失败请重试" });
                    return false;
                }
            }).catch(err => {
                console.error("登录请求失败2！", err);
                wx.showToast({ icon: 'none', title: "登录失败请重试" });
                return false;
            })
        }
        return false;
    }

    /**
     * 请求刷新体力
     */
    public static refreshUserData(): void {
        let self = this;
        RequestUtil.post({
            url: encodeURI(Main.host + Api.USER_REFRESH),
            success(res) {
                console.log("refresh user data!", res);
                if (res.code === 0) {
                    // Main.userData = res.data;
                    // let energy = res.data.energy;
                    // let refreshTime = res.data.refreshTime;
                    // if (SceneManager.currentScene()) {
                    //     SceneManager.currentScene().updateEnergy(energy, refreshTime);
                    // }
                } else {
                    console.error("refresh energy error!", res);
                }
            }
        });
    }

}
window["WxService"] = WxService;
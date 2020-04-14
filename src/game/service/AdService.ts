/**
 * 奖励工具类
 * @auth kei
 * @date 2020-03-03
 */
class AdService {

    /**
     * 记录当前奖励类型
     */
    private static awardType: number;


    /**
     * 初始化视频广告
     */
    public static initVideoAd() {
        // 初始化video广告
        try {
            if (!wx.createRewardedVideoAd) {
                return
            }
            Main.videoAd = wx.createRewardedVideoAd({ adUnitId: Ad.video });
            Main.videoAd.onClose(res => {
                console.log("视频广告看完了！", res);
                if (!res.isEnded) {
                    console.log("广告没看完！");
                    return;
                }
                if (this.awardType === AwardType.LOGIN_AWARD) {
                    // 登录奖励，观看视频翻倍
                    this.loginAward(true);
                } else if (this.awardType === AwardType.WATCH_AD_AWARD) {
                    // 观看广告奖励
                    this.watchAdAward();
                } else if (this.awardType == AwardType.UNLOCK_COLOR) {
                    // 解锁颜色
                    // StageService.unlockColor(Main.drawStage);
                }
            });
        } catch (error) {
            console.log("init video ad error:", error);
        }
    }

    public static createBannerAd(bannerId): any {
        // 初始化banner广告
        try {
            let bannerWidth = 200;
            let bannerHeight = bannerWidth / 16 * 9;
            let windowWidth = Main.systemInfo.windowWidth;
            let windowHeight = Main.systemInfo.windowHeight;
            let bannerAd = wx.createBannerAd({
                adUnitId: bannerId,
                adIntervals: 30,
                style: {
                    left: (windowWidth - bannerWidth) / 2,
                    top: windowHeight - bannerHeight,
                    width: bannerWidth
                }
            });
            bannerAd.onResize(size => {
                bannerAd.style.left = (windowWidth - size.width) / 2;
                bannerAd.style.top = windowHeight - size.height;
            });
            bannerAd.onLoad(function () {
                bannerAd.show();
            });
            return bannerAd;
        } catch (error) {
            console.log("init banner ad error:", error);
        }
    }


    /**
     * 观看视频广告
     */
    public static watchAd(awardType: number) {
        if (awardType) {
            this.awardType = awardType;
        }
        if (Main.videoAd) {
            Main.videoAd.show().catch(err => {
                console.log("广告组件出现问题", err);
                // 可以手动加载一次
                Main.videoAd.load().then(() => {
                    console.log("手动加载成功");
                    // 加载成功后需要再显示广告
                    return Main.videoAd.show();
                });
            });
        }
    }

    public static watchAdAward() {
        wx.showLoading({ title: '加载中...', mask: true });
        RequestUtil.post({
            url: encodeURI(Main.host + Api.USER_WATCH_AD),
            success(res) {
                wx.hideLoading();
                if (res.code === 0) {
                    console.log("观看广告增加体力成功！", res);
                    let oldEnergy = Main.userData.energy;
                    Main.userData = res.data;
                    let add = Main.userData.energy - oldEnergy;
                    if (add > 0) {
                        wx.showToast({ icon: 'none', title: `成功获取${add}点体力` });
                    }
                    UserModel.ins().postData()
                }
            },
            fail(err) {
                console.log("观看广告增加体力失败！", err);
                wx.hideLoading();
            }
        });
    }

    public static shareVideoAward() {
        wx.showLoading({ title: '加载中...', mask: true });
        RequestUtil.post({
            url: encodeURI(Main.host + Api.USER_SHARE_VIDEO),
            success(res) {
                wx.hideLoading();
                if (res.code === 0) {
                    console.log("分享视频增加体力成功！", res);
                    let oldEnergy = Main.userData.energy;
                    Main.userData = res.data;
                    let add = Main.userData.energy - oldEnergy;
                    if (add > 0) {
                        wx.showToast({ icon: 'none', title: `成功获取${add}点体力` });
                    }
                    UserModel.ins().postData()
                }
                else {
                    console.log("分享次数不足！", res)
                }
            },
            fail(err) {
                console.log("分享视频增加体力失败！", err);
                wx.hideLoading();
            }
        });
    }

    public static shareProgramAward() {
        wx.showLoading({ title: '加载中...', mask: true });
        RequestUtil.post({
            url: encodeURI(Main.host + Api.USER_SHARE_PROGRAM),
            success(res) {
                wx.hideLoading();
                if (res.code === 0) {
                    console.log("分享增加体力成功！", res);
                    let oldEnergy = Main.userData.energy;
                    Main.userData = res.data.userData;
                    let add = Main.userData.energy - oldEnergy;
                    if (add > 0) {
                        wx.showToast({ icon: 'none', title: `成功获取${add}点体力` });
                    }
                    UserModel.ins().postData()
                }
                else {
                    console.log("分享次数不足！", res)
                }
            },
            fail(err) {
                console.log("分享增加体力失败！", err);
                wx.hideLoading();
            }
        });
    }

    public static loginAward(isDouble: boolean) {
        wx.showLoading({ title: '加载中...', mask: true });
        RequestUtil.post({
            url: encodeURI(Main.host + Api.USER_LOGIN_AWARD),
            data: { isDouble: isDouble },
            success(res) {
                wx.hideLoading();
                CacheUtil.set(Constant.LOGIN_AWARD, DateUtil.getDayStart() + "");
                if (res.code === 0) {
                    console.log("登录领取体力成功！", res);
                    let oldEnergy = Main.userData.energy;
                    Main.userData = res.data;
                    let add = Main.userData.energy - oldEnergy;
                    if (add > 0) {
                        wx.showToast({ icon: 'none', title: `成功获取${add}点体力` });
                    }
                    UserModel.ins().postData()
                } else {
                    wx.showToast({ icon: 'none', title: '已经领取过该奖励了' });
                }
            },
            fail(err) {
                console.log("登录领取增加体力失败！", err);
                wx.hideLoading();
            }
        });
    }

}
window["AdService"] = AdService;
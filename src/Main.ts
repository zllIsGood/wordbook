/**
 * 入口Main文件
 */

class Main extends eui.UILayer {
	public static isLogin: boolean = false;
	public static isDebug: boolean = false;
	public static host: string = "https://zmg.zmfamily.cn";
	// public static host: string = "http://192.168.0.63:9900";
	public static ossUrl: string = "https://cdnzmg.zmfamily.cn/";

	// 平台相关配置
	public static version: string = "10500";
	public static platformWX: string = "1";
	public static platformQQ: string = "2";
	public static platformTT: string = "3";
	public static gamePlatform: string = Main.platformTT;
	// 关卡配置
	// public static gameStageList: Array<GameStage> = new Array;
	// public static gameStageMap: Map<string, GameStage> = new Map;
	public static userData: any; // 用户数据，例如体力，解锁关卡数，解锁画笔数  
	public static sageList: any[]; // 招贤
	// public static drawStage: GameStage; // 选择的关卡
	// 程序参数
	public static reqTimeout = 10000;
	public static menu: any;
	public static width: number;
	public static height: number;
	public static systemInfo: any;
	public static pixelRatio: number;
	public static scaleRatio: number;
	public static statusBarHeight: number;
	public static platform: string;
	// 体力值相关配置项
	public static energyConfig: any;
	// 公共事件巴士；
	// public static customEventBus: CustomEventBus = new CustomEventBus();
	// 公共分享配置
	public static shareConfig: any = {
		common: {
			imageUrl: "https://zm-draw.oss-cn-shenzhen.aliyuncs.com/config/bee/bee.png",
			title: "我发现了一款好玩的绘画游戏，还能自己制作动画学习英语，赶紧来玩吧！"
		},
		works: {
			imageUrl: "https://zm-draw.oss-cn-shenzhen.aliyuncs.com/config/{name}/{name}.png",
			title: "快来看看我绘制的动画作品"
		},
	};

	// 头条相关配置
	// 分享配置
	public static ttShareId: string = "17i7lf08lh9d12uuke";
	public static ttShareDrawId: string = "1m43c92p7jkf4fw6ik";
	// 录屏配置
	public static recorder: any;
	public static recording: boolean = false;
	public static recordStartTime: number = 0;
	// 广告配置
	public static videoAd: any;
	/**bgm*/
	public static bgm = 'http://zm-data-wx.oss-cn-shenzhen.aliyuncs.com/cw/source/%E9%9F%B3%E4%B9%90/bgm.mp3'


	protected createChildren(): void {
		super.createChildren();

		egret.Logger.logLevel = egret.Logger.ALL;
		// 设置跨域访问资源
		egret.ImageLoader.crossOrigin = "anonymous";

		// 注入自定义的素材解析器
		this.stage.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
		this.stage.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

		RES.setMaxLoadingThread(4);
		//适配方式
		StageUtils.ins().resetMode()

		this.runGame().catch(e => {
			console.log(e);
		})
	}

	private onGetComplete(e: egret.Event) {
		console.log(e);
	}

	private async runGame() {
		await WxService.login(); //登录

		// 注册器
		this.mainRegister();
		await this.loadResource();

		TimerManager.ins();

		SceneManager.ins().runScene(MainScene);

		// 初始化分享
		this.initShare();
		// StageUtils.ins().initBgm()
		SoundManager.ins().playBg(/*"bgm_mp3"*/)
	}

	private async loadResource() {
		try {
			await RES.loadConfig("resource/default.res.json", "resource/");
			await this.loadTheme();
			await this.loadConfig();
		}
		catch (e) {
			console.error(e);
		}
	}

	private loadConfig() {
		return new Promise((resolve, reject) => {
			RES.getResAsync('config_json', (data) => {
				GlobalConfig.init(data)
				resolve()
			}, this)
		})
	}

	private loadTheme() {
		return new Promise((resolve, reject) => {
			//加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
			let theme = new eui.Theme("resource/default.thm.json", this.stage);
			theme.addEventListener(eui.UIEvent.COMPLETE, () => {
				resolve();
			}, this);

		})
	}

	/**
     * 初始化分享配置
     */
	private initShare() {
		wx.showShareMenu({
			withShareTicket: false
		});
		if (Main.gamePlatform === Main.platformTT) {
			wx.onShareAppMessage(() => {
				return { templateId: Main.ttShareId };
			});
		} else {
			wx.onShareAppMessage(() => {
				return Main.shareConfig.common;
			});
		}
	}

    /**
     * 全局初始注册
     */
	private mainRegister() {
		wx.onMemoryWarning(function () {
			// todo: 提交日志
			console.error("onMemoryWarning");
		});
		// 初始化视频广告
		AdService.initVideoAd();
		// 初始化录屏
		try {
			Main.recorder = wx.getGameRecorderManager();
		} catch (error) {
			console.error("init recorder error:", error);
		}

		// 程序切到前台的回调操作
		/*egret.lifecycle.addLifecycleListener((context) => {
			wx.onShow(options => {
				if (options.scene === 1007 && SceneManager.manager) {
					// 通过点击好友分享进入的，帮助好友增加爱心
					if (options.query.helpUserId) {
						SceneManager.backHome();
						// todo 好友助力
						// RequestUtil.get(
						//     { url: Main.host + Api.FH_HELP + "?helpUserId=" + options.query.helpUserId }
						// );
					}
					// 通过点击好友分享的作品进入的，进入对应的作品页
					if (options.query.drawId) {
						SceneManager.changeScene(new ShareScene(options.query.drawId));
					}
				}
			})
		});*/
		egret.lifecycle.onPause = () => {
			egret.ticker.pause();
			SoundManager.ins().setEffectOn(false)
		}
		egret.lifecycle.onResume = () => {
			egret.ticker.resume();
			SoundManager.ins().setEffectOn(true)
		}
	}

	public static async startGame() {
		// 登录
		if (!Main.isLogin) {
			Main.isLogin = await WxService.login();
			if (!Main.isLogin) {
				return;
			}
		}
		// 隐藏广告
		// if (this.loadingBanner) {
		//     this.loadingBanner.hide();
		// }

		// 判断是否分享进来的
		let launchObj = wx.getLaunchOptionsSync();
		console.log("launchObj:", JSON.stringify(launchObj));
		let share: boolean = launchObj.query.share;
		let shareVideo: boolean = launchObj.query.shareVideo;

		let dayStart = DateUtil.getDayStart();
		let awardTime = await CacheUtil.get(Constant.LOGIN_AWARD);
		if (awardTime && awardTime === dayStart + "") {
			console.log("登录奖励已经领取过了！");
		} else {
			ViewManager.ins().open(LoginAwardWin)
		}
		ViewManager.ins().open(HomeWin)
		ViewManager.ins().open(NavigationWin)
		// ViewManager.ins().close(LoadingUI)
	}
}
window["Main"] = Main
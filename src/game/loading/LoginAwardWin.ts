/* 登录奖励
 * @Author: zhoualnglang 
 * @Date: 2020-04-09 12:38:12 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-30 12:30:49
 */

class LoginAwardWin extends BaseEuiView {

	public doubleAward: BaseBtn;
	public award: eui.Image// BaseBtn;
	public closeBtn: BaseBtn;
	private count: eui.Label

	private defScale: number = 1.2;
	private btnScale: number = this.defScale;

	public constructor() {
		super();
		this.skinName = "LoginAwardSkin";
	}

	public open(...param: any[]): void {
		this.addTouchEndEvent(this.award, this.onClick)
		this.addTouchEndEvent(this.doubleAward, this.onClick)
		this.addTouchEndEvent(this.closeBtn, this.onClick)
		this.upView()
		App.ins().playBannerAd(Ad.dialogBanner)
	}

	private upView() {
		let cfg = Main.energyConfig
		this.count.text = cfg.loginAward

		this.doubleAward.visible = !App.ins().hideAdIcon()
		if (App.ins().adNotScore()) {
			this.doubleAward.icon = 'energy_dialog_watch_02_png'
			this.award.visible = true

			egret.Tween.removeTweens(this.doubleAward)
			this.doubleAward.scaleX = 1
			this.doubleAward.scaleY = 1
			let tw = egret.Tween.get(this.doubleAward, { loop: true })
			tw.to({ scaleX: 1, scaleY: 1 }, 500)
				.to({ scaleX: 0.92, scaleY: 0.92 }, 500)
				.to({ scaleX: 1, scaleY: 1 }, 500)
		}
		else {
			this.doubleAward.icon = 'energy_score_get_png'
			this.award.visible = false
		}

	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.doubleAward:
				if (App.ins().adNotScore()) {
					// 双倍奖励
					App.ins().playRewardVideoAd(AwardType.LOGIN_AWARD);
				}
				else {
					// 直接奖励
					AdService.loginAward(false);
				}
				ViewManager.ins().close(this)
				break;
			case this.award:
				// 直接奖励
				AdService.loginAward(false);
				ViewManager.ins().close(this)
				break;
			case this.closeBtn:
				ViewManager.ins().close(this)
				break;

		}
	}

	public close(...param: any[]): void {
		App.ins().destoryBanner()
		egret.Tween.removeTweens(this.doubleAward)
	}

	// public timer(): void {
	// 	// super.timer();
	// 	egret.Tween.get(this.doubleAward)
	// 		.to({ scaleX: this.btnScale, scaleY: this.btnScale }, 500, egret.Ease.sineIn)
	// 		.call(() => {
	// 			if (this.btnScale > 1) {
	// 				this.btnScale = 1;
	// 			} else {
	// 				this.btnScale = this.defScale;
	// 			}
	// 		}, this);
	// }

}
ViewManager.ins().reg(LoginAwardWin, LayerManager.UI_Popup);
window["LoginAwardWin"] = LoginAwardWin;
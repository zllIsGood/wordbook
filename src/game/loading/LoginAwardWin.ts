/* 登录奖励
 * @Author: zhoualnglang 
 * @Date: 2020-04-09 12:38:12 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-09 14:00:22
 */

class LoginAwardWin extends BaseEuiView {

	public doubleAward: BaseBtn;
	public award: BaseBtn;
	public closeBtn: BaseBtn;
	private title: eui.Label

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
	}

	private upView() {
		this.title.text = '登录奖励'
	}

	private onClick(e: egret.TouchEvent): void {
		switch (e.currentTarget) {
			case this.doubleAward:
				console.log("login doubleAward btn click!");
				// 双倍奖励
				AdService.watchAd(AwardType.LOGIN_AWARD);
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
ViewManager.ins().reg(LoginAwardWin, LayerManager.UI_Tips);
window["LoginAwardWin"] = LoginAwardWin;
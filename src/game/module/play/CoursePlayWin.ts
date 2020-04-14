/* 怎么玩指引界面
 * @Author: zhoualnglang 
 * @Date: 2020-04-01 14:04:46 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-01 20:08:29
 */
class CoursePlayWin extends BaseEuiView {

    private btnR: BaseBtn;
    private btnL: BaseBtn;
    private closeBtn: BaseBtn;
    private grp: eui.Group;


    private mc: MovieClip
    /**当前第几个 默认0*/
    private cur = 0

    constructor() {
        super();
        this.skinName = `CoursePlaySkin`;
    }

    public initUI(): void {
        super.initUI();
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.addTouchEvent(this.btnL, this.onClick);
        this.addTouchEvent(this.btnR, this.onClick);

        this.upView()
    }

    private upView() {
        if (!this.mc) {
            this.mc = new MovieClip()
            this.mc.x = 50
            this.mc.y = 200
        }
        else {
            DisplayUtils.removeFromParent(this.mc)
        }
        this.grp.addChild(this.mc)
        let mcPath = GlobalConfig.getCoursePlay()
        this.mc.playFile(mcPath[this.cur], -1)

        this.upSelect()
    }

    private upSelect() {
        let mcPath = GlobalConfig.getCoursePlay()
        let len = mcPath.length
        this.btnL.enabled = true
        this.btnR.enabled = true
        if (this.cur == 0) {
            this.btnL.icon = 'course_btn_left_not_operate_png'
            this.btnR.icon = 'course_btn_right_operate_png'
            this.btnL.enabled = false
        }
        else if (this.cur + 1 >= len) {
            this.btnL.icon = 'course_btn_left_operate_png'
            this.btnR.icon = 'course_btn_right_not_operate_png'
            this.btnR.enabled = false
        }
        else {
            this.btnL.icon = 'course_btn_left_operate_png'
            this.btnR.icon = 'course_btn_right_operate_png'
        }
    }

    public close(...param: any[]): void {
        // this.removeTouchEvent(this.closeBtn, this.onClick);
        // this.removeObserve();
        if (this.mc) {
            DisplayUtils.removeFromParent(this.mc)
        }
        this.cur = 0
    }

    /**点击 */
    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.btnR:
                this.cur++
                this.upView()
                break;
            case this.btnL:
                this.cur--
                this.upView()
                break;
            case this.closeBtn:
                ViewManager.ins().close(this)
                break;

        }
    }

}
ViewManager.ins().reg(CoursePlayWin, LayerManager.UI_Popup);
window["CoursePlayWin"] = CoursePlayWin;
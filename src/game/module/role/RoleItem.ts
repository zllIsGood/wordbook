/* 角色组件-摇摆头与身体
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 14:06:21 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-13 20:25:35
 */
class RoleItem extends eui.ItemRenderer {

    private role1: eui.Image;
    private role2: eui.Image;
    private role3: eui.Image;

    public constructor() {
        super();
        this.skinName = "RoleItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.role2.addEventListener(egret.Event.COMPLETE, this.onComplete, this)
    }

    private onComplete() {
        // console.log('RoleItem role2:' + this.role2.source, this.role2.texture)
        this.playTw()
    }

    protected dataChanged() {
        let data = this.data
        // console.log('RoleItem:' + data)
        if (data == null || data == '') {
            return
        }

        let body = data.bodyImg
        let head = data.headImg
        let isUpLevel = false//true  //是否升级了
        if (data.stageNum == null && data.sageType != null) { //说明是贤士不是主角
            isUpLevel = HeroModel.ins().getIsUpLevel(data.id)
        }
        if (isUpLevel) {
            body = data.bodyImg2
            head = data.headImg2
        }
        this.role1.source = body
        this.role2.source = head
        this.playTw()
    }

    public playTw() {
        let data = this.data
        egret.Tween.removeTweens(this.role2)
        this.role2.rotation = 0
        if (!this.role2.texture) {
            return
        }

        // let datastr = StringUtils.deleteChangeLine(data.data)
        // let ob = JSON.parse(datastr)
        let isUpLevel = false//true  //是否升级了
        if (data.stageNum == null && data.sageType != null) { //说明是贤士不是主角
            isUpLevel = HeroModel.ins().getIsUpLevel(data.id)
        }
        let ob = isUpLevel ? data.data2 : data.data
        if (ob.extraParts) {
            this.role3.source = ob.extraParts.img
            // this.role3.y = ob.extraParts.exY
            this.role3.y = ob.bodyY
            this.role3.visible = true
        }
        else {
            this.role3.source = ''
            this.role3.visible = false
        }
        this.role1.y = ob.bodyY
        this.role2.y = ob.bodyY + ob.headY + ob.headH
        this.role2.anchorOffsetY = ob.headH
        this.role2.anchorOffsetX = this.role2.width / 2 //ob.w / 2
        // this.role2.x = 75
        DisplayUtils.setScale(this.role1, ob.scale)
        DisplayUtils.setScale(this.role2, ob.scale)
        DisplayUtils.setScale(this.role3, ob.scale)

        let tw = egret.Tween.get(this.role2, { loop: true })
        tw.to({ rotation: 5 }, 500)
            .to({ rotation: 0 }, 500)
            .to({ rotation: -5 }, 500)
            .to({ rotation: 0 }, 500)
    }

    public close(...param: any[]): void {
        this.role2.removeEventListener(egret.TouchEvent.COMPLETE, this.onComplete, this)
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        egret.Tween.removeTweens(this.role2)
    }

}
window["RoleItem"] = RoleItem
/**
 * 自定义事件bus
 * @author chenqipeng
 * @since 2019-06-21
 */
class CustomEventBus extends egret.EventDispatcher {
    /**
     * 自定义的事件类型
     */
    public static Event: BusEvent = {
        UPDATE_USER_INFO: '用户信息更新',
        UPDATE_OPEN_BONUS_COUNT: '开启的免费体力获取奖励任务数更新',
        RECORD_START_EVENT: '开始录屏',
        RECORD_STOP_EVENT: '录屏结束',
        RECORD_SHARE_EVENT: '录屏分享',
    }
}

/**
 * 自定义的事件类型
 */
interface BusEvent {
    /**
     * 用户信息更新事件
     */
    UPDATE_USER_INFO: string;

    /**
     * 开启的免费体力获取奖励任务数
     */
    UPDATE_OPEN_BONUS_COUNT: string;

    /**
     * 录屏开始事件
     */
    RECORD_START_EVENT: string;

    /**
     * 录屏结束事件
     */
    RECORD_STOP_EVENT: string;

    /**
     * 录屏分享事件
     */
    RECORD_SHARE_EVENT: string;

}
window["CustomEventBus"] = CustomEventBus;
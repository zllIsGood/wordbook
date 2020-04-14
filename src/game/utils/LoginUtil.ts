/**
 * 登录操作工具
 * @author kei
 * @since 2019-03-01
 */
class LoginUtil {

    public static setToken(token: string): void {
        if (token) {
            egret.localStorage.setItem(Constant.LOGIN_TOKEN, token);
        }
    }

    public static getToken(): string {
        return egret.localStorage.getItem(Constant.LOGIN_TOKEN);
    }

    public static setUserId(userId: number): void {
        if (userId) {
            egret.localStorage.setItem(Constant.LOGIN_USER_ID, userId + "");
        }
    }

    public static getUserId(): number {
        let data = egret.localStorage.getItem(Constant.LOGIN_USER_ID);
        if (data) {
            return Number(data);
        }
    }

}
window["LoginUtil"]=LoginUtil;
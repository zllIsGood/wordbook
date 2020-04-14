/*
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 11:27:54 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-03 17:03:32
 */
class GlobalConfig {

    public static init(data) {
        console.log(data)
        this.config = data
    }

    public static config: {
        CoursePlay: string[],
        HeroResult: { url, x, y }
    }

    public static getCoursePlay() {
        return this.config.CoursePlay
    }

    public static getHeroResult() {
        return this.config.HeroResult
    }
}
window["GlobalConfig"] = GlobalConfig
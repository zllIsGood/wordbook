/**
 * 缓存工具
 * @author kei
 * @since 2020-02-12
 */
class CacheUtil {

    public static set(key: string, value: string) {
        wx.setStorage({
            key: key,
            data: value
        });
    }

    public static get(key: string): Promise<string> {
        return wxapi.getStorage(key).catch(err => console.log(err));
    }

    /**
     * 请求文件内容
     */
    public static async fetchData(url: string, version?: string): Promise<any> {
        let key = "fetchData:" + url;
        version = version ? version : "1.0.0";
        let res = await wxapi.getStorage(key).catch(err => console.log(err));
        try {
            if (res) {
                res = JSON.parse(res);
                if (res.version === version) {
                    console.log("fetchData 获取缓存数据成功", res);
                    return res.data;
                }
            }
        } catch (err) {
            console.error("fetchData 获取缓存数据失败", url, version, err);
        }
        console.log("fetchData 下载数据", url, version);
        res = await RequestUtil.getPromise({url: url}).catch(err => console.error(err));
        if (res) {
            let saveData = {version: version, data: res};
            wx.setStorage({
                key: key,
                data: JSON.stringify(saveData)
            });
            return res;
        }
    }


    /**
     * 下载文件
     * @return 文件路径
     */
    public static async downloadFile(url: string, version?: string): Promise<string> {
        let key = "downloadFile:" + url;
        version = version ? version : "1.0.0";
        let res = await wxapi.getStorage(key).catch(err => console.log(err));
        try {
            if (res) {
                res = JSON.parse(res);
                if (res.version === version) {
                    console.log("downloadFile 获取缓存数据成功", res);
                    return res.data;
                }
            }
        } catch (err) {
            console.error("downloadFile 获取缓存数据失败", url, version, err);
        }
        console.log("downloadFile 下载数据", url, version);
        res = await wxapi.downloadFile(url).catch(err => console.log(err));
        if (res.statusCode === 200) {
            const fs = wx.getFileSystemManager();
            let fileName = url.substring(url.lastIndexOf("/"));
            let savePath =  wx.env.USER_DATA_PATH + fileName;
            let savedFilePath = fs.saveFileSync(res.tempFilePath, savePath);
            console.log(savePath, savedFilePath);
            if (savedFilePath) {
                let saveData = {version: version, data: savedFilePath};
                wx.setStorage({
                    key: key,
                    data: JSON.stringify(saveData)
                });
                return savedFilePath;
            }
        }
    }
}
window["CacheUtil"] = CacheUtil;
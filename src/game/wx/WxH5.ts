/* 适配h5版http
 * @Author: zhoualnglang 
 * @Date: 2020-04-07 10:01:38 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-04-11 11:36:25
 */
// if (!window['wx']) {
//     window['wx'] = {
//         login: function (p) {
//             // let obj = { code: "30bed03b9d733533", anonymousCode: "73e40e2898ba6b8f" }
//             let obj = {
//                 errMsg: "login:ok", anonymousCode: "12ff03950a2150c4", code: "7fdfe97bd2120c73", isLogin: true
//             }
//             p.success(obj)
//         },
//         request: function (params) {
//             if (params.method == 'GET') {
//                 Http.ins().get(params)
//             }
//             else if (params.method == 'POST') {
//                 Http.ins().post(params)
//             }
//         }
//     }
// }
/*
 * @Author: your name
 * @Date: 2021-01-05 15:57:07
 * @LastEditTime: 2021-01-05 15:57:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\utils\json.ts
 */
export function jsonParse(result) {
    return JSON.parse(JSON.stringify(result))
}

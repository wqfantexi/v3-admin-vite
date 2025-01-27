import { request } from "@/utils/service";
import type * as Login from "./types/login";
import { encryptPassword } from "../common";

/** 获取登录验证码 */
export function getLoginCodeApi() {
    return request<Login.LoginCodeResponseData>({
        url: "auth/code",
        method: "get"
    });
}

/** 登录并返回 Token */
export function loginApi(data: Login.LoginRequestData) {
    return request<Login.LoginResponseData>({
        url: "auth/login",
        method: "post",
        data: {
            username: data.username,
            password: encryptPassword(data.password),
            code: data.code
        }
    });
}

/** 获取用户详情 */
export function getUserInfoApi() {
    return request<Login.UserInfoResponseData>({
        url: "auth/info",
        method: "get"
    });
}

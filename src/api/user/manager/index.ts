import { request } from "@/utils/service";
import { encryptPassword } from "../common";
import type * as Table from "./types/manager";

/** 增 */
export function createUserApi(data: Table.CreateUserRequest) {
    const data2 = Object.assign({}, data);
    data2["password"] = encryptPassword(data["password"]);
    console.log(data2);
    return request({
        url: "auth/create",
        method: "post",
        data: data2
    });
}

/** 删 */
export function deleteUserApi(id: string) {
    return request({
        url: `auth/delete`,
        method: "post",
        data: { id }
    });
}

/** 改 */
export function updateUserApi(data: Table.UpdateUserRequest) {
    return request({
        url: "auth/update",
        method: "post",
        data
    });
}

/** 查 */
export function getUserApi(params: Table.GetUserRequest) {
    return request<Table.GetUserResponseData>({
        url: "auth/list",
        method: "get",
        params
    });
}

/** 获取roles列表 */
export function getUserRolesApi() {
    return request<Table.GetRolesResponseData>({
        url: "auth/roles",
        method: "get"
    });
}

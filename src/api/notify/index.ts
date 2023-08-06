import { request } from "@/utils/service";
import type * as Notify from "./types/notify";

/** 查 */
export function getGolbalMessageApi(params: Notify.GetGlobalMessageRequestData) {
    return request<Notify.GetRolesResponseData>({
        url: "notify/gmsgs",
        method: "get",
        params
    });
}

/** 新增 */
export function createGolbalMessageApi(data: Notify.CreateGolbalMessage) {
    return request<Notify.GetRolesResponseData>({
        url: "notify/gmsgs",
        method: "post",
        data
    });
}
/** 修改 */
export function modifyGolbalMessageApi(id: number, data: Notify.CreateGolbalMessage) {
    return request<Notify.GetRolesResponseData>({
        url: `notify/gmsg/${id}`,
        method: "put",
        data
    });
}

/** 删除 */
export function deleteGolbalMessageApi(id: number) {
    return request<Notify.GetRolesResponseData>({
        url: `notify/gmsg/${id}`,
        method: "delete"
    });
}

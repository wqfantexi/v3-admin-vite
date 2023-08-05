import { request } from "@/utils/service";
import type * as Notify from "./types/notify";

/** 查 */
export function getGolbalMessageApi() {
    return request<Notify.GetRolesResponseData>({
        url: "notify/global_message",
        method: "get"
    });
}

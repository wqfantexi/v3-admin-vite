export interface GetGlobalMessageRequestData {
    /** 当前页码 */
    currentPage?: number;
    /** 查询条数 */
    size?: number;
    /** 查询参数：用户名 */
    username?: string;
    /** 查询参数：手机号 */
    phone?: string;
}

export interface CreateGolbalMessage {
    title: string;
    message: string;
    position: string;
    type: string;
    duration: number;
}

export interface GolbalMessage {
    id: number;
    title: string;
    message: string;
    position: string;
    type: string;
    duration: number;
    createTime: string;
    updateTime: string;
}

// 获取当前所有的角色列表
export type GetRolesResponseData = ApiResponseData<{
    list: GolbalMessage[];
    total: number;
}>;

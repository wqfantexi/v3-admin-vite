export interface GolbalMessage {
    id: number;
    title: string;
    message: string;
    position: string;
    type: string;
    duration: number;
}

// 获取当前所有的角色列表
export type GetRolesResponseData = ApiResponseData<{
    list: GolbalMessage[];
    total: number;
}>;

export interface CreateUserRequest {
    username: string;
    password: string;
    roles: string[];
    email: string;
    status: boolean;
}

export interface UpdateUserRequest {
    id: string;
    username: string;
    password?: string;
    roles?: string[];
    email: string;
    status: boolean;
}

export interface GetUserRequest {
    /** 当前页码 */
    currentPage: number;
    /** 查询条数 */
    size: number;
    /** 查询参数：用户名 */
    username?: string;
    email?: string;
}

export interface GetUserData {
    createTime: string;
    email: string;
    id: string;
    roles: string[];
    username: string;
    updateTime: string;
    status: boolean;
}

export type GetUserResponseData = ApiResponseData<{
    list: GetUserData[];
    total: number;
}>;

export interface RoleData {
    id: number;
    label: string;
    value: string;
}

// 获取当前所有的角色列表
export type GetRolesResponseData = ApiResponseData<{
    list: RoleData[];
    total: number;
}>;

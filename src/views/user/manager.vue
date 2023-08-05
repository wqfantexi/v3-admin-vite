<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { createUserApi, deleteUserApi, updateUserApi, getUserApi, getUserRolesApi } from "@/api/user/manager";
import { type GetUserData, type RoleData } from "@/api/user/manager/types/table";
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue";
import { usePagination } from "@/hooks/usePagination";
import { encryptPassword } from "@/api/user/common";
defineOptions({
    // 命名当前组件
    name: "user_manager"
});

const loading = ref<boolean>(false);
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

// 从后台获取所有的用户角色
const listRoles = ref<RoleData[]>([]);
const getAllRolesFromServer = () => {
    getUserRolesApi()
        .then((res) => {
            listRoles.value = res.data.list;
        })
        .catch(() => {
            listRoles.value = [];
        });
};

//#region 增
const dialogVisible = ref<boolean>(false);
const formRef = ref<FormInstance | null>(null);
const formData = reactive({
    username: "",
    password: "",
    email: "",
    roles: Array<string>(),
    status: true
});
const formRules: FormRules = reactive({
    username: [{ required: true, trigger: "blur", message: "请输入用户名" }]
    //password: [{ required: true, trigger: "blur", message: "请输入密码" }]
});
const handleOnClickCreate = () => {
    getAllRolesFromServer();
    dialogVisible.value = true;
};

const handleCreate = () => {
    formRef.value?.validate((valid: boolean, fields) => {
        if (valid) {
            if (currentUpdateId.value === undefined) {
                createUserApi(formData)
                    .then(() => {
                        ElMessage.success("新增成功");
                        getTableData();
                    })
                    .finally(() => {
                        dialogVisible.value = false;
                    });
            } else {
                const data = {
                    id: currentUpdateId.value,
                    username: formData.username,
                    roles: formData.roles,
                    status: formData.status,
                    email: formData.email,
                    password: formData.password.length > 0 ? encryptPassword(formData.password) : ""
                };

                updateUserApi(data)
                    .then(() => {
                        ElMessage.success("修改成功");
                        getTableData();
                    })
                    .finally(() => {
                        dialogVisible.value = false;
                    });
            }
        } else {
            console.error("表单校验不通过", fields);
        }
    });
};
const resetForm = () => {
    currentUpdateId.value = undefined;
    formData.username = "";
    formData.password = "";
    formData.email = "";
    formData.status = true;
};
//#endregion

//#region 删
const handleDelete = (row: GetUserData) => {
    ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(() => {
        deleteUserApi(row.id).then(() => {
            ElMessage.success("删除成功");
            getTableData();
        });
    });
};
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined);
const handleUpdate = (row: GetUserData) => {
    getAllRolesFromServer();
    currentUpdateId.value = row.id;
    formData.username = row.username;
    formData.roles = row.roles;
    formData.status = row.status;
    formData.email = row.email;
    dialogVisible.value = true;
};
//#endregion

//#region 查
const tableData = ref<GetUserData[]>([]);
const searchFormRef = ref<FormInstance | null>(null);
const searchData = reactive({
    username: "",
    email: ""
});
const getTableData = () => {
    loading.value = true;
    getUserApi({
        currentPage: paginationData.currentPage,
        size: paginationData.pageSize,
        username: searchData.username || undefined,
        email: searchData.email || undefined
    })
        .then((res) => {
            paginationData.total = res.data.total;
            tableData.value = res.data.list;
        })
        .catch(() => {
            tableData.value = [];
        })
        .finally(() => {
            loading.value = false;
        });
};
const handleSearch = () => {
    paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1);
};
const resetSearch = () => {
    searchFormRef.value?.resetFields();
    handleSearch();
};
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true });
</script>

<template>
    <div class="app-container">
        <el-card v-loading="loading" shadow="never" class="search-wrapper">
            <el-form ref="searchFormRef" :inline="true" :model="searchData">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="searchData.username" placeholder="请输入" />
                </el-form-item>
                <el-form-item prop="phone" label="邮箱">
                    <el-input v-model="searchData.email" placeholder="请输入" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
                    <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-loading="loading" shadow="never">
            <div class="toolbar-wrapper">
                <div>
                    <el-button type="primary" :icon="CirclePlus" @click="handleOnClickCreate">新增用户</el-button>
                    <el-button type="danger" :icon="Delete">批量删除</el-button>
                </div>
                <div>
                    <el-tooltip content="下载">
                        <el-button type="primary" :icon="Download" circle />
                    </el-tooltip>
                    <el-tooltip content="刷新当前页">
                        <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
                    </el-tooltip>
                </div>
            </div>
            <div class="table-wrapper">
                <el-table :data="tableData">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column prop="username" label="用户名" align="center" />
                    <el-table-column prop="roles" label="角色" align="center">
                        <template #default="scope">
                            <el-tag v-for="tag in scope.row.roles" :key="tag" effect="plain">{{ tag }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="email" label="邮箱" align="center" />
                    <el-table-column prop="status" label="状态" align="center">
                        <template #default="scope">
                            <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
                            <el-tag v-else type="danger" effect="plain">禁用</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center" />
                    <el-table-column fixed="right" label="操作" width="150" align="center">
                        <template #default="scope">
                            <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)"
                                >修改</el-button
                            >
                            <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)"
                                >删除</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pager-wrapper">
                <el-pagination
                    background
                    :layout="paginationData.layout"
                    :page-sizes="paginationData.pageSizes"
                    :total="paginationData.total"
                    :page-size="paginationData.pageSize"
                    :currentPage="paginationData.currentPage"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
        <!-- 新增/修改 -->
        <el-dialog
            v-model="dialogVisible"
            :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
            @close="resetForm"
            width="40%"
        >
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
                <el-form-item prop="username" label="用户名">
                    <el-input v-model="formData.username" placeholder="请输入" />
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="formData.password" placeholder="请输入" />
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="formData.email" placeholder="请输入" />
                </el-form-item>
                <el-form-item prop="status" label="状态">
                    <el-switch
                        v-model="formData.status"
                        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    />
                </el-form-item>
                <el-form-item prop="roles" label="角色">
                    <el-select v-model="formData.roles" multiple placeholder="Select" style="width: 100%">
                        <el-option v-for="item in listRoles" :key="item.id" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleCreate">确认</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
    margin-bottom: 20px;
    :deep(.el-card__body) {
        padding-bottom: 2px;
    }
}

.toolbar-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.table-wrapper {
    margin-bottom: 20px;
}

.pager-wrapper {
    display: flex;
    justify-content: flex-end;
}
</style>

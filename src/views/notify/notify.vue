<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import {
    getGolbalMessageApi,
    createGolbalMessageApi,
    modifyGolbalMessageApi,
    deleteGolbalMessageApi
} from "@/api/notify";
import { type GolbalMessage } from "@/api/notify/types/notify";
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue";
import { usePagination } from "@/hooks/usePagination";

defineOptions({
    // 命名当前组件
    name: "notify"
});

const loading = ref<boolean>(false);
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination();

// 从后台获取所有的用户角色
const listRoles = ref<GolbalMessage[]>([]);
const getAllRolesFromServer = () => {
    getGolbalMessageApi()
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
    title: "",
    message: "",
    position: "top-right",
    type: "info",
    duration: 0
});
const formRules: FormRules = reactive({
    title: [{ required: true, trigger: "blur", message: "请输入标题" }]
    //password: [{ required: true, trigger: "blur", message: "请输入密码" }]
});
const handleOnClickCreate = () => {
    dialogVisible.value = true;
};

const handleCreate = () => {
    formRef.value?.validate((valid: boolean, fields) => {
        if (valid) {
            if (currentUpdateId.value === undefined) {
                createGolbalMessageApi(formData)
                    .then(() => {
                        ElMessage.success("新增成功");
                        getTableData();
                    })
                    .finally(() => {
                        dialogVisible.value = false;
                    });
            } else {
                modifyGolbalMessageApi(currentUpdateId.value, formData)
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
    formData.title = "";
    formData.message = "";
    formData.duration = 0;
    formData.position = "top-right";
    formData.type = "info";
};
//#endregion

//#region 删
const handleDelete = (row: GolbalMessage) => {
    ElMessageBox.confirm(`正在删除消息：${row.title}，确认删除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(() => {
        deleteGolbalMessageApi(row.id).then(() => {
            ElMessage.success("删除成功");
            getTableData();
        });
    });
};
//#endregion

//#region 改
const currentUpdateId = ref<undefined | number>(undefined);
const handleUpdate = (row: GolbalMessage) => {
    getAllRolesFromServer();
    currentUpdateId.value = row.id;
    formData.title = row.title;
    formData.message = row.message;
    formData.position = row.position;
    formData.type = row.type;
    dialogVisible.value = true;
};
//#endregion

//#region 查
const tableData = ref<GolbalMessage[]>([]);
const searchFormRef = ref<FormInstance | null>(null);
const searchData = reactive({
    username: "",
    email: ""
});
const getTableData = () => {
    loading.value = true;
    getGolbalMessageApi({
        currentPage: paginationData.currentPage,
        size: paginationData.pageSize
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
                    <el-button type="primary" :icon="CirclePlus" @click="handleOnClickCreate">添加消息</el-button>
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
                    <el-table-column prop="title" label="通知标题" align="center" />
                    <el-table-column prop="message" label="通知内容" align="center" />
                    <el-table-column prop="type" label="通知类型" align="center" />
                    <el-table-column prop="position" label="弹出位置" align="center" />
                    <el-table-column prop="duration" label="显示时间" align="center" />
                    <el-table-column prop="createTime" label="创建时间" align="center" />
                    <el-table-column prop="updateTime" label="修改时间" align="center" />
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
            :title="currentUpdateId === undefined ? '新增通知' : '修改通知'"
            @close="resetForm"
            width="40%"
        >
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
                <el-form-item prop="title" label="通知标题">
                    <el-input v-model="formData.title" placeholder="请输入" />
                </el-form-item>
                <el-form-item prop="message" label="通知内容">
                    <el-input
                        v-model="formData.message"
                        type="textarea"
                        :autosize="{ minRows: 4, maxRows: 10 }"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item prop="type" label="通知类型">
                    <el-select v-model="formData.type" placeholder="Select">
                        <el-option label="success" value="success" />
                        <el-option label="warning" value="warning" />
                        <el-option label="info" value="info" />
                        <el-option label="error" value="error" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="position" label="弹出位置">
                    <el-select v-model="formData.position" placeholder="Select">
                        <el-option label="top-right" value="top-right" />
                        <el-option label="top-left" value="top-left" />
                        <el-option label="bottom-right" value="bottom-right" />
                        <el-option label="bottom-left" value="bottom-left" />
                    </el-select>
                </el-form-item>
                <el-form-item prop="duration" label="显示时间">
                    <el-input v-model="formData.duration" placeholder="请输入" />
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
@/api/user/manager/types/manager

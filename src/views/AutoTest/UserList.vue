<template>
  <div class="old-manage">
    <div style="padding:16px">用户列表</div>
    <div class="flex-box">
      <el-button type="primary" size="small" @click="createAccount">创建账号</el-button>
      <el-select
        v-model="type"
        style="width:150px;margin-left:16px"
        placeholder="批量管理"
        size="small"
        :no-data-text="'暂无数据'"
        @change="batchActions"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <div style="text-align:right;width:100%">
        <el-select
          v-model="searchObj.role"
          placeholder="请选择账号角色"
          size="small"
          :no-data-text="'暂无数据'"
          clearable
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="timeArray"
          size="small"
          type="daterange"
          :value-format="'yyyy-MM-dd HH:mm:ss'"
          :format="'yyyy-MM-dd HH:mm:ss'"
          range-separator="至"
          start-placeholder="最后登录开始时间"
          end-placeholder="最后登录结束时间"
        />
        <el-input
          v-model="searchObj.userInfo"
          icon="el-icon-search"
          placeholder="搜索用户名/用户编号"
          size="small"
          style="width:200px"
        />
      </div>
    </div>
    <base-table
      ref="tableRef"
      :url="'/user/listWithSearch'"
      :search-param="searchObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名" width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetail(scope.row)">{{ scope.row.username }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用户编号" width="200">
        <template slot-scope="scope">
          <div>{{ scope.row.userNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账号状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status" type="warning">{{ scope.row.status | statusFilter }}</el-tag>
          <el-tag v-else type="success">{{ scope.row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="账号角色" width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.role|roleFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建账号" width="140">
        <template slot-scope="scope">
          <div>{{ scope.row.createdBy }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.lastIp }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.lastLogin }}</div>
        </template>
      </el-table-column>
      <el-table-column label="登录次数" width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.loginCount }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status"
              type="text"
              style="color:#67c23a"
              size="small"
              @click="onEnable(scope.row)"
            >启用</el-button>
            <el-button
              v-else
              type="text"
              style="color:#e6a23c"
              size="small"
              @click="onDisable(scope.row)"
            >禁用</el-button>
            <el-button
              type="text"
              style="color:#f56c6c"
              size="small"
              @click="onDelete(scope.row)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script>
import BaseTable from "@/components/BaseTable";
import { statusFilter, roleFilter } from "@/utils/filter";
import { deleteUsers, disableUsers, enableUsers } from "@/api/user";

export default {
  components: { BaseTable },
  filters: {
    statusFilter,
    roleFilter
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入新密码", trigger: "blur" }]
      },
      timeArray: [],
      form: {
        password: ""
      },
      formLabelWidth: "120px",
      dialogPwdVisible: false,
      oldInfoObj: {},
      chartDataObj: {},
      searchName: "",
      searchObj: {
        userInfo: "",
        role: "",
        startTime: "",
        endTime: ""
        // userId: sessionStorage.getItem("userInfo").id
      },
      idList: [],
      type: "",
      typeOptions: [
        {
          name: "批量禁用",
          value: "禁用"
        },
        {
          name: "批量启用",
          value: "启用"
        },
        {
          name: "批量删除",
          value: "删除"
        }
      ],
      roleOptions: [
        {
          name: "root",
          value: 1
        },
        {
          name: "QA",
          value: 0
        }
      ]
    };
  },
  watch: {
    timeArray(val) {
      // console.log(val);
      if (!val) {
        this.searchObj.startTime = "";
        this.searchObj.endTime = "";
      } else {
        this.searchObj.startTime = val[0];
        this.searchObj.endTime = val[1];
      }
    }
  },
  methods: {
    createAccount() {
      this.$router.push({ path: "/user/edit", query: { type: 0 } });
    },
    // 列表操作
    batchActions() {
      if (this.type === "禁用") {
        this.onDisable(this.idList);
      } else if (this.type === "删除") {
        this.onDelete(this.idList);
      } else {
        this.onEnable(this.idList);
      }
      this.type = "";
    },
    onDisable(row) {
      this.$confirm("确定要禁用吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (Array.isArray(row)) {
            this.disableUsers(row);
          } else {
            const ids = [row.id];
            this.disableUsers(ids);
          }
        })
        .catch(() => {});
    },
    onDelete(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (Array.isArray(row)) {
            this.deleteUsers(row);
          } else {
            const ids = [row.id];
            this.deleteUsers(ids);
          }
        })
        .catch(() => {});
    },
    onEnable(row) {
      if (Array.isArray(row)) {
        this.enableUsers(row);
      } else {
        const ids = [row.id];
        this.enableUsers(ids);
      }
    },
    onEdit(row) {
      sessionStorage.setItem("userDetail", JSON.stringify(row));
      this.$router.push({ path: "/user/edit", query: { type: 1 } });
    },
    goDetail(row) {
      this.$router.push({ path: "/user/detail", query: { id: row.id } });
    },
    handleSelectionChange(row) {
      this.idList = row.map(f => f.id);
      console.log(this.idList);
    },
    // 接口调用
    async deleteUsers(userIds) {
      try {
        await deleteUsers({ userIds: userIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    },
    async enableUsers(userIds) {
      try {
        await enableUsers({ userIds: userIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    },
    async disableUsers(userIds) {
      try {
        await disableUsers({ userIds: userIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.old-manage {
  .flex-box {
    display: flex;
    align-items: center;
    > button {
      margin-left: 16px;
    }
  }
}
</style>

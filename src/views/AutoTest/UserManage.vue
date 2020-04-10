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
          :value-format="'yyyy-MM-dd'"
          :format="'yyyy-MM-dd'"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-input
          v-model="searchName"
          icon="el-icon-search"
          placeholder="搜索用户名/用户编号"
          size="small"
          style="width:200px"
        />
        <el-button type="primary" size="small" @click="searchObj.name = searchName">搜索</el-button>
      </div>
    </div>
    <base-table
      ref="tableRef"
      :url="'/user/list'"
      :search-param="searchObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="用户名" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetail(scope.row)">{{ scope.row.username }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用户编号" width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.userNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账号状态" width="100">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status">{{ scope.row.status | statusFilter }}</el-tag>
          <el-tag type="warning" v-else>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="账号角色" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.role|roleFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建账号" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.createdBy }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.lastIp }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" width="180">
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
            <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status"
              type="text"
              style="color:#e6a23c"
              size="small"
              @click="disableItem(scope.row)"
            >禁用</el-button>
            <el-button
              v-else
              type="text"
              style="color:#67c23a"
              size="small"
              @click="enableItem(scope.row)"
            >启用</el-button>
            <el-button type="text" size="small" @click="changePwd(scope.row)">修改密码</el-button>
            <el-button
              type="text"
              style="color:#f56c6c"
              size="small"
              @click="deleteItem(scope.row)"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </base-table>
    <el-dialog title="修改密码" :visible.sync="dialogPwdVisible" @close="closeDialog">
      <el-form ref="pwdRef" :model="form" :rules="rules">
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.password" style="width:300px" placeholder="请输入新密码" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPwdVisible = false">取 消</el-button>
        <el-button type="primary" @click="confrimPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import BaseTable from "@/components/BaseTable";
import { statusFilter, roleFilter } from "@/utils/filter";
import { deleteItems, disableItems, enableItems } from "@/api/user";
export default {
  components: { BaseTable },
  filters: {
    statusFilter,
    roleFilter
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入正确的新密码", trigger: "blur" }
        ]
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
        name: "",
        role: ""
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
          name: "qa",
          value: 0
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["communityList"])
  },
  methods: {
    batchActions() {
      if (this.type === "禁用") {
        this.disableItem(this.idList);
      } else if (this.type === "删除") {
        this.deleteItem(this.idList);
      } else {
        this.enableItem(this.idList);
      }
      this.type = "";
    },
    goDetail(row) {
      this.$router.push({ path: "/user/detail" });
    },

    editItem(row) {
      sessionStorage.setItem("userDetail", JSON.stringify(row));
      this.$router.push({ path: "/user/edit", query: { type: 1 } });
    },
    disableItem(row) {
      this.$confirm("确定要禁用吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (Array.isArray(row)) {
            this.disableItems(row);
          } else {
            const ids = [row.id];
            this.disableItems(ids);
          }
        })
        .catch(() => {});
    },
    deleteItem(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (Array.isArray(row)) {
            this.deleteItems(row);
          } else {
            const ids = [row.id];
            this.deleteItems(ids);
          }
        })
        .catch(() => {});
    },
    enableItem(row) {
      if (Array.isArray(row)) {
        this.enableItems(row);
      } else {
        let ids = [row.id];
        this.enableItems(ids);
      }
    },
    createAccount() {
      this.$router.push({ path: "/user/edit", query: { type: 0 } });
    },
    changePwd() {
      this.dialogPwdVisible = true;
    },
    confrimPwd() {
      this.$refs["pwdRef"].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closeDialog() {
      this.$refs["pwdRef"].resetFields();
    },
    async deleteItems(userIds) {
      try {
        await deleteItems({ userIds: userIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    },
    async enableItems(userIds) {
      try {
        await enableItems({ userIds: userIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    },
    async disableItems(userIds) {
      try {
        await disableItems({ userIds: userIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    },
    handleSelectionChange(row) {
      this.idList = row.map(f => f.id);
      console.log(this.idList);
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

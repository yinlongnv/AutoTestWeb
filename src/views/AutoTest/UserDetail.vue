<template>
  <div>
    <div class="header-line">账号详情</div>
    <div class="border-line">
      <div class="info-item">
        用户名:
        <span>{{ userInfo.username }}</span>
      </div>
      <div class="info-item">
        用户编号:
        <span>{{ userInfo.userNumber }}</span>
      </div>
      <div class="info-item">
        账号状态:
        <el-tag
          v-if="userInfo.status ===1 "
          type="warning"
          style="color:#e6a23c"
          size="small"
        >{{ userInfo.status|statusFilter }}</el-tag>
        <el-tag
          v-else
          type="success"
          style="color:#67c23a"
          size="small"
        >{{ userInfo.status|statusFilter }}</el-tag>
      </div>
      <div class="info-item">
        账号角色:
        <span>{{ userInfo.role|roleFilter }}</span>
      </div>
      <div class="info-item">
        身份证号:
        <span>{{ userInfo.idNumber }}</span>
      </div>
      <div class="info-item">
        手机号:
        <span>{{ userInfo.phoneNumber }}</span>
      </div>
      <div class="info-item">
        邮箱地址:
        <span>{{ userInfo.email }}</span>
      </div>
      <div class="info-item">
        最后登录IP:
        <span>{{ userInfo.lastIp }}</span>
      </div>
      <div class="info-item">
        最后登录时间:
        <span>{{ userInfo.lastLogin }}</span>
      </div>
      <div class="info-item" style="padding-bottom:24px">
        密码:
        <span>{{ userInfo.password }}</span>
      </div>
    </div>
    <div style="padding:24px 0">
      <el-button size="small" @click="goBack">返回</el-button>
      <el-button type="primary" size="small" @click="goEdit">编辑</el-button>
      <el-button v-if="!userInfo.status" type="warning" size="small" @click="disableItem">禁用</el-button>
      <el-button v-else type="success" size="small" @click="enableItem">启用</el-button>
      <el-button type="danger" size="small" @click="deleteItem">删除</el-button>
    </div>
  </div>
</template>

<script>
import {
  getUserDetail,
  enableUsers,
  disableUsers,
  deleteUsers
} from "@/api/user";
import { statusFilter, roleFilter } from "@/utils/filter";
export default {
  filters: {
    statusFilter,
    roleFilter
  },
  data() {
    return {
      userInfo: {}
    };
  },
  created() {
    this.getUserDetail();
  },
  methods: {
    async getUserDetail() {
      try {
        const result = await getUserDetail({ id: this.$route.query.id });
        this.userInfo = result.data.data;
        sessionStorage.setItem("userDetail", JSON.stringify(this.userInfo));
      } catch (error) {
        this.$message.error(error);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    goEdit() {
      this.$router.push({ path: "/user/edit", query: { type: 1 } });
    },
    actionNotice(text, fn) {
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(fn)
        .catch(() => {});
    },
    deleteItem() {
      this.actionNotice("确定要删除吗?", () => {
        this.deleteUsers([this.userInfo.id]).then(() => {
          this.$router.go(-1);
        });
      });
    },
    disableItem() {
      this.actionNotice("确定要禁用吗?", () => {
        this.disableUsers([this.userInfo.id]).then(() => {
          this.getUserDetail();
        });
      });
    },
    enableItem() {
      this.enableUsers([this.userInfo.id]).then(() => {
        this.getUserDetail();
      });
    },
    // 接口调用
    async deleteUsers(userIds) {
      try {
        await deleteUsers({ userIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    },
    async enableUsers(userIds) {
      try {
        await enableUsers({ userIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    },
    async disableUsers(userIds) {
      try {
        await disableUsers({ userIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
    }
  }
};
</script>

<style scoped>
.info-item {
  font-size: 14px;
  padding: 10px 0;
  color: #999;
}
.info-item > span {
  margin-left: 8px;
  color: #333;
}
</style>

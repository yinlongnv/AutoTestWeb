<template>
  <div>
    <div>账号详情</div>
    <div class="user-info">
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
        <el-tag type="warning" style="color:#e6a23c" size="small">{{ userInfo.status }}</el-tag>
      </div>
      <div class="info-item">
        账号角色:
        <span>{{ userInfo.role }}</span>
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
      <el-button type="success" size="small" @click="disableItem">禁用</el-button>
      <el-button type="danger" size="small" @click="deleteItem">删除</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goEdit() {
      this.$router.push({ path: "/user/edit" });
    },
    deleteItem(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    },
    disableItem(row) {
      this.$confirm("确定要禁用吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {})
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.user-info {
  border: 1px solid #999;
  border-radius: 5px;
  padding: 16px 0 0 24px;
  margin-top: 24px;
}
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

<template>
  <div>
    <div>账号详情</div>
    <div class="user-info">
      <div class="info-item">用户姓名:<span>王三火</span></div>
      <div class="info-item">账号名称:<span>王三火</span></div>
      <div class="info-item">账号角色:<span>王三火</span></div>
      <div class="info-item">所属部门:<span>王三火</span></div>
      <div class="info-item">账号状态:<el-tag type="warning" style="color:#e6a23c" size="small">禁用</el-tag></div>
      <div class="info-item">身份证号:<span>王三火</span></div>
      <div class="info-item">手机号:<span>王三火</span></div>
      <div class="info-item">邮箱地址:<span>王三火</span></div>
      <div class="info-item">创建账号:<span>王三火</span></div>
      <div class="info-item" style="padding-bottom:24px">创建时间:<span>王三火</span></div>

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
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    goEdit() {
      this.$router.push({ path: '/user/edit' })
    },
    deleteItem(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    },
    disableItem(row) {
      this.$confirm('确定要禁用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    }
  }

}
</script>

<style scoped>
.user-info{
    border: 1px solid #999;
    border-radius: 5px;
    padding: 16px 0 0 24px;
    margin-top: 24px;
}
.info-item{
    font-size: 14px;
    padding: 10px 0;
    color: #999;
}
.info-item>span{
    margin-left: 8px;
    color: #333;
}
</style>

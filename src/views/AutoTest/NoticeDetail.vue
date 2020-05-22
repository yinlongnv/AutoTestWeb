<template>
  <div>
    <div>通知公告详情</div>
    <div class="content">
      <p
        style="font-size: 18px; color: rgb(72, 73, 77); text-align: center; font-weight: bolder;"
      >【消息】测试用例执行完毕，详细信息如下</p>
      <el-row>
        <el-col :span="12">执行人：</el-col>
        <el-col style="text-align:right" :span="12">执行时间：</el-col>
      </el-row>
    </div>
  </div>
</template>
<style scoped>
.content {
  background: #fff;
  border: 1px solid #dcdee6;
  border-radius: 0 0 4px 4px;
  min-width: 800px;
  margin: 20px 20px 30px;
  padding: 40px 100px;
}
</style>

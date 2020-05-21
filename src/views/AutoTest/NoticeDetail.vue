<template>
  <div>
    <div>测试报告</div>
    <div class="content">
      <p
        style="font-size: 18px; color: rgb(72, 73, 77); text-align: center; font-weight: bolder;"
      >消息导入巴拉巴拉</p>
      <el-row>
        <el-col :span="12">执行时间</el-col>
        <el-col style="text-align:right" :span="12">执行人</el-col>
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

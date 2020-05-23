<template>
  <div>
    <div class="header-line">通知公告详情</div>
    <div class="content">
      <p
        style="font-size: 18px; color: rgb(72, 73, 77); text-align: center; font-weight: bolder;"
      >【消息】测试用例执行完毕，详细信息如下</p>
      <el-row>
        <el-col :span="12">执行人：{{detailInfo.username}}</el-col>
        <el-col style="text-align:right" :span="12">执行时间：{{detailInfo.createdAt}}</el-col>
      </el-row>
      <div class="info">
        <div style="margin-top:15px">所属接口信息：</div>
        <div>所属项目：{{detailInfo.projectName}}</div>
        <div>所属分组：{{detailInfo.apiGroup}}</div>
        <div>接口名称：{{detailInfo.apiName}}</div>
        <div>接口路径：{{detailInfo.apiPath}}</div>
        <div @click="viewCase" style="cursor:pointer;color:blue">点击此处查看所执行用例详情</div>
        <div @click="viewReport" style="cursor:pointer;color:blue">点击查看测试报告</div>
      </div>
    </div>
    <el-button @click="goBack" style="margin-left:20px">返回</el-button>
  </div>
</template>
<script>
import { detail } from "@/api/notice";
export default {
  data() {
    return {
      detailInfo: {}
    };
  },
  created() {
    this.getDetail();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async getDetail() {
      console.log("aaaaa");
      let id = this.$route.query.id;
      let result = await detail({ noticeId: id });
      this.detailInfo = result.data.data;
    },
    viewCase() {
      let caseId = this.detailInfo.caseId;
      this.$router.push({ path: "/case/detail", query: { caseId } });
    },
    viewReport() {
      let href = "http://10.11.45.43:9001/" + this.detailInfo.htmlUrl;
      window.open(href, "_blank");
      // window.location.href = href;
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  background: #fff;
  border: 1px solid #dcdee6;
  border-radius: 0 0 4px 4px;
  min-width: 800px;
  margin: 20px 20px 30px;
  padding: 40px 100px;
}
.info {
  div {
    padding: 12px 0;
  }
}
</style>

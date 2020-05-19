<template>
  <div>
    <div class="header-line">用例详情</div>
    <div class="border-line">
      <div class="info-item">
        环境域名:
        <span>{{ caseInfo.baseUrl }}</span>
      </div>
      <div class="info-item">
        接口路径:
        <span>{{ caseInfo.apiPath }}</span>
      </div>
      <div class="info-item">
        接口名称:
        <span>{{ caseInfo.apiName }}</span>
      </div>
      <div class="info-item">
        请求方法:
        <span>{{ caseInfo.reqMethod }}</span>
      </div>
      <div class="info-item">
        请求头:
        <span>{{ caseInfo.reqHeaders }}</span>
      </div>
      <div class="info-item">
        请求参数:
        <span>{{ caseInfo.reqQuery }}</span>
      </div>
      <div class="info-item">
        请求体:
        <span>{{ caseInfo.reqBody }}</span>
      </div>
      <div class="info-item">
        用例内容:
        <span>{{ caseInfo.caseBody }}</span>
      </div>
      <div class="info-item">
        用例描述:
        <span>{{ caseInfo.caseDescription }}</span>
      </div>
      <div class="info-item">
        预期响应:
        <span>{{ caseInfo.caseResponse }}</span>
      </div>
      <div class="info-item">
        创建人:
        <span>{{ caseInfo.createdBy }}</span>
      </div>
      <div class="info-item">
        执行人:
        <span>{{ caseInfo.username }}</span>
      </div>
      <div class="info-item">
        执行状态:
        <el-tag
          v-if="caseInfo.executeStatus"
          style="color:#67C23A"
          type="success"
        >{{ caseInfo.executeStatus|executeStatusFilter }}</el-tag>
        <el-tag
          v-else
          style="color:#E6A23C"
          type="warning"
        >{{ caseInfo.executeStatus|executeStatusFilter }}</el-tag>
      </div>
      <div class="info-item">
        执行时间:
        <span>{{ caseInfo.lastExecuteTime }}</span>
      </div>
    </div>
    <div style="padding:24px 0">
      <el-button size="small" @click="goBack">返回</el-button>
      <el-button type="primary" size="small" @click="goEdit">编辑</el-button>
      <el-button type="success" size="small" @click="goRun">执行</el-button>
      <!-- <el-button v-if="!caseInfo.status" type="warning" size="small" @click="disableItem">禁用</el-button>
      <el-button v-else type="success" size="small" @click="enableItem">启用</el-button>-->
      <el-button type="danger" size="small" @click="deleteItem">删除</el-button>
    </div>
  </div>
</template>

<script>
import { getCaseDetail, deleteCases } from "@/api/case";
import { executeStatusFilter } from "@/utils/filter";
export default {
  filters: {
    executeStatusFilter
  },
  data() {
    return {
      caseInfo: {}
    };
  },
  created() {
    this.getCaseDetail();
  },
  methods: {
    async getCaseDetail() {
      try {
        const result = await getCaseDetail({ id: this.$route.query.id });
        this.caseInfo = result.data.data;
        sessionStorage.setItem("caseDetail", JSON.stringify(this.caseInfo));
      } catch (error) {
        this.$message.error(error);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    goEdit() {
      this.$router.push({ path: "/case/edit", query: { type: 1 } });
    },
    deleteItem() {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteCases([this.caseInfo.id]).then(() => {
            this.getCaseDetail();
            this.$router.go(-1);
          });
        })
        .catch(() => {});
    },
    async deleteCases(caseIds) {
      try {
        await deleteCases({ caseIds: caseIds });
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

<template>
  <div>
    <div class="header-line">接口详情</div>
    <div class="user-info">
      <div class="info-item">
        环境域名:
        <span>{{ apiInfo.baseUrl }}</span>
      </div>
      <div class="info-item">
        所属业务:
        <span>{{ apiInfo.projectName }}</span>
      </div>
      <div class="info-item">
        所属分组:
        <span>{{ apiInfo.apiGroup }}</span>
      </div>
      <div class="info-item">
        请求方法:
        <span>{{ apiInfo.reqMethod }}</span>
      </div>
      <div class="info-item">
        请求头:
        <span>{{ apiInfo.reqHeaders }}</span>
      </div>
      <div class="info-item">
        请求体:
        <span>{{ apiInfo.reqBody }}</span>
      </div>
      <div class="info-item">
        响应信息:
        <span>{{ apiInfo.apiResponse }}</span>
      </div>
      <div class="info-item">
        接口名称:
        <span>{{ apiInfo.apiName }}</span>
      </div>
      <div class="info-item">
        接口路径:
        <span>{{ apiInfo.apiPath }}</span>
      </div>
      <div class="info-item">
        接口描述:
        <span>{{ apiInfo.apiDescription }}</span>
      </div>
      <div class="info-item">
        创建人:
        <span>{{ apiInfo.createdBy }}</span>
      </div>
    </div>
    <div style="padding:24px 0">
      <el-button size="small" @click="goBack">返回</el-button>
      <el-button type="primary" size="small" @click="goEdit">编辑</el-button>
      <el-button type="danger" size="small" @click="deleteItem">删除</el-button>
    </div>
  </div>
</template>

<script>
import { getApiDetail, deleteApis } from "@/api/api";
import { statusFilter } from "@/utils/filter";
export default {
  data() {
    return {
      apiInfo: {}
    };
  },
  created() {
    this.getApiDetail();
  },
  filters: {
    statusFilter
  },
  methods: {
    async getApiDetail() {
      try {
        let result = await getApiDetail({ id: this.$route.query.id });
        this.apiInfo = result.data.data;
        sessionStorage.setItem("apiDetail", JSON.stringify(this.apiInfo));
      } catch (error) {}
    },
    goBack() {
      this.$router.go(-1);
    },
    goEdit() {
      this.$router.push({ path: "/api/edit", query: { type: 1 } });
    },
    deleteItem(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteApis([this.apiInfo.id]).then(() => {
            this.$router.go(-1);
          });
        })
        .catch(() => {});
    },
    async deleteApis(apiIds) {
      try {
        await deleteApis({ apiIds: apiIds });
        this.$refs.tableRef.onSearch();
      } catch (error) {
        this.$message.error(error);
      }
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

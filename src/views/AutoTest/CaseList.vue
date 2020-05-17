<template>
  <div class="old-manage">
    <div class="header-line">用例管理</div>
    <div class="flex-box">
      <el-button type="primary" size="small" @click="createCase">创建用例</el-button>
      <el-button icon="el-icon-download" size="small" @click="handleDownload">下载模板</el-button>
      <el-button icon="el-icon-upload2" size="small" @click="handleDownload">批量导入</el-button>
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
        <el-cascader
          size="small"
          clearable
          v-model="value"
          placeholder="请选择关联接口信息"
          :options="options"
          @change="handleChange"
        ></el-cascader>
        <el-select
          v-model="searchObj.executeStatus"
          style="width:150px"
          placeholder="请选择执行状态"
          size="small"
          clearable
          :no-data-text="'暂无数据'"
        >
          <el-option
            v-for="item in executeStatusOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="searchObj.caseDescription"
          icon="el-icon-search"
          placeholder="搜索用例描述"
          size="small"
          style="width:130px"
        />
      </div>
    </div>
    <base-table
      ref="tableRef"
      :url="'/case/listWithSearch'"
      :search-param="searchObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="关联接口名称" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="goApiDetail(scope.row)"
          >{{ scope.row.apiName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用例描述" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="goCaseDetail(scope.row)"
          >{{ scope.row.caseDescription }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.createdBy }}</div>
        </template>
      </el-table-column>

      <el-table-column label="执行人" align="center" width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.username }}</div>
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" width="160">
        <template slot-scope="scope">
          <div>{{ scope.row.lastExecuteTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="执行状态" align="center" width="80">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.executeStatus == 1"
          >{{ scope.row.executeStatus | executeStatusFilter }}</el-tag>
          <el-tag
            v-else-if="scope.row.executeStatus == 2"
            type="success"
          >{{ scope.row.executeStatus | executeStatusFilter }}</el-tag>
          <el-tag
            v-else-if="scope.row.executeStatus == 3"
            type="danger"
          >{{ scope.row.executeStatus | executeStatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="执行次数" align="center" width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.executeCount }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="copyCase(scope.row)">复制用例</el-button>
            <el-button
              type="text"
              style="color:#67c23a"
              size="small"
              @click="onExecute(scope.row)"
            >执行</el-button>
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
import { executeStatusFilter } from "@/utils/filter";
import {
  deleteCases,
  createCase,
  getCaseDetail,
  getfilterMap
} from "@/api/case";
export default {
  components: { BaseTable },
  filters: {
    executeStatusFilter
  },
  data() {
    return {
      value: [],
      options: [],
      timeArray: [],
      formLabelWidth: "120px",
      apiName: "",
      searchObj: {
        caseDescription: "",
        executeStatus: "",
        projectName: "",
        apiGroup: "",
        apiMerge: ""
      },
      idList: [],
      type: "",
      typeOptions: [
        {
          name: "批量执行",
          value: "执行"
        },
        {
          name: "批量删除",
          value: "删除"
        }
      ],
      role: "",
      executeStatusOptions: [
        {
          name: "未执行",
          value: 1
        },
        {
          name: "成功",
          value: 2
        },
        {
          name: "失败",
          value: 3
        }
      ],
      apiGroup: "",
      apiGroupOptions: [],
      reqMethod: "",
      reqMethodOptions: []
    };
  },
  created() {
    this.getfilterMap();
  },
  methods: {
    handleChange(val) {
      if (val.length === 0) {
        this.searchObj.projectName = "";
        this.searchObj.apiGroup = "";
        this.searchObj.apiMerge = "";
      } else {
        this.searchObj.projectName = val[0];
        this.searchObj.apiGroup = val[1];
        this.searchObj.apiMerge = val[2];
      }
    },
    async getfilterMap() {
      try {
        const result = await getfilterMap();
        this.options = result.data.options;
      } catch (error) {
        this.$message.error(error);
      }
    },
    batchActions() {
      if (this.type === "删除") {
        this.onDelete(this.idList);
      } else {
        this.onExecute(this.idList);
      }
      this.type = "";
    },
    // 下载模板
    handleDownload() {
      import("@/utils/Export2Excel").then(excel => {
        const tHeader = [
          "用户名",
          "身份证号",
          "账号角色",
          "登入IP",
          "账号操作",
          "操作界面",
          "操作时间"
        ];
        const filterVal = [
          "username",
          "id_number",
          "role",
          "login_ip",
          "action",
          "page",
          "time"
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          return v[j];
        })
      );
    },
    goApiDetail(row) {
      this.$router.push({ path: "/api/detail", query: { id: row.id } });
    },
    goCaseDetail(row) {
      this.$router.push({ path: "/case/detail", query: { id: row.id } });
    },
    //创建用例
    createCase(row) {
      sessionStorage.removeItem("caseDetail");
      this.$router.push({ path: "/case/edit", query: { type: 0 } });
    },
    //编辑用例
    onEdit(row) {
      sessionStorage.setItem("caseDetail", JSON.stringify(row));
      this.$router.push({ path: "/case/edit", query: { type: 1 } });
    },
    //复制用例
    copyCase(row) {
      sessionStorage.setItem("caseDetail", JSON.stringify(row));
      this.$router.push({ path: "/case/edit", query: { type: 2 } });
    },
    onDelete(row) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (Array.isArray(row)) {
            this.deleteCases(row);
          } else {
            const ids = [row.id];
            this.deleteCases(ids);
          }
        })
        .catch(() => {});
    },
    handleSelectionChange(row) {
      this.idList = row.map(f => f.id);
      console.log(this.idList);
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

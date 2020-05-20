<template>
  <div class="record-list">
    <div class="header-line">操作日志</div>
    <div class="flex-box">
      <el-button icon="el-icon-download" size="small" @click="handleDownload">导出全部日志</el-button>
      <div style="text-align:right;width:100%">
        <el-select
          v-model="searchObj.user"
          size="small"
          filterable
          placeholder="请选择用户名"
          :no-data-text="'暂无数据'"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="timeArray"
          size="small"
          type="datetimerange"
          :value-format="'yyyy-MM-dd HH:mm:ss'"
          :format="'yyyy-MM-dd HH:mm:ss'"
          range-separator="至"
          start-placeholder="操作开始时间"
          end-placeholder="操作结束时间"
        />
        <el-input
          v-model="searchObj.logInfo"
          icon="el-icon-search"
          placeholder="搜索账号操作/操作界面"
          size="small"
          style="width:200px"
        />
      </div>
    </div>
    <base-table
      :url="'/operateLog/listWithSearch'"
      :search-param="searchObj"
      @tableLoaded="getTableData"
    >
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <div>{{ scope.row.username }}</div>
        </template>
      </el-table-column>
      <el-table-column label="用户编号" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.userNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账号角色" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.role | roleFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="登入IP" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.lastIp }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账号操作" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.logContent }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作界面" align="center" width="200">
        <template slot-scope="scope">
          <div>{{ scope.row.operatePath }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.createdAt }}</div>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script>
import BaseTable from "@/components/BaseTable";
import { timeFilter, roleFilter } from "@/utils/filter";
import { parseTime } from "@/utils";
import { getfilterUserName, exportAllLogs } from "@/api/operateLog";
export default {
  components: { BaseTable },
  filters: {
    timeFilter,
    roleFilter
  },
  data() {
    return {
      timeArray: [],
      searchName: "",
      searchObj: {
        user: "",
        startTime: "",
        endTime: "",
        logInfo: ""
      },
      list: [],
      options: [],
      value: ""
    };
  },
  watch: {
    timeArray(val) {
      if (!val) {
        this.searchObj.startTime = "";
        this.searchObj.endTime = "";
      } else {
        this.searchObj.startTime = val[0];
        this.searchObj.endTime = val[1];
      }
    }
  },
  created() {
    this.getfilterUserName();
  },
  methods: {
    getTableData(data) {
      this.list = data;
    },
    // 获取全部用户名的下拉筛选框
    async getfilterUserName() {
      try {
        const result = await getfilterUserName();
        if (result.data.code === "00000") {
          this.options = result.data.data.userNameOptions;
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 导出全部日志
    handleDownload() {
      import("@/utils/Export2Excel").then(excel => {
        const tHeader = [
          "用户名",
          "用户编号",
          "账号角色(1为root,0为QA)",
          "最后登录IP",
          "账号操作内容",
          "操作界面",
          "操作时间"
        ];
        const filterVal = [
          "username",
          "userNumber",
          "role",
          "lastIp",
          "logContent",
          "operatePath",
          "createdAt"
        ];
        let list = [];
        exportAllLogs().then(res => {
          list = res.data.data;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: "操作日志表"
          });
        });
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.record-list {
  .flex-box {
    display: flex;
    align-items: center;
    > button {
      margin-left: 16px;
    }
  }
}
</style>

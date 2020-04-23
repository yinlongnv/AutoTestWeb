<template>
  <div class="record-list">
    <div style="padding:16px">操作日志</div>
    <div class="flex-box">
      <el-button
        :loading="downloadLoading"
        icon="el-icon-download"
        size="small"
        @click="handleDownload"
      >批量导出日志</el-button>
      <div style="text-align:right;width:100%">
        <el-select v-model="role" placeholder="请选择账号角色" size="small" :no-data-text="'暂无数据'">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-date-picker
          v-model="timeArray"
          size="small"
          type="daterange"
          :value-format="'yyyy-MM-dd'"
          :format="'yyyy-MM-dd'"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <el-input
          v-model="searchObj.kw"
          icon="el-icon-search"
          placeholder="搜索用户名/账号操作"
          size="small"
          style="width:200px"
        />
      </div>
    </div>
    <base-table :url="'/record/list'" :search-param="searchObj">
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <div>{{ scope.row.username }}</div>
        </template>
      </el-table-column>
      <el-table-column label="身份证号">
        <template slot-scope="scope">
          <div>{{ scope.row.id_number }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账号角色">
        <template slot-scope="scope">
          <div>{{ scope.row.role }}</div>
        </template>
      </el-table-column>
      <el-table-column label="登入IP">
        <template slot-scope="scope">
          <div>{{ scope.row.login_ip }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账号操作">
        <template slot-scope="scope">
          <div>{{ scope.row.action }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作界面">
        <template slot-scope="scope">
          <div>{{ scope.row.page }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作时间">
        <template slot-scope="scope">
          <div>{{ scope.row.time }}</div>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script>
import BaseTable from "@/components/BaseTable";
import { timeFilter } from "@/utils/filter";
import { parseTime } from "@/utils";
export default {
  components: { BaseTable },
  filters: {
    timeFilter
  },
  data() {
    return {
      downloadLoading: false,
      timeArray: [],
      searchName: "",
      searchObj: {
        kw: ""
      },
      role: "",
      roleOptions: [
        // {
        //   name: '全部',
        //   value: 0
        // },
        {
          name: "root",
          value: 1
        },
        {
          name: "QA",
          value: 0
        }
      ],
      list: []
    };
  },
  methods: {
    // 批量导出
    handleDownload() {
      this.downloadLoading = true;
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
        this.downloadLoading = false;
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

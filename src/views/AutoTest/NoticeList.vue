<template>
  <div>
    <div class="header-line">通知公告</div>
    <el-row>
      <el-col :span="12">
        <el-button size="small" @click="readAll">全部设为已读</el-button>
      </el-col>
      <el-col :span="12" style="text-align:right">
        <el-date-picker
          v-model="timeArray"
          size="small"
          type="datetimerange"
          :value-format="'yyyy-MM-dd HH:mm:ss'"
          :format="'yyyy-MM-dd HH:mm:ss'"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-col>
    </el-row>
    <el-table :data="tableData" style="width: 100%;margin-top:16px" border>
      <el-table-column prop="name">
        <template slot-scope="scope">
          <div class="flex-box">
            <div :class="scope.row.isRead==='0'?'circle-red':'circle'" />
            <div
              style="margin-left:16px;cursor:pointer"
              @click="goDetail(scope.row)"
            >【消息】测试用例执行完毕，请点击公告查看详情{{ scope.row.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.createdAt }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:20px"
      v-show="pager.total > pager.size"
      ref="livePagination"
      :style="'text-align:center'"
      class="live-pagination"
      :page-size="pager.size"
      :current-page="pager.current"
      :total="pager.total"
      layout="prev, pager, next,jumper"
      @current-change="onChangePage"
    />
  </div>
</template>

<script>
import { listWithSearch, markRead, markReadAll } from "@/api/notice";
export default {
  data() {
    return {
      timeArray: [],
      timeParam: [],
      pager: {
        total: 0,
        current: 1,
        size: 10
      },
      tableData: []
    };
  },
  created() {
    this.listWithSearch(1);
  },
  watch: {
    timeArray: {
      handler(val) {
        if (val === null) {
          this.timeArray = ["", ""];
        }
        this.listWithSearch(this.pager.current);
      },
      deep: true
    }
  },
  methods: {
    async listWithSearch(current) {
      try {
        const result = await listWithSearch({
          startTime: this.timeArray[0],
          endTime: this.timeArray[1],
          page: current
        });
        this.tableData = result.data.data.tbody;
        this.pager.total = result.data.data.pageInfo.total;
      } catch (error) {
        this.$message.error(error);
      }
    },
    async onChangePage(current) {
      this.listWithSearch(current);
    },
    goDetail(row) {
      let id = row.id;
      this.$router.push({ path: "/notice/detail", query: { id } });
    },
    async readAll() {
      await markReadAll();
      this.listWithSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.el-table th,
.el-table tr:first-child {
  display: none;
}
/deep/.el-table--enable-row-transition .el-table__body td {
  border: none;
  border-bottom: 1px solid #ebeef5;
  height: 70px;
  line-height: 70px;
}
.flex-box {
  display: flex;
  align-items: center;
}
.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #999;
}
.circle-red {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
}
</style>

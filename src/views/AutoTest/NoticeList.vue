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
    <el-table
      :data="tableData"
      style="width: 100%;margin-top:16px"
      border
    >
      <el-table-column
        prop="name"
      >
        <template slot-scope="scope">
          <div class="flex-box">
            <div :class="scope.row.isRead?'circle':'circle-red'" />
            <div style="margin-left:16px" @click="goDetail(scope.row)"> 【消息】测试{{ scope.row.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        width="180"
      />
    </el-table>
    <el-pagination
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
export default {
  data() {
    return {
      timeArray: [],
      pager: {
        total: 0,
        current: 1,
        size: 10
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isRead: false
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        isRead: false
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        isRead: false
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        isRead: false
      }]
    }
  },
  methods: {
    async onChangePage(current) {
      this.onSearch(current)
      window.scrollTo({
        top: 0
        // behavior: 'smooth'
      })
    },
    goDetail() {
      this.$router.push({ path: '/notice/detail' })
    },
    readAll() {
      for (const item of this.tableData) {
        item.isRead = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-table th, .el-table tr:first-child{
	display: none;
}
/deep/.el-table--enable-row-transition .el-table__body td{
	border: none;
	border-bottom: 1px solid #EBEEF5;
}
.flex-box{
	display: flex;
	align-items: center;
}
.circle{
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: #999;
}
.circle-red{
	width: 10px;
	height: 10px;
	border-radius: 50%;
	background: red;
}

</style>

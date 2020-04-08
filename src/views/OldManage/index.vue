<template>
  <div class="old-manage">
    老人管理
    <div class="flex-box">
      <el-input v-model="searchName" placeholder="请输入老人姓名" size="small" style="width:170px" />
      <el-button type="primary" size="small" @click="searchObj.kw = searchName">搜索</el-button>
      <el-button type="primary" size="small">导出</el-button>
      <!-- <el-button type="primary" size="small">添加</el-button> -->
      <el-button type="primary" size="small">信息同步</el-button>
      <el-button type="primary" size="small">下载二维码</el-button>
      <el-button type="danger" size="small" @click="deleteAged">删除</el-button>
    </div>
    <base-table :url="'/aged/search'" :search-param="searchObj" @handleSelectionChange="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          <div>{{ scope.row.aged_id }}</div>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <div>{{ scope.row.aged_name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="50">
        <template slot-scope="scope">
          <div>{{ scope.row.sex | sexFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="年龄">
        <template slot-scope="scope">
          <div>{{ scope.row.age }}</div>
        </template>
      </el-table-column>
      <el-table-column label="联系方式">
        <template slot-scope="scope">
          <div>{{ scope.row.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="身份证号码">
        <template slot-scope="scope">
          <div>{{ scope.row.id_card_num }}</div>
        </template>
      </el-table-column>
      <el-table-column label="家庭住址">
        <template slot-scope="scope">
          <div>{{ scope.row.town_name+scope.row.community_name+scope.row.subdistrict_name+scope.row.house_num }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最后服务时间" width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.last_svc_time | timeFilter }}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="市民卡">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewCard(scope.row)">查看</el-button> -->
      <!-- <div>{{ scope.row.contactName }}</div> -->
      <!-- </template>
      </el-table-column> -->
      <!-- <el-table-column label="老人照片">
        <template slot-scope="scope"> -->
      <!-- <el-button type="text" size="small" @click="viewPhoto(scope.row)">查看</el-button> -->
      <!-- <div>{{ scope.row.contactName }}</div> -->
      <!-- </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="viewAll(scope.row)">查看统计</el-button>
          </div>

        </template>
      </el-table-column>
    </base-table>
    <old-info-dialog :visible="dialogFormVisible" :form="oldInfoObj" @visibleChange="visibleChange" />
    <chart-dialog :visible="dialogChartVisble" :chart-data="chartDataObj" @visibleChange="chartVisibleChange" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseTable from '@/components/BaseTable'
import OldInfoDialog from '@/components/OldInfoDialog'
import ChartDialog from '@/components/ChartDialog'
import { sexFilter, timeFilter } from '@/utils/filter'
import { deleteAgedInfo, getAgedStatistic } from '@/api/user'
export default {
  components: { BaseTable, OldInfoDialog, ChartDialog },
  filters: {
    sexFilter,
    timeFilter
  },
  data() {
    return {
      dialogChartVisble: false,
      dialogFormVisible: false,
      oldInfoObj: {},
      chartDataObj: {},
      searchName: '',
      searchObj: {
        kw: ''
      },
      agedIdList: []
    }
  },
  computed: {
    ...mapGetters([
      'communityList'
    ])
  },
  methods: {
    visibleChange(val) {
      this.dialogFormVisible = val
    },
    chartVisibleChange(val) {
      this.dialogChartVisble = val
    },
    viewCard() {

    },
    viewPhoto() {

    },
    edit(row) {
      this.oldInfoObj = row
      this.dialogFormVisible = true
    },
    async viewAll(row) {
      const result = await getAgedStatistic({ 'id': row.aged_id })
      this.chartDataObj = result.data.data
      console.log(result)

      this.dialogChartVisble = true
    },
    deleteAged() {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteAgedInfo()
        })
        .catch(error => {
          this.$message(error)
        })
    },
    async deleteAgedInfo() {
      const result = await deleteAgedInfo({ 'aged_id_list': this.agedIdList })
      if (result.data.retcode === 0) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }
    },
    handleSelectionChange(row) {
      this.agedIdList = row.map(f => f.aged_id)
      console.log(row)
      console.log(this.agedIdList)
    }
  }
}
</script>

<style lang="scss" scoped>
.old-manage{
  .flex-box{
    display: flex;
    align-items: center;
    >button{
      margin-left: 16px;
    }
  }
}

</style>

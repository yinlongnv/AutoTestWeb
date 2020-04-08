<template>
  <div class="service-manage">
    服务人员
    <div class="flex-box">
      <el-input v-model="searchName" placeholder="请输入服务人员姓名" size="small" style="width:170px" />
      <el-button type="primary" size="small" @click="searchObj.kw = searchName">搜索</el-button>
      <el-button type="primary" size="small">导出</el-button>
      <el-button type="primary" size="small">导入</el-button>
      <el-button type="primary" size="small" @click="addSvc">添加</el-button>
      <el-button type="danger" size="small" @click="deleteSvc">删除</el-button>
    </div>
    <base-table :url="'/svcstaff/search'" :search-param="searchObj" @handleSelectionChange="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="序号">
        <template slot-scope="scope">
          <div>{{ scope.row.svc_staff_id }}</div>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <div>{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="联系方式">
        <template slot-scope="scope">
          <div>{{ scope.row.phone }}</div>
        </template>
      </el-table-column>
      <el-table-column label="本月服务次数">
        <template slot-scope="scope">
          <div>{{ scope.row.cur_month_svc_cnt }}次正常/{{ scope.row.cur_month_svc_abn_cnt }}次异常</div>
          <el-button type="text" size="small" @click="view(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="最后一次服务时间">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="平均评分">
        <template slot-scope="scope">
          <div>{{ scope.row.score }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div>{{ scope.row.status | statusFilter }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="view(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="forbid(scope.row)">{{ scope.row.status===1?'禁用':'启用' }}</el-button>
            <el-button type="text" size="small" @click="reset(scope.row)">重置密码</el-button>
          </div>
        </template>
      </el-table-column>
    </base-table>
    <svc-info-dialog v-if="dialogFormVisible" :visible="dialogFormVisible" :svc-id="svcId" @visibleChange="visibleChange" />

  </div>
</template>

<script>
import { deleteSvcInfo, svcEnable } from '@/api/user'
import BaseTable from '@/components/BaseTable'
import SvcInfoDialog from '@/components/SvcInfoDialog'

export default {
  components: { BaseTable, SvcInfoDialog },
  filters: {
    statusFilter(val) {
      if (val === 1) {
        return '正常'
      } else {
        return '禁用'
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      svcId: 0,
      svcIdList: [],
      searchName: '',
      searchObj: {
        kw: ''
      }
    }
  },
  methods: {

    visibleChange(val) {
      this.dialogFormVisible = val
    },
    deleteSvc() {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteSvcInfo()
        })
        .catch(error => {
          this.$message(error)
        })
    },
    async deleteSvcInfo() {
      const result = await deleteSvcInfo({ 'svc_staff_id_list': this.svcIdList })
      if (result.data.retcode === 0) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }
    },
    handleSelectionChange(row) {
      this.svcIdList = row.map(f => f.svc_staff_id)
    },
    addSvc() {
      this.dialogFormVisible = true
      this.svcId = 0
    },
    async view(row) {
      this.dialogFormVisible = true

      this.svcId = row.svc_staff_id
      // const result = await getSvcDetail({ 'id': row.svc_staff_id })
      // this.svcInfoObj = result.data.data
      // console.log(this.svcInfoObj)
    },
    async forbid(row) {
      const result = await svcEnable({ 'svc_staff_id': row.svc_staff_id, 'enable': row.status })
      if (result.data.retcode === 0) {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }
    },
    reset() {

    }
  }

}
</script>

<style lang="scss" scoped>
.service-manage{
  .flex-box{
    display: flex;
    align-items: center;
    >button{
      margin-left: 16px;
    }
  }
}

</style>

<template>
  <div class="service-history">
    服务历史
    <div class="flex-box">
      <el-date-picker
        v-model="timeArray"
        size="small"
        type="daterange"
        range-separator="至"
        :value-format="'yyyy-MM-dd hh:mm:ss'"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-select v-model="searchChoice.svc_item_id" placeholder="服务项目" size="small">
        <el-option
          v-for="item in projectList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="searchChoice.status" placeholder="状态" size="small">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" size="small" @click="searchObj = {...searchChoice}">搜索</el-button>
      <el-button type="primary" size="small">导出</el-button>
    </div>
    <base-table :url="'/svcrecord/search'" :search-param="searchObj">
      <el-table-column label="序号">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="服务人员">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="服务对象">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="开始时间">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="结束时间">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="服务项目">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="状态">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="view(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </base-table>

  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'
import { getSvcList } from '@/api/user'
export default {
  components: { BaseTable },
  data() {
    return {
      searchChoice: {
        begin: '',
        end: '',
        status: 0,
        svc_item_id: 0
      },
      searchObj: {},
      timeArray: [],
      projectList: [{ value: 0, label: '全部' }],
      statusList: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 2,
          label: '正常'
        },
        {
          value: 3,
          label: '异常'
        }
      ]
    }
  },
  watch: {
    timeArray(val) {
      this.searchChoice.begin = val[0]
      this.searchChoice.end = val[1]
    }

  },
  created() {
    this.searchObj = this.searchChoice
    this.getSvcList()
  },
  methods: {
    async getSvcList() {
      const result = await getSvcList()
      const svcList = result.data.data.svc_item_list || []
      svcList.forEach(f => {
        this.projectList.push({ value: f.svc_item_id, label: f.name })
      })
    },
    view() {

    }
  }

}
</script>

<style lang="scss" scoped>
.service-history{
  .flex-box{
    display: flex;
    align-items: center;
    >button{
      margin-left: 16px;
    }
  }
}

</style>

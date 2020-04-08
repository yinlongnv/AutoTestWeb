<template>
  <div class="service-history">
    服务项目管理
    <div class="flex-box">
      <el-input v-model="searchName" placeholder="项目名" size="small" style="width:170px" />
      <el-button type="primary" size="small" @click="searchObj.name = searchName">搜索</el-button>
      <el-button type="primary" size="small">添加</el-button>
      <el-button type="primary" size="small">导出</el-button>
    </div>
    <base-table :url="'/svcitem/search'" :search-param="searchObj">
      <el-table-column label="序号">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="项目名称">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="近一个月被选择的次数">
        <!-- <template slot-scope="scope"> -->
        <!-- <div>{{ scope.row.contactName }}</div> -->
        <!-- </template> -->
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="mini" @click="view(scope.row)">查看统计</el-button>
            <el-button type="text" size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="deleteData(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/components/BaseTable'
export default {
  components: { BaseTable },
  data() {
    return {
      searchObj: { name: '' },
      searchName: '',
      rangetime: [],
      projectList: [
        {
          value: 1,
          label: '服务项目1'
        }
      ],
      statusList: [
        {
          value: 1,
          label: '状态1'
        }
      ]
    }
  },
  methods: {
    view() {

    },
    edit() {

    },
    deleteData() {

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

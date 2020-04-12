<template>
  <div class="old-manage">
    <div style="padding:16px">用例管理</div>
    <div class="flex-box">
      <el-button type="primary" size="small" @click="createCase">创建用例</el-button>
      <el-button
        :loading="downloadLoading"
        icon="el-icon-download"
        size="small"
        @click="handleDownload"
      >下载模板</el-button>
      <el-button
        :loading="downloadLoading"
        icon="el-icon-upload2"
        size="small"
        @click="handleDownload"
      >批量导入</el-button>
      <el-button
        :loading="downloadLoading"
        icon="el-icon-delete"
        size="small"
        @click="onDelete(idList)"
      >批量删除</el-button>

      <div style="text-align:right;width:100%">
        <el-autocomplete
          v-model="apiGroup"
          style="width:100px;margin-left:16px"
          size="small"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="所属业务"
          @select="handleSelect"
        />

        <el-autocomplete
          v-model="reqMethod"
          style="width:100px;margin-left:16px"
          size="small"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请求方法"
          @select="handleSelect"
        />

        <el-input
          v-model="searchObj.apiName"
          icon="el-icon-search"
          placeholder="搜索用例名称"
          size="small"
          style="width:130px"
        />
      </div>
    </div>
    <base-table
      ref="tableRef"
      :url="'/api/list'"
      :search-param="searchObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="所关联用例名称" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.apiName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="用例描述">
        <template slot-scope="scope">
          <div>{{ scope.row.caseDescription }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人">
        <template slot-scope="scope">
          <div>{{ scope.row.createdBy }}</div>
        </template>
      </el-table-column>

      <el-table-column label="执行人">
        <template slot-scope="scope">
          <div>{{ scope.row.username }}</div>
        </template>
      </el-table-column>
      <el-table-column label="执行时间">
        <template slot-scope="scope">
          <div>{{ scope.row.lastExecuteTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="执行状态">
        <template slot-scope="scope">
          <div>{{ scope.row.caseStatus }}</div>
        </template>
      </el-table-column>
      <el-table-column label="执行次数">
        <template slot-scope="scope">
          <div>{{ scope.row.executeCount }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
            <!-- <el-button type="text" size="small" @click="createCase(scope.row)">创建用例</el-button> -->

            <el-button
              type="text"
              size="small"
              @click="createCase(scope.row)"
            >复制</el-button>
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
import BaseTable from '@/components/BaseTable'
import { statusFilter, roleFilter } from '@/utils/filter'
import { deleteCases } from '@/api/user'
export default {
  components: { BaseTable },
  filters: {
    statusFilter,
    roleFilter
  },
  data() {
    return {
      downloadLoading: false,
      rules: {
        name: [
          { required: true, message: '请输入正确的新密码', trigger: 'blur' }
        ]
      },
      timeArray: [],
      form: {
        password: ''
      },
      formLabelWidth: '120px',
      oldInfoObj: {},
      chartDataObj: {},
      apiName: '',
      searchObj: {
        apiName: ''
      },
      idList: [],
      type: '',
      typeOptions: [
        {
          name: '全部',
          value: 0
        },
        {
          name: '所属业务',
          value: 1
        },
        {
          name: '请求方法',
          value: 2
        }
      ],
      role: '',
      roleOptions: [],
      apiGroup: '',
      apiGroupOptions: [],
      reqMethod: '',
      reqMethodOptions: []
    }
  },
  created() {
    this.restaurants = this.loadAll()
  },
  methods: {
    // 顶部操作
    // 创建用例
    createCase(row) {
      if (row) {
        sessionStorage.setItem('apiDetail', JSON.stringify(row))
      }
      this.$router.push({ path: '/case/edit', query: { type: 0 }})
    },
    // 下载模板
    handleDownload() {
      this.downloadLoading = true
      import('@/utils/Export2Excel').then(excel => {
        const tHeader = ['用户名', '身份证号', '账号角色', '登入IP', '账号操作', '操作界面', '操作时间']
        const filterVal = ['username', 'id_number', 'role', 'login_ip', 'action', 'page', 'time']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    // 搜索+选择
    handleSelect() {

    },
    loadAll() {
      return [
        { 'value': '1' },
        { 'value': '2' },
        { 'value': '3' }
      ]
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 列表操作
    goDetail(row) {
      this.$router.push({ path: '/user/detail' })
    },
    onEdit(row) {
      sessionStorage.setItem('createCase', JSON.stringify(row))
      this.$router.push({ path: '/case/edit', query: { type: 1 }})
    },
    onDelete(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (Array.isArray(row)) {
            this.deleteCases(row)
          } else {
            const ids = [row.id]
            this.deleteCases(ids)
          }
        })
        .catch(() => {})
    },
    handleSelectionChange(row) {
      this.idList = row.map(f => f.id)
      console.log(this.idList)
    },
    // 接口调用
    async deleteCases(userIds) {
      try {
        await deleteCases({ userIds: userIds })
        this.$refs.tableRef.onSearch()
      } catch (error) {
        this.$message.error(error)
      }
    }

  }
}
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

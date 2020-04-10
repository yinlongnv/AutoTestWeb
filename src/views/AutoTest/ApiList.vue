<template>
  <div class="old-manage">
    <div style="padding:16px">接口管理</div>
    <div class="flex-box">
      <el-button type="primary" size="small" icon="el-icon-folder-add" @click="createApi">创建接口</el-button>
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
        @click="deleteItem"
      >批量删除</el-button>

      <div style="text-align:right;width:100%">
        <!-- <el-select
          v-model="type"
          style="width:100px;margin-left:16px"
          placeholder="筛选查询"
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
        </el-select> -->

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
          v-model="apiName"
          icon="el-icon-search"
          placeholder="搜索接口名称"
          size="small"
          style="width:130px"
        />
        <el-button type="primary" size="small" @click="searchObj.apiName = apiName">搜索</el-button>
      </div>
    </div>
    <base-table
      ref="tableRef"
      :url="'/api/list'"
      :search-param="searchObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="接口路径" width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.apiPath }}</div>
        </template>
      </el-table-column>
      <el-table-column label="接口名称" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.apiName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="请求方法" width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.reqMethod }}</div>
        </template>
      </el-table-column>

      <el-table-column label="所属业务" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.projectName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="所属分组" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.apiGroup }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.createdBy }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="createCase(scope.row)">创建用例</el-button>
            <el-button
              type="text"
              size="small"
              @click="createApi(scope.row)"
            >复制</el-button>
            <el-button
              type="text"
              style="color:#f56c6c"
              size="small"
              @click="deleteItem(scope.row)"
            >删除</el-button>
          </div>

        </template>
      </el-table-column>
    </base-table>
    <el-dialog title="修改密码" :visible.sync="dialogPwdVisible" @close="closeDialog">
      <el-form ref="pwdRef" :model="form" :rules="rules">
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.password" style="width:300px" placeholder="请输入新密码" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPwdVisible = false">取 消</el-button>
        <el-button type="primary" @click="confrimPwd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseTable from '@/components/BaseTable'
import { statusFilter, roleFilter } from '@/utils/filter'
import { deleteItems, disableItems, enableItems } from '@/api/user'
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
      dialogPwdVisible: false,
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
  computed: {
    ...mapGetters(['communityList'])
  },
  created() {
    this.restaurants = this.loadAll()
  },
  methods: {
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
    batchActions() {
      if (this.type === '禁用') {
        this.disableItem()
      } else if (this.type === '删除') {
        this.deleteItem(this.idList)
      } else {
        this.enableItem()
      }
      this.type = ''
    },
    goDetail(row) {
      this.$router.push({ path: '/user/detail' })
    },

    editItem(row) {
      sessionStorage.setItem('apiDetail', JSON.stringify(row))
      this.$router.push({ path: '/api/edit', query: { type: 1 }})
    },
    disableItem(row) {
      this.$confirm('确定要禁用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (Array.isArray(row)) {
            this.disableItems(row)
          } else {
            const ids = [row.id]
            this.disableItems(ids)
          }
        })
        .catch(() => {})
    },
    deleteItem(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (Array.isArray(row)) {
            this.deleteItems(row)
          } else {
            const ids = [row.id]
            this.deleteItems(ids)
          }
        })
        .catch(() => {})
    },
    enableItem(row) {
      if (Array.isArray(row)) {
        this.deleteItems(row)
      } else {
        const ids = [row.id]
        this.deleteItems(ids)
      }
    },
    createApi(row) {
      if (row) {
        sessionStorage.setItem('apiDetail', JSON.stringify(row))
      }
      this.$router.push({ path: '/api/edit', query: { type: 0 }})
    },
    createCase() {
      this.dialogPwdVisible = true
    },
    confrimPwd() {
      this.$refs['pwdRef'].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog() {
      this.$refs['pwdRef'].resetFields()
    },
    async deleteItems(userIds) {
      try {
        await deleteItems({ userIds: userIds })
        this.$refs.tableRef.onSearch()
      } catch (error) {
        this.$message.error(error)
      }
    },
    async enableItems(userIds) {
      try {
        await enableItems({ userIds: userIds })
        this.$refs.tableRef.onSearch()
      } catch (error) {
        this.$message.error(error)
      }
    },
    async disableItems(userIds) {
      try {
        await disableItems({ userIds: userIds })
        this.$refs.tableRef.onSearch()
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleSelectionChange(row) {
      this.idList = row.map(f => f.id)
      console.log(this.idList)
    },
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

<template>
  <div class="old-manage">
    <div style="padding:16px">用户列表</div>
    <div class="flex-box">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-folder-add"
        @click="createAccount"
      >创建账号</el-button>
      <el-select v-model="type" style="width:150px;margin-left:16px" placeholder="批量管理" size="small" :no-data-text="'暂无数据'">
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <div style="text-align:right;width:100%">
        <!-- <el-button type="danger" size="small" @click="deleteAged">删除</el-button> -->
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
          v-model="searchName"
          icon="el-icon-search"
          placeholder="搜索用户姓名/账号名称"
          size="small"
          style="width:200px"
        />
      <!-- <el-button type="primary" size="small" @click="searchObj.kw = searchName">搜索</el-button> -->
      </div>

    </div>
    <base-table :url="'/aged/search'" :search-param="searchObj" @handleSelectionChange="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column label="用户名" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goDetail(scope.row)">{{ scope.row.username }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="用户编号" width="100">
        <template slot-scope="scope">
          <div>{{ scope.row.user_number }}</div>
        </template>
      </el-table-column>
      <el-table-column label="账号状态" width="100">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.status | sexFilter }}</el-tag>
          <!-- <el-tag type="warning">{{ scope.row.sex | sexFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="账号角色" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.role }}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建账号" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.created_by }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最后登录IP" width="120">
        <template slot-scope="scope">
          <div>{{ scope.row.last_ip }}</div>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" width="180">
        <template slot-scope="scope">
          <div>{{ scope.row.last_login }}</div>
        </template>
      </el-table-column>
      <el-table-column label="登录次数" width="80">
        <template slot-scope="scope">
          <div>{{ scope.row.login_count }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <div style="display:flex">
            <el-button type="text" size="small" @click="editItem(scope.row)">编辑</el-button>
            <el-button type="text" style="color:#e6a23c" size="small" @click="disableItem(scope.row)">禁用</el-button>
            <!-- <el-button type="text" style="color:#67c23a" size="small" @click="viewAll(scope.row)">启用</el-button> -->
            <el-button type="text" size="small" @click="changePwd(scope.row)">修改密码</el-button>
            <el-button type="text" style="color:#f56c6c" size="small" @click="deleteItem(scope.row)">删除</el-button>
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
import { sexFilter, timeFilter } from '@/utils/filter'
import { deleteAgedInfo, getAgedStatistic } from '@/api/user'
export default {
  components: { BaseTable },
  filters: {
    sexFilter,
    timeFilter
  },
  data() {
    return {
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
      searchName: '',
      searchObj: {
        kw: ''
      },
      agedIdList: [],
      type: '',
      typeOptions: [
        {
          name: '批量下线',
          value: 1
        },
        {
          name: '批量上线',
          value: 2
        },
        {
          name: '批量删除',
          value: 3
        }
      ],
      role: '',
      roleOptions: []

    }
  },
  computed: {
    ...mapGetters([
      'communityList'
    ])
  },
  methods: {
    goDetail(row) {
      this.$router.push({ path: '/user/detail' })
    },

    editItem(row) {
      this.$router.push({ path: '/user/edit', query: { type: 1 }})
    },
    disableItem(row) {
      this.$confirm('确定要禁用吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    },
    deleteItem(row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      }).catch(() => {
      })
    },
    createAccount() {
      this.$router.push({ path: '/user/edit', query: { type: 0 }})
    },
    changePwd() {
      this.dialogPwdVisible = true
    },
    confrimPwd() {
      this.$refs['pwdRef'].validate((valid) => {
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
    async viewAll(row) {
      const result = await getAgedStatistic({ 'id': row.aged_id })
      this.chartDataObj = result.data.data
      console.log(result)
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

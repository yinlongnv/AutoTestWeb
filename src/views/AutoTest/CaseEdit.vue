<template>
  <div class="old-info-container">
    <div>{{ editStatus === 1?'编辑用例':'创建用例' }}</div>
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item prop="apiId" label="关联接口" :label-width="formLabelWidth">
        <el-autocomplete
          v-model="form.apiId"
          :style="inputWidth"
          size="small"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入关联接口"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item prop="caseContent" label="用例内容" :label-width="formLabelWidth">
        <el-input v-model="form.caseContent" type="textarea" rows="3" :style="inputWidth" size="small" placeholder="请输入用例内容" />
      </el-form-item>
      <el-form-item prop="caseDescription" label="用例描述" :label-width="formLabelWidth">
        <el-input v-model="form.caseDescription" type="textarea" rows="3" :style="inputWidth" size="small" placeholder="请输入用例描述" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="confirmEdit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { timeFilter } from '@/utils/filter'
import { createUser } from '@/api/user'
const FORM = {
  apiId: '',
  caseContent: '',
  caseDescription: ''
}
export default {
  filters: { timeFilter },
  data() {
    return {
      restaurants: [],
      editStatus: Number(this.$route.query.type),
      form: FORM,
      rules: {
        apiId: [
          { required: true, message: '请输入正确关联接口id', trigger: 'blur' }
        ],
        caseContent: [
          { required: true, message: '请输入正确的用例内容', trigger: 'blur' }
        ],
        caseDescription: [
          { required: true, message: '请输入正确的用例描述', trigger: 'blur' }
        ]
      },
      inputWidth: 'width:460px',
      formLabelWidth: '120px',
      communityList: [],
      subdistrictList: []
    }
  },
  created() {
    // this.editStatus = Boolean(this.$route.query.type)
    console.log(this.$route.query.type, this.editStatus)
    this.form = JSON.parse(sessionStorage.getItem('caseDetail')) || FORM
    this.restaurants = this.loadAll()
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll() {
      return [
        { 'value': '1' },
        { 'value': '2' },
        { 'value': '3' }

      ]
    },
    handleSelect(item) {
      console.log(item)
    },
    closeDialog() {
      this.$refs['ruleForm'].resetFields()
    },
    selectRoles(val) {
      console.log(val)
      console.log(this.role)
    },
    goBack() {
      this.$router.go(-1)
      sessionStorage.removeItem('caseDetail')
    },
    confirmEdit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.createAccount()
          sessionStorage.removeItem('caseDetail')
        } else {
          return false
        }
      })
    },
    async createAccount() {
      await createUser({ ...this.form })
      this.$message({
        type: 'success',
        message: '创建成功'
      })
      this.$router.push({ path: '/user/list' })
    }

  }
}
</script>

<style lang="scss" scoped>
.old-info-container {
  .order {
    width: 120px;
    text-align: right;
    color: #606266;
    padding-right: 12px;
    font-weight: bold;
    line-height: 40px;
  }
  /deep/.el-dialog__body {
    padding: 10px 20px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    width: 128px;
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 98px;
    height: 118px;
    line-height: 128px;
    text-align: center;
    border: 1px dashed;
  }
  .avatar {
    width: 108px;
    height: 128px;
    display: block;
  }
}
</style>

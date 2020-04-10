<template>
  <div class="old-info-container">
    <div>{{ editStatus === 1?'编辑接口':'创建接口' }}</div>
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item prop="baseUrl" label="环境域名" :label-width="formLabelWidth">
        <el-autocomplete
          v-model="form.baseUrl"
          :style="inputWidth"
          size="small"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入环境域名"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item prop="reqMethod" label="请求方法" :label-width="formLabelWidth">
        <el-autocomplete
          v-model="form.reqMethod"
          :style="inputWidth"
          size="small"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入请求方法"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item prop="apiPath" label="接口路径" :label-width="formLabelWidth">
        <el-input v-model="form.apiPath" :style="inputWidth" size="small" placeholder="请输入接口路径" />
      </el-form-item>
      <el-form-item label="接口名称" :label-width="formLabelWidth">
        <el-input v-model="form.apiName" :style="inputWidth" size="small" placeholder="请输入接口名称" />
      </el-form-item>
      <el-form-item label="接口描述" :label-width="formLabelWidth">
        <el-input v-model="form.apiDescription" :style="inputWidth" size="small" placeholder="请输入接口描述" />
      </el-form-item>
      <el-form-item prop="projectName" label="所属业务" :label-width="formLabelWidth">
        <el-autocomplete
          v-model="form.projectName"
          :style="inputWidth"
          size="small"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入所属业务"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item prop="apiGroup" label="所属分组" :label-width="formLabelWidth">
        <el-autocomplete
          v-model="form.apiGroup"
          :style="inputWidth"
          size="small"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入所属分组"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item prop="reqHeaders" label="请求头" :label-width="formLabelWidth">
        <el-input v-model="form.reqHeaders" type="textarea" rows="3" :style="inputWidth" size="small" placeholder="请输入请求头" />
      </el-form-item>
      <el-form-item prop="reqBody" label="请求体" :label-width="formLabelWidth">
        <el-input v-model="form.reqHeaders" type="textarea" rows="3" :style="inputWidth" size="small" placeholder="请输入请求体" />
      </el-form-item>
      <el-form-item prop="apiResponse" label="响应信息" :label-width="formLabelWidth">
        <el-input v-model="form.apiResponse" type="textarea" rows="3" :style="inputWidth" size="small" placeholder="请输入响应信息" />
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
  userName: '',
  idNumber: '',
  phoneNumber: '',
  email: '',
  role: '',
  password: ''
}
export default {
  filters: { timeFilter },
  data() {
    return {
      restaurants: [],
      editStatus: Number(this.$route.query.type),
      form: FORM,
      rules: {
        baseUrl: [
          { required: true, message: '请输入正确的环境域名', trigger: 'blur' }
        ],
        reqMethod: [
          { required: true, message: '请输入正确的请求方法', trigger: 'blur' }
        ],
        apiPath: [
          { required: true, message: '请输入正确的接口路径', trigger: 'blur' }
        ],
        reqHeaders: [
          { required: true, message: '请输入正确的请求头', trigger: 'blur' }
        ],
        reqBody: [
          { required: true, message: '请输入正确的请求体', trigger: 'blur' }
        ],
        apiResponse: [
          { required: true, message: '请输入正确的响应信息', trigger: 'blur' }
        ]
      },
      options: [
        {
          label: 'root',
          value: 1
        },
        {
          label: 'qa',
          value: 2
        }
      ],
      inputWidth: 'width:460px',
      imageUrl: '',
      formLabelWidth: '120px',
      communityList: [],
      subdistrictList: []
    }
  },
  created() {
    // this.editStatus = Boolean(this.$route.query.type)
    console.log(this.$route.query.type, this.editStatus)
    this.form = JSON.parse(sessionStorage.getItem('apiDetail')) || FORM
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
      sessionStorage.removeItem('apiDetail')
    },
    confirmEdit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.createAccount()
          sessionStorage.removeItem('apiDetail')
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
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    selectCommunity(val) {},
    selectSubdistrict(val) {}
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

<template>
  <div class="old-info-container">
    <el-dialog title="编辑账号" :visible.sync="dialogVisible" width="650px" @close="closeDialog">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item prop="username" label="用户姓名：" :label-width="formLabelWidth">
          <el-input v-model="form.username" :style="inputWidth" size="small" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="身份证号：" :label-width="formLabelWidth">
          <el-input v-model="form.id_number" :style="inputWidth" size="small" placeholder="请输入真实身份证号" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone_number" :style="inputWidth" size="small" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱地址" :label-width="formLabelWidth">
          <el-input v-model="form.email" :style="inputWidth" size="small" placeholder="请输入邮箱地址" />
        </el-form-item>
        <el-form-item prop="accountname" label="账号名称" :label-width="formLabelWidth">
          <el-input v-model="form.accountname" :style="inputWidth" size="small" placeholder="请输入账号名称，字数限制10个字" />
        </el-form-item>
        <el-form-item prop="role" label="账号角色" :label-width="formLabelWidth">
          <el-select v-model="form.role" :style="inputWidth" multiple placeholder="请选择账号角色" @change="selectRoles">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" :label-width="formLabelWidth">
          <el-select v-model="form.community_name" style="width:150px" placeholder="请选择一级部门" size="small" :no-data-text="'暂无数据'" @change="selectCommunity">
            <el-option
              v-for="item in communityList"
              :key="item.community_id"
              :label="item.name"
              :value="item.community_id"
            />
          </el-select>
          <el-select v-model="form.subdistrict_name" style="width:150px" placeholder="请选择二级部门" size="small" :no-data-text="'暂无数据'" @change="selectSubdistrict">
            <el-option
              v-for="item in subdistrictList"
              :key="item.subdistrict_id"
              :label="item.name"
              :value="item.subdistrict_id"
            />
          </el-select>
          <el-select v-model="form.subdistrict_name" style="width:150px" placeholder="请选择三级部门" size="small" :no-data-text="'暂无数据'" @change="selectSubdistrict">
            <el-option
              v-for="item in subdistrictList"
              :key="item.subdistrict_id"
              :label="item.name"
              :value="item.subdistrict_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth">
          <el-input v-model="form.phone" :style="inputWidth" size="small" placeholder="请输入账号密码，6-20位，需含字母、数字、符号" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { timeFilter } from '@/utils/filter'
import { getCommunityList, getSudistrictLit } from '@/api/user'

export default {
  filters: { timeFilter },
  props: {
    visible: Boolean,
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      rules: {
        username: [
          { required: true, message: '请输入正确的用户姓名', trigger: 'blur' }
        ],
        accountname: [
          { required: true, message: '请输入正确的账号名称', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择正确的账号角色', trigger: 'blur' }
        ]
      },
      options: [
        {
          label: '综合管理员',
          value: 1
        },
        {
          label: '资源管理员',
          value: 2
        }
      ],
      inputWidth: 'width:460px',
      imageUrl: '',
      formLabelWidth: '120px',
      dialogVisible: this.visible,
      communityList: [],
      subdistrictList: []
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
    },
    dialogVisible(newVal) {
      this.$emit('visibleChange', newVal)
    }
  },
  created() {
    this.getCommunityList()
  },
  methods: {
    closeDialog() {
      this.$refs['ruleForm'].resetFields()
    },
    selectRoles(val) {
      console.log(val)
      console.log(this.role)
    },
    async confirmEdit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    //   const result = await editAgedInfo({ ...this.form, name: this.form.username })
    //   if (result.data.retcode === 0) {
    //     this.$message({
    //       type: 'success',
    //       message: '编辑成功'
    //     })
    //   }
    },
    async getCommunityList() {
      const result = await getCommunityList()
      this.communityList = result.data.data.community_list
    },
    async getSudistrictLit(communityId) {
      const result = await getSudistrictLit({ 'community_id': communityId })
      this.subdistrictList = result.data.data.subdistrict_list
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
    selectCommunity(val) {

    },
    selectSubdistrict(val) {
    }
  }

}
</script>

<style lang="scss" scoped>
.old-info-container{
  .order{
    width: 120px;
    text-align: right;
    color: #606266;
    padding-right: 12px;
    font-weight: bold;
    line-height: 40px;
  }
  /deep/.el-dialog__body{
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
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 98px;
    height: 118px;
    line-height: 128px;
    text-align: center;
    border:1px dashed;
  }
  .avatar {
    width: 108px;
    height: 128px;
    display: block;
  }
}
</style>

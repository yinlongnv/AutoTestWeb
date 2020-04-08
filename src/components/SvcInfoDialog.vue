<template>
  <div class="svc-info-container">
    <el-dialog :visible.sync="dialogVisible" width="650px" @close="closeDialog">
      <el-form ref="formRef" :model="form">
        <el-form-item label="序号：" :label-width="formLabelWidth">
          <el-input v-model="form.svc_staff_id" style="width:100px" size="small" />
        </el-form-item>
        <el-row type="flex">
          <el-col :span="7">
            <el-form-item label="姓名：" :label-width="formLabelWidth">
              <el-input v-model="form.name" style="width:100px" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="性别：" :label-width="formLabelWidth">
              <el-select v-model="form.sex" placeholder="请选择" size="small">
                <el-option :key="1" :label="'男'" :value="1" />
                <el-option :key="2" :label="'女'" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="年龄：" :label-width="formLabelWidth">
              <el-input v-model="form.age" style="width:100px" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出身年月：" :label-width="formLabelWidth">
              <el-input v-model="form.birth" style="width:105px" size="small" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="联系方式：" :label-width="formLabelWidth">
          <el-input v-model="form.phone" style="width:285px" size="small" />
        </el-form-item>
        <el-form-item label="身份证号：" :label-width="formLabelWidth">
          <el-input v-model="form.id_card_num" style="width:285px" size="small" />
        </el-form-item>
        <el-form-item label="服务社区：" :label-width="formLabelWidth">
          <el-select v-model="selectedList" multiple placeholder="请选择服务社区" @change="selectCommunity">
            <el-option
              v-for="item in communityList"
              :key="item.community_id"
              :label="item.name"
              :value="item.community_id"
            />
          </el-select>
          <!-- <el-select v-model="form.community_name" placeholder="全部社区" size="small" :no-data-text="'暂无数据'" @change="selectCommunity">
            <el-option
              v-for="item in communityList"
              :key="item.community_id"
              :label="item.name"
              :value="item.community_id"
            />
          </el-select>
          <el-select v-model="form.subdistrict_name" placeholder="全部小区" size="small" :no-data-text="'暂无数据'" @change="selectSubdistrict">
            <el-option
              v-for="item in subdistrictList"
              :key="item.subdistrict_id"
              :label="item.name"
              :value="item.subdistrict_id"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="家庭地址：" :label-width="formLabelWidth">
          <el-input v-model="form.address" style="width:285px" size="small" />
        </el-form-item>
        <el-form-item style="position:absolute;right:90px;top:60px;text-align:center ">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <div>点击上传</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { timeFilter } from '@/utils/filter'
import { editSvcInfo, getCommunityList, getSvcDetail, addSvcInfo } from '@/api/user'
// const formDefault ={

// }
export default {
  filters: { timeFilter },
  props: {
    visible: Boolean,
    svcId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      imageUrl: '',
      formLabelWidth: '100px',
      dialogVisible: this.visible,
      communityList: [],
      subdistrictList: [],
      form: {},
      selectedList: []
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
    },
    dialogVisible(newVal) {
      this.$emit('visibleChange', newVal)
    },
    svcId() {
    }
  },
  created() {
    this.initDialog()
  },
  methods: {
    confirmAddEdit() {
      console.log(this.form)

      if (this.svcId === 0) {
        this.addSvcInfo()
      } else {
        this.editSvcInfo()
      }
    },
    async editSvcInfo() {
      this.form.community_list = this.selectedList
      const result = await editSvcInfo({ ...this.form })

      if (result.data.retcode === 0) {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
      }
    },
    async addSvcInfo() {
      // console.log(this.form)
      this.form.community_list = this.selectedList
      const result = await addSvcInfo({ ...this.form })
      if (result.data.retcode === 0) {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
      }
    },
    async initDialog() {
      const result = await getCommunityList()
      this.communityList = result.data.data.community_list
      // console.log(this.svcId)
      if (this.svcId) {
        this.getSvcDetail()
        const communityList = this.form.community_list || []
        this.selectedList = communityList.map(f => f.community_id)
      } else {
        this.form = {}
        this.selectedList = []
      }
    },
    async getSvcDetail() {
      const result = await getSvcDetail({ 'id': this.svcId })
      this.form = result.data.data
      this.form.birth = this.form.id_card_num.slice(6, 14)
      // sessionStorage.setItem('formData', JSON.stringify(this.form))
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
      console.log(val
      )
    },
    selectSubdistrict(val) {
    },
    closeDialog() {
      // if (this.$refs.formRef) {
      //   this.$refs.formRef.resetFields()
      //   console.log('aaa')
      // }
    }
  }

}
</script>

<style lang="scss" scoped>
.svc-info-container{
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

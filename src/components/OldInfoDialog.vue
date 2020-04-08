<template>
  <div class="old-info-container">
    <el-dialog :visible.sync="dialogVisible" width="650px">
      <el-form :model="form">
        <el-form-item label="序号：" :label-width="formLabelWidth">
          {{ form.aged_id }}
        </el-form-item>
        <!-- <div class="order">序号：<span></span></div> -->
        <el-row type="flex">
          <el-col :span="7">
            <el-form-item label="姓名：" :label-width="formLabelWidth">
              <el-input v-model="form.aged_name" style="width:100px" size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="性别：" :label-width="formLabelWidth">
              <el-select v-model="form.sex" placeholder="请选择" size="small">
                <el-option :key="1" :label="'男'" :value="1" />
                <el-option :key="2" :label="'女'" :value="2" />
              </el-select>
              <!-- <el-select v-model="staff" placeholder="全部服务人员" size="small">
                <el-option
                  v-for="item in staffList"
                  :key="item.svc_staff_id"
                  :label="item.name"
                  :value="item.svc_staff_id"
                />
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="联系方式：" :label-width="formLabelWidth">
          <el-input v-model="form.phone" style="width:285px" size="small" />
        </el-form-item>
        <el-form-item label="身份证号：" :label-width="formLabelWidth">
          <el-input v-model="form.id_card_num" style="width:285px" size="small" />
        </el-form-item>
        <el-form-item label="家庭住址：" :label-width="formLabelWidth">
          <el-select v-model="form.community_name" placeholder="全部社区" size="small" :no-data-text="'暂无数据'" @change="selectCommunity">
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
          </el-select>
        </el-form-item>
        <el-form-item label="最后服务时间：" :label-width="formLabelWidth">
          {{ form.last_svc_time | timeFilter }}
        </el-form-item>
        <el-form-item label="市民卡照片：" :label-width="formLabelWidth">
          <!-- {{form.citizen_card_pic}} -->
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
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { timeFilter } from '@/utils/filter'
import { editAgedInfo, getCommunityList, getSudistrictLit } from '@/api/user'

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
    async confirmEdit() {
      const result = await editAgedInfo({ ...this.form, name: this.form.aged_name })
      if (result.data.retcode === 0) {
        this.$message({
          type: 'success',
          message: '编辑成功'
        })
      }
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

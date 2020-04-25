<template>
  <div class="old-info-container">
    <div>{{ editStatus === 1?'编辑用例':'创建用例' }}</div>
    <el-form ref="ruleForm" :model="form" :rules="rules">
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
      <el-form-item prop="apiName" label="关联接口" :label-width="formLabelWidth">
        <el-autocomplete
          v-model="form.apiName"
          :style="inputWidth"
          size="small"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入关联接口"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item prop="caseBody" label="用例内容" :label-width="formLabelWidth">
        <el-input
          v-model="form.caseBody"
          type="textarea"
          rows="3"
          :style="inputWidth"
          size="small"
          placeholder="请输入用例内容"
        />
      </el-form-item>
      <el-form-item prop="caseDescription" label="用例描述" :label-width="formLabelWidth">
        <el-input
          v-model="form.caseDescription"
          type="textarea"
          rows="3"
          :style="inputWidth"
          size="small"
          placeholder="请输入用例描述"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="confirmEdit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { timeFilter } from "@/utils/filter";
import { createCase } from "@/api/case";
const FORM = {
  projectName: "",
  apiGroup: "",
  apiName: "",
  caseBody: "",
  caseDescription: ""
};
export default {
  filters: { timeFilter },
  data() {
    return {
      restaurants: [],
      editStatus: Number(this.$route.query.type),
      form: FORM,
      rules: {
        projectName: [
          { required: true, message: "请选择所属业务", trigger: "blur" }
        ],
        apiGroup: [
          { required: true, message: "请选择所属分组", trigger: "blur" }
        ],
        apiName: [
          { required: true, message: "请选择关联接口", trigger: "blur" }
        ],
        caseBody: [
          { required: true, message: "请输入正确的用例内容", trigger: "blur" }
        ],
        caseDescription: [
          { required: true, message: "请输入用例描述", trigger: "blur" }
        ]
      },
      inputWidth: "width:460px",
      formLabelWidth: "120px",
      communityList: [],
      subdistrictList: []
    };
  },
  created() {
    // this.editStatus = Boolean(this.$route.query.type)
    console.log(this.$route.query.type, this.editStatus);
    this.form = JSON.parse(sessionStorage.getItem("caseDetail")) || FORM;
    this.restaurants = this.loadAll();
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return [{ value: "靶场" }, { value: "攻防" }, { value: "演练" }];
    },
    handleSelect(item) {
      console.log(item);
    },
    closeDialog() {
      this.$refs["ruleForm"].resetFields();
    },
    selectRoles(val) {
      console.log(val);
      console.log(this.role);
    },
    goBack() {
      this.$router.go(-1);
      sessionStorage.removeItem("caseDetail");
    },
    confirmEdit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.createAccount();
          sessionStorage.removeItem("caseDetail");
        } else {
          return false;
        }
      });
    },
    async createAccount() {
      // sessionStorage.removeItem("userDetail");
      let userId = JSON.parse(sessionStorage.getItem("userInfo")).id;
      await createCase({ ...this.form, userId });
      if (this.editStatus === 0) {
        this.$message({
          type: "success",
          message: "创建成功"
        });
      } else {
        this.$message({
          type: "success",
          message: "编辑成功"
        });
      }
      this.$router.push({ path: "/case/list" });
    }
  }
};
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

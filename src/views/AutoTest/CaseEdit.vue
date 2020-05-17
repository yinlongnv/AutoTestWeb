<template>
  <div class="old-info-container">
    <div class="header-line">{{ editStatus === 1?'编辑用例':'创建用例' }}</div>
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item prop="apiInfo" label="关联接口信息" :label-width="formLabelWidth">
        <el-cascader
          size="small"
          clearable
          v-model="value"
          :options="options"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="caseRules" label="用例规则" :label-width="formLabelWidth">
        <el-input
          v-model="form.caseRules"
          type="textarea"
          rows="3"
          :style="inputWidth"
          size="small"
          placeholder="用例规则预置文字待定"
        />
      </el-form-item>
      <el-form-item prop="caseBody" label="用例内容" :label-width="formLabelWidth">
        <el-input
          v-model="form.caseBody"
          type="textarea"
          rows="3"
          :style="inputWidth"
          size="small"
          placeholder="用例内容预置文字待定"
        />
      </el-form-item>
      <el-form-item prop="caseDescription" label="用例描述" :label-width="formLabelWidth">
        <el-input
          v-model="form.caseDescription"
          type="textarea"
          rows="3"
          :style="inputWidth"
          size="small"
          placeholder="用例描述预置文字待定"
        />
      </el-form-item>
      <el-form-item prop="caseResponse" label="预期响应" :label-width="formLabelWidth">
        <el-input
          v-model="form.caseResponse"
          type="textarea"
          rows="3"
          :style="inputWidth"
          size="small"
          placeholder="预期响应预置文字待定"
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
import { createCase, getfilterMap } from "@/api/case";
const FORM = {
  projectName: "",
  apiGroup: "",
  apiMerge: "",
  caseRules: "",
  caseBody: "",
  caseDescription: "",
  caseResponse: ""
};
export default {
  filters: { timeFilter },
  data() {
    const validateProjectGroup = (rule, value, callback) => {
      console.log(this.value, "value");
      if (this.value.length === 0) {
        callback(new Error("请选择关联接口信息"));
      } else {
        callback();
      }
    };
    return {
      value: [],
      options: [],
      editStatus: Number(this.$route.query.type),
      form: FORM,
      rules: {
        apiInfo: [
          { required: true, validator: validateProjectGroup, trigger: "change" }
        ],
        caseBody: [
          { required: true, message: "请输入用例内容", trigger: "blur" }
        ],
        caseDescription: [
          { required: true, message: "请输入用例描述", trigger: "blur" }
        ],
        caseResponse: [
          { required: true, message: "请输入预期响应", trigger: "blur" }
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
    this.getfilterMap();
  },
  methods: {
    async getfilterMap() {
      try {
        const result = await getfilterMap();
        this.options = result.data.options;
      } catch (error) {
        this.$message.error(error);
      }
    },
    handleChange(val) {
      if (val.length === 0) {
        this.form.projectName = "";
        this.form.apiGroup = "";
        this.form.apiMerge = "";
      } else {
        this.form.projectName = val[0];
        this.form.apiGroup = val[1];
        this.form.apiMerge = val[2];
      }
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
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

<template>
  <div class="old-info-container">
    <div class="header-line">{{ editStatus | pageTypeFilter }}用例</div>
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item prop="apiInfo" label="关联接口信息" :label-width="formLabelWidth">
        <el-cascader
          v-model="value"
          size="small"
          clearable
          :options="options"
          placeholder="请选择关联接口信息"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item prop="caseBody" label="用例内容" :label-width="formLabelWidth">
        <el-input
          v-model="form.caseBody"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder="请输入用例内容，例如：{&quot;username&quot;:&quot;dadalong&quot;,&quot;password&quot;:&quot;123456&quot;}"
        />
      </el-form-item>
      <el-form-item prop="caseDescription" label="用例描述" :label-width="formLabelWidth">
        <el-input
          v-model="form.caseDescription"
          type="textarea"
          rows="3"
          :style="inputWidth"
          size="small"
          placeholder="请输入用例描述，例如：用户登录case1"
        />
      </el-form-item>
      <el-form-item prop="caseResponse" label="预期响应" :label-width="formLabelWidth">
        <el-input
          v-model="form.caseResponse"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder="请输入预期响应，例如：{&quot;code&quot;: &quot;00000&quot;,&quot;message&quot;: &quot;登录成功&quot;,&quot;data&quot;: {...}}"
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
import { timeFilter, pageTypeFilter } from "@/utils/filter";
import { createCase, getfilterMap } from "@/api/case";
const FORM = {
  projectName: "",
  apiGroup: "",
  apiMerge: "",
  caseBody: "",
  caseDescription: "",
  caseResponse: ""
};
export default {
  filters: { timeFilter, pageTypeFilter },
  data() {
    const validateProjectGroup = (rule, value, callback) => {
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
        // caseBody: [
        //   { required: true, message: "请输入用例内容", trigger: "blur" }
        // ],
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
    this.form =
      JSON.parse(sessionStorage.getItem("caseDetail")) ||
      JSON.parse(JSON.stringify(FORM));
    this.getfilterMap();
    if (this.editStatus !== 0) {
      this.value = [
        this.form.projectName,
        this.form.apiGroup,
        this.form.apiMerge
      ];
    } else {
      this.value = [];
    }
  },
  methods: {
    async getfilterMap() {
      try {
        const result = await getfilterMap();
        this.options = result.data.data.options;
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
    judgeStatus(result, message) {
      if (result.data.code === "00000") {
        this.$message({
          type: "success",
          message: message
        });
      } else {
        this.$message.error(result.data.message);
      }
    },
    async createAccount() {
      const userId = JSON.parse(sessionStorage.getItem("userInfo")).id;
      if (this.editStatus === 0) {
        const result = await createCase({ ...this.form, userId });
        this.judgeStatus(result, "创建成功");
      } else if (this.editStatus === 1) {
        const result = await createCase({ ...this.form, userId });
        this.judgeStatus(result, "编辑成功");
      } else if (this.editStatus === 2) {
        const result = await createCase({ ...this.form, userId, id: "" });
        this.judgeStatus(result, "复制成功");
      }

      this.$router.push({ path: "/case/list" });
    }
  }
};
</script>

<style lang="scss" scoped>
.old-info-container {
  /deep/.el-cascader {
    width: 460px;
  }
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

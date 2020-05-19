<template>
  <div class="old-info-container">
    <div class="header-line">{{ editStatus | pageTypeFilter }}接口</div>
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item
        prop="baseUrl"
        label="环境域名："
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.baseUrl"
          :style="inputWidth"
          size="small"
          placeholder="请输入环境域名，例如：csr.adl.top"
        />
      </el-form-item>
      <el-form-item
        prop="projectGroup"
        label="业务分组："
        :label-width="formLabelWidth"
      >
        <el-cascader
          v-model="value"
          size="small"
          clearable
          :options="options"
          placeholder="请选择业务分组"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item
        prop="apiName"
        label="接口名称："
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.apiName"
          :style="inputWidth"
          size="small"
          placeholder="请输入接口名称"
        />
      </el-form-item>
      <el-form-item
        prop="apiPath"
        label="接口路径："
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.apiPath"
          :style="inputWidth"
          size="small"
          placeholder="请输入接口路径"
        />
      </el-form-item>
      <el-form-item
        prop="reqMethod"
        label="请求方法："
        :label-width="formLabelWidth"
      >
        <el-select
          v-model="form.reqMethod"
          :style="inputWidth"
          size="small"
          placeholder="请选择请求方法"
          clearable
          @change="selectMethod"
        >
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="apiDescription"
        label="接口描述："
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.apiDescription"
          :style="inputWidth"
          size="small"
          placeholder="请输入接口描述"
          type="textarea"
          rows="3"
        />
      </el-form-item>
      <el-form-item
        prop="reqHeaders"
        label="请求头："
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.reqHeaders"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder='请输入请求头，例如：[{"name":"Content-Type","value":"application/x-www-form-urlencoded","required":"1","example":"","desc":""}]'
        />
      </el-form-item>
      <el-form-item
        prop="reqQuery"
        label="请求参数："
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.reqQuery"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder='请输入请求参数，例如：[{"name": "tagId", "required": "1","example": "", "desc": ""}]'
        />
      </el-form-item>
      <el-form-item
        prop="reqBody"
        label="请求体："
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.reqBody"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder='请输入请求体，例如：[{"name": "snapshotName", "type": "string", "required": "0"}, {"name": "summary", "type": "string","required": "0"}, {"name": "trainId", "type": "integer", "required": "0"}]'
        />
      </el-form-item>
      <el-form-item
        prop="caseRules"
        label="用例规则"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.caseRules"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder='请输入用例规则，例如：[{"name":"username","required":"1","type":"string","min":"6","max":"10","options":"","isArray":"0","model":""}]'
        />
      </el-form-item>
      <el-form-item
        prop="apiResponse"
        label="响应信息："
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.apiResponse"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder='请输入响应信息，例如：{"code":"00000","message":"密码修改成功","data":[]}'
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
import { createApi, getfilterMap } from "@/api/api";
const FORM = {
  baseUrl: "",
  projectGroup: "",
  apiName: "",
  apiPath: "",
  reqMethod: "",
  apiDescription: "",
  reqHeaders: "",
  reqBody: "",
  reqQuery: "",
  caseRules: "",
  apiResponse: ""
};
export default {
  filters: { timeFilter, pageTypeFilter },
  data() {
    const validateProjectGroup = (rule, value, callback) => {
      console.log(this.value, "value");
      if (this.value.length === 0) {
        callback(new Error("请选择业务分组"));
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
        baseUrl: [
          { required: true, message: "请输入正确的环境域名", trigger: "blur" }
        ],
        projectGroup: [
          { required: true, validator: validateProjectGroup, trigger: "change" }
        ],
        apiName: [
          { required: true, message: "请输入接口名称", trigger: "blur" }
        ],
        apiPath: [
          { required: true, message: "请输入正确的接口路径", trigger: "blur" }
        ],
        reqMethod: [
          { required: true, message: "请选择请求方法", trigger: "change" }
        ]
      },
      methodOptions: [
        {
          label: "POST",
          value: "POST"
        },
        {
          label: "GET",
          value: "GET"
        }
      ],
      inputWidth: "width:360px",
      formLabelWidth: "120px"
    };
  },
  created() {
    this.form =
      JSON.parse(sessionStorage.getItem("apiDetail")) ||
      JSON.parse(JSON.stringify(FORM));
    this.getfilterMap();
    if (this.editStatus !== 0) {
      this.value = [this.form.projectName, this.form.apiGroup];
    } else {
      this.value = [];
      this.form.reqMethod = "";
    }
  },
  methods: {
    async getfilterMap() {
      try {
        const result = await getfilterMap();
        const options = result.data.options;
        for (const i of options) {
          for (const child of i.children) {
            delete child.children;
          }
        }
        this.options = result.data.options;
      } catch (error) {
        this.$message.error(error);
      }
    },
    handleChange(val) {
      if (val.length === 0) {
        this.form.projectName = "";
        this.form.apiGroup = "";
      } else {
        this.form.projectName = val[0];
        this.form.apiGroup = val[1];
      }
    },
    selectMethod(val) {
      console.log(val);
    },
    closeDialog() {
      this.$refs["ruleForm"].resetFields();
    },
    goBack() {
      this.$router.go(-1);
      sessionStorage.removeItem("apiDetail");
    },
    confirmEdit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.createAccount();
          sessionStorage.removeItem("apiDetail");
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
        const result = await createApi({ ...this.form, userId });
        this.judgeStatus(result, "创建成功");
      } else if (this.editStatus === 1) {
        const result = await createApi({ ...this.form, userId });

        this.judgeStatus(result, "编辑成功");
      } else if (this.editStatus === 2) {
        const result = await createApi({ ...this.form, userId, id: "" });
        this.judgeStatus(result, "复制成功");
      }

      this.$router.push({ path: "/api/list" });
    }
  }
};
</script>

<style lang="scss" scoped>
.old-info-container {
  /deep/.el-cascader {
    width: 360px;
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

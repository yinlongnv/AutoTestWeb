<template>
  <div class="old-info-container">
    <div class="header-line">{{ editStatus|pageTypeFilter }}</div>
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item prop="baseUrl" label="环境域名：" :label-width="formLabelWidth">
        <el-input
          v-model="form.baseUrl"
          :style="inputWidth"
          size="small"
          placeholder="请输入环境域名，例如：csr.adl.top"
        />
      </el-form-item>
      <el-form-item prop="projectGroup" label="业务分组：" :label-width="formLabelWidth">
        <el-cascader
          size="small"
          clearable
          v-model="value"
          :options="options"
          placeholder="请选择业务分组"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="reqMethod" label="请求方法：" :label-width="formLabelWidth">
        <el-select
          v-model="form.reqMethod"
          :style="inputWidth"
          size="small"
          placeholder="请选择请求方法"
          @change="selectMethod"
          clearable
        >
          <el-option
            v-for="item in methodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="reqHeaders" label="请求头：" :label-width="formLabelWidth">
        <el-input
          v-model="form.reqHeaders"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder="请输入请求头，例如：[{'name': '参数名称','value': '参数值','required': '是否必须，1为必须，0为不必须'}]"
        />
      </el-form-item>
      <el-form-item prop="reqBody" label="请求体：" :label-width="formLabelWidth">
        <el-input
          v-model="form.reqBody"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder="请输入请求体，例如：[{'name': '名称','type': '数据类型','required': '是否必须，1为必须，0为不必须','default': '默认值','desc': '备注','sub': '其他信息，例如undefined: @string(0,16)'}]"
        />
      </el-form-item>
      <el-form-item prop="apiResponse" label="响应信息：" :label-width="formLabelWidth">
        <el-input
          v-model="form.apiResponse"
          type="textarea"
          rows="6"
          :style="inputWidth"
          size="small"
          placeholder="请输入响应信息，例如：{'code': '00000','message': '操作成功','data': {}}"
        />
      </el-form-item>
      <el-form-item prop="apiPath" label="接口路径：" :label-width="formLabelWidth">
        <el-input v-model="form.apiPath" :style="inputWidth" size="small" placeholder="请输入接口路径" />
      </el-form-item>
      <el-form-item prop="apiName" label="接口名称：" :label-width="formLabelWidth">
        <el-input v-model="form.apiName" :style="inputWidth" size="small" placeholder="请输入接口名称" />
      </el-form-item>
      <el-form-item prop="apiDescription" label="接口描述：" :label-width="formLabelWidth">
        <el-input
          v-model="form.apiDescription"
          :style="inputWidth"
          size="small"
          placeholder="请输入接口描述"
          type="textarea"
          rows="3"
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
  projectGroup: "",
  baseUrl: "",
  reqMethod: "",
  reqHeaders: "",
  reqBody: "",
  apiResponse: "",
  apiPath: "",
  apiName: "",
  apiDescription: ""
};
export default {
  filters: { timeFilter, pageTypeFilter },
  data() {
    return {
      value: [],
      options: [],
      // restaurants: [],
      editStatus: Number(this.$route.query.type),
      form: FORM,
      rules: {
        projectGroup: [
          { required: true, message: "请选择业务分组", trigger: "change" }
        ],
        baseUrl: [
          { required: true, message: "请输入正确的环境域名", trigger: "blur" }
        ],
        reqMethod: [
          { required: true, message: "请选择请求方法", trigger: "change" }
        ],
        apiPath: [
          { required: true, message: "请输入正确的接口路径", trigger: "blur" }
        ],
        reqHeaders: [
          { required: true, message: "请输入正确的请求头", trigger: "blur" }
        ],
        reqBody: [
          { required: true, message: "请输入正确的请求体", trigger: "blur" }
        ],
        apiResponse: [
          { required: true, message: "请输入正确的响应信息", trigger: "blur" }
        ],
        apiName: [
          { required: true, message: "请输入请求名称", trigger: "blur" }
        ],
        apiDescription: [
          { required: true, message: "请输入请求描述", trigger: "blur" }
        ]
      },
      methodOptions: [
        {
          label: "post",
          value: "post"
        },
        {
          label: "get",
          value: "get"
        }
      ],
      inputWidth: "width:360px",
      formLabelWidth: "120px"
    };
  },
  created() {
    // this.editStatus = Boolean(this.$route.query.type)
    console.log(this.$route.query.type, this.editStatus);
    this.form = JSON.parse(sessionStorage.getItem("apiDetail")) || FORM;
    this.getfilterMap();
    this.value = [this.form.projectName, this.form.apiGroup];
  },
  methods: {
    async getfilterMap() {
      try {
        const result = await getfilterMap();
        let options = result.data.options;
        for (let i of options) {
          for (let child of i.children) {
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
      console.log(this.role);
    },
    handleSelect(item) {
      console.log(item);
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
      let userId = JSON.parse(sessionStorage.getItem("userInfo")).id;
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
    width: 500px;
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

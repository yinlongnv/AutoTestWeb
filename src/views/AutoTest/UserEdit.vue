<template>
  <div class="old-info-container">
    <div class="header-line">{{ editStatus === 1?'编辑账号':'创建账号' }}</div>
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-form-item prop="username" label="用户名：" :label-width="formLabelWidth">
        <el-input v-model="form.username" :style="inputWidth" size="small" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="身份证号：" :label-width="formLabelWidth">
        <el-input v-model="form.idNumber" :style="inputWidth" size="small" placeholder="请输入真实身份证号" />
      </el-form-item>
      <el-form-item label="手机号：" :label-width="formLabelWidth">
        <el-input v-model="form.phoneNumber" :style="inputWidth" size="small" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="邮箱地址：" :label-width="formLabelWidth">
        <el-input v-model="form.email" :style="inputWidth" size="small" placeholder="请输入邮箱地址" />
      </el-form-item>
      <el-form-item prop="role" label="账号角色：" :label-width="formLabelWidth">
        <el-select
          v-model="form.role"
          :style="inputWidth"
          size="small"
          placeholder="请选择账号角色"
          clearable
          @change="selectRoles"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="password"
        :label="editStatus === 1?'密码：':'初始密码：'"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="form.password"
          :style="inputWidth"
          size="small"
          placeholder="请输入账号密码，至少6位"
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
import { createUser } from "@/api/user";
const INIT_FORM = {
  username: "",
  idNumber: "",
  phoneNumber: "",
  email: "",
  role: "",
  password: ""
};
export default {
  filters: { timeFilter },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      editStatus: Number(this.$route.query.type),
      form: {
        username: "",
        idNumber: "",
        phoneNumber: "",
        email: "",
        role: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        role: [
          { required: true, message: "账号角色不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ]
      },
      options: [
        {
          label: "root",
          value: 1
        },
        {
          label: "QA",
          value: 0
        }
      ],
      inputWidth: "width:360px",
      formLabelWidth: "120px"
    };
  },
  created() {
    this.form =
      JSON.parse(sessionStorage.getItem("userDetail")) ||
      JSON.parse(JSON.stringify(INIT_FORM));
  },
  methods: {
    closeDialog() {
      this.$refs["ruleForm"].resetFields();
    },
    goBack() {
      this.$router.go(-1);
      sessionStorage.removeItem("userDetail");
    },
    confirmEdit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.createAccount();
        } else {
          return false;
        }
      });
    },
    async createAccount() {
      sessionStorage.removeItem("userDetail");
      const userId = JSON.parse(sessionStorage.getItem("userInfo")).id;
      const result = await createUser({
        ...this.form,
        userId
      });
      const createOk = this.editStatus === 0 && result.data.code === "00000";
      const editOk = this.editStatus === 1 && result.data.code === "00000";
      if (createOk) {
        this.$message({
          type: "success",
          message: "创建成功"
        });
      } else if (editOk) {
        this.$message({
          type: "success",
          message: "编辑成功"
        });
      } else {
        this.$message.error(result.data.message);
      }
      this.$router.push({ path: "/user/list" });
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

<template>
  <div>
    <div class="header">
      <div style="padding:16px">个人中心</div>
      <el-row>
        <el-col :span="3">用户编号</el-col>
        <el-col :span="10" :offset="1">{{ userInfo.userNumber }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">账号角色</el-col>
        <el-col :span="10" :offset="1">{{ userInfo.role|roleFilter }}</el-col>
      </el-row>
    </div>
    <div class="content">
      <el-row type="flex" align="middle">
        <el-col :span="3">用户名</el-col>
        <el-col :span="16" :offset="1">{{ userInfo.username }}</el-col>
        <el-col :span="4" class="right">
          <el-button type="text" size="small" @click="openDialog('username')">修改用户名</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="3">身份证号</el-col>
        <el-col :span="16" :offset="1">{{ userInfo.idNumber }}</el-col>
        <el-col :span="4" class="right">
          <el-button type="text" size="small" @click="openDialog('idNumber')">修改身份证号</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="3">手机号</el-col>
        <el-col :span="16" :offset="1">{{ userInfo.phoneNumber }}</el-col>
        <el-col :span="4" class="right">
          <el-button type="text" size="small" @click="openDialog('phoneNumber')">修改手机号</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="3">邮箱地址</el-col>
        <el-col :span="16" :offset="1">{{ userInfo.email }}</el-col>
        <el-col :span="4" class="right">
          <el-button type="text" size="small" @click="openDialog('email')">修改邮箱地址</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle">
        <el-col :span="3">密码</el-col>
        <el-col :span="16" :offset="1">{{ userInfo.password }}</el-col>
        <el-col :span="4" class="right">
          <el-button type="text" size="small" @click="openDialog('password')">修改密码</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="closeDialog">
      <!-- <el-form ref="ruleForm" :model="form"> -->
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <div v-if="dialogTitle==='修改用户名'">
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input
              v-model="form.username"
              style="width:300px"
              placeholder="请输入用户名"
              size="small"
            />
          </el-form-item>
        </div>
        <div v-if="dialogTitle==='修改身份证号'">
          <el-form-item label="身份证号" :label-width="formLabelWidth" prop="idNumber">
            <el-input
              v-model="form.idNumber"
              style="width:300px"
              placeholder="请输入身份证号"
              size="small"
            />
          </el-form-item>
        </div>
        <div v-if="dialogTitle==='修改手机号'">
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="phoneNumber">
            <el-input
              v-model="form.phoneNumber"
              style="width:300px"
              placeholder="请输入手机号"
              size="small"
            />
          </el-form-item>
        </div>
        <div v-if="dialogTitle==='修改邮箱地址'">
          <el-form-item label="邮箱地址" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email" style="width:300px" placeholder="请输入邮箱地址" size="small" />
          </el-form-item>
        </div>
        <div v-if="dialogTitle==='修改密码'">
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
            <el-input
              v-model="form.password"
              style="width:300px"
              placeholder="请输入新密码"
              size="small"
            />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confrimChange">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const DIALOGTITLES = {
  username() {
    return "修改用户名";
  },
  idNumber() {
    return "修改身份证号";
  },
  phoneNumber() {
    return "修改手机号";
  },
  email() {
    return "修改邮箱地址";
  },
  password() {
    return "修改密码";
  }
};
import { createUser, getUserDetail } from "@/api/user";
import { statusFilter, roleFilter } from "@/utils/filter";
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: "blur" }
        ]
      },
      dialogTitle: "修改密码",
      dialogVisible: false,
      userInfo: {},
      form: {
        username: "",
        idNumber: "",
        phoneNumber: "",
        email: "",
        password: ""
      },
      formLabelWidth: "120px"
    };
  },
  created() {
    this.getUserDetail();
  },
  filters: {
    statusFilter,
    roleFilter
  },
  watch: {
    form: {
      handler(val) {
        console.log(val, "form");
        console.log(this.userInfo, "userInfo");
      },
      deep: true
    }
  },
  methods: {
    async getUserDetail() {
      try {
        let id = JSON.parse(sessionStorage.getItem("userInfo")).id;
        let result = await getUserDetail({ id });
        let data = JSON.stringify(result.data.data);
        sessionStorage.setItem("centerInfo", data);
        this.userInfo = JSON.parse(data);
        this.form = JSON.parse(data);
      } catch (error) {}
    },
    async createAccount() {
      let id = JSON.parse(sessionStorage.getItem("userInfo")).id;
      await createUser({ ...this.form, id });
      this.$message({
        type: "success",
        message: "编辑成功"
      });
    },
    confrimChange() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.createAccount().then(() => {
            this.getUserDetail();
          });
          this.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    openDialog(type) {
      this.dialogTitle = DIALOGTITLES[type]();
      console.log(this.dialogTitle, this.form);
      this.dialogVisible = true;
    },
    closeDialog() {
      this.form = JSON.parse(sessionStorage.getItem("centerInfo"));
    }
  }
};
</script>

<style scoped>
.header > div {
  padding: 10px 16px;
}
.content {
  padding: 10px 16px;
}
.content > div {
  background: rgb(236, 245, 255);
  font-size: 14px;
  padding: 4px 16px;
  border-radius: 4px;
  margin: 16px 0;
}
.right {
  text-align: right;
}
</style>

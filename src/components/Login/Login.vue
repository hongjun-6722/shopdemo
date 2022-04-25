<template>
  <div id="Login">
    <div class="main">
      <div class="main-close">
        <el-button
          type="text"
          icon="el-icon-close"
          circle
          size="medium"
          @click="CloseLogin()"
        >
        </el-button>
      </div>
      <el-form :rules="rules" :model="LoginForm" ref="LoginForm">
        <el-form-item label="用户登录"></el-form-item>

        <el-form-item label="账号" prop="inputaccount" label-width="80px">
          <el-input
            type="text"
            class="login-account login-input"
            placeholder="请输入账号"
            v-model="LoginForm.inputaccount"
            prop="inputaccount"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="inputaccount" label-width="80px">
          <el-input
            type="password"
            class="login-password login-input"
            placeholder="请输入密码"
            v-model="LoginForm.inputpassword"
            prop="inputpassword"
          ></el-input>
        </el-form-item>

        <el-form-item size="large" class="loginbuttom">
          <el-button type="primary" @click="submitForm('LoginForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('LoginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { post } from "../../api/index";

export default {
  data() {
    return {
      LoginForm: {
        inputaccount: "",
        inputpassword: "",
      },
      rules: {
        inputaccount: [
          { required: true, message: "请输入账号名", trigger: "blur" },
        ],
        inputpassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
    };
  },

  components: {},

  computed: {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login();
        } else {
          alert("请正确输入信息");
          console.log("error submit!!");
        }
      });
    }, //验证字段
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }, //重置
    CloseLogin() {
      this.$emit("CloseLogin", "LoginClose");
    }, //关闭界面
    alert(msg) {
      this.$alert(msg, "提示", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            type: "info",
            message: `action: ${action}`,
          });
        },
      });
    }, //提示
    login() {
      this.commAPI
        .post("/login", {
          username: this.LoginForm.inputaccount,
          password: this.LoginForm.inputpassword,
        })
        .then((res) => {
          console.log(res);
          let data = res.data;
          if (res.status == 200) {
            this.$store.dispatch("UPDusermode", "online");
            this.$store.dispatch("UPDusername", data.user.nickname);
            this.$store.dispatch("UPDuserid", data.user.userid);
            
            this.$emit("CloseLogin", "LoginClose");
            this.$emit("Pushloginstatus", "1");
          } else if (res.status == 201) {
            console.log("登录码201");
            alert("登录失败");
          }
        })
        .catch(function (err) {
          alert("登录失败");
          console.log(err);
        });
    },
  }, //登陆
};
</script>
<style lang='less' >
.password-error {
  margin-bottom: 30px;
}
.input-error {
  margin-bottom: 30px;
}
#Login {
  width: 100%;
  height: 100%;
  background-color: rgba(138, 133, 133, 0.475);
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  .main {
    opacity: 1;
    width: 450px;
    height: 300px;
    border: 2px rgb(255, 213, 213) solid;
    position: relative;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);
    box-sizing: border-box;
    padding: 10px 20px 0;
    background: rgb(255, 224, 224);
    .main-close {
      float: right;
      position: relative;
      z-index: 1;
    }
    .loginbuttom{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .login-input {
    width: 250px;
    float: right;
    right: 60px;
  }
  .el-form-item__error {
    width: 250px;
    text-align: left;
    left: 100px;
  }
}
</style>
<style >
#register .el-form-item__error {
  width: 250px;
  text-align: left;
  left: 20px;
}
</style>
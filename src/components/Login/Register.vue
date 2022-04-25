
<template>
  <div id="register">
    <div class="main">
      <div class="main-close">
        <el-button
          type="text"
          icon="el-icon-close"
          circle
          size="medium"
          @click="CloseRegister()"
        >
        </el-button>
      </div>

      <el-form
        :rules="rules"
        :model="RegisterForm"
        ref="RegisterForm"
        label-position="right"
        size="medium"
      >
        <el-form-item
          label="用户注册"
          label-width="80px"
          style="marginbottom: 0"
        ></el-form-item>

        <el-form-item
          label="账号"
          prop="inputaccount"
          :class="{ 'input-error': inputError }"
          label-width="80px"
        >
          <el-input
            type="text"
            class="login-account login-input"
            placeholder="请输入账号"
            v-model="RegisterForm.inputaccount"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="密码"
          prop="inputpassword"
          :class="{ 'password-error': passwordError }"
          label-width="80px"
        >
          <el-input
            class="login-password login-input"
            type="password"
            placeholder="请输入密码"
            v-model="RegisterForm.inputpassword"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="repassword" label-width="80px">
          <el-input
            class="login-password login-input"
            type="password"
            placeholder="请确认密码"
            v-model="RegisterForm.repassword"
          ></el-input>
        </el-form-item>

        <el-form-item size="large">
          <el-button type="primary" @click="submitForm('RegisterForm')"
            >注册</el-button
          >
          <el-button @click="resetForm('RegisterForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isvalidPass, isvalidUsername } from "@/utils/validate.js";
export default {
  data() {
    var validUsername = (rule, value, callback) => {
      if (value === "") {
        this.inputError = false;
        callback(new Error("请输入用户名"));
      } else if (!isvalidUsername(value)) {
        this.inputError = true;
        callback(
          new Error(
            "用户名要求数字、字母、下划线的组合 数字和字母必须存在 长度为4-16个字符"
          )
        );
      } else {
        this.inputError = false;
        callback();
      }
    };

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        this.passwordError = false;
        callback(new Error("请输入密码"));
      } else if (!isvalidPass(value)) {
        this.passwordError = true;
        callback(
          new Error("密码以字母开头 长度在8~18之间 只能包含字母、数字和下划线")
        );
      } else {
        this.passwordError = false;
        if (this.RegisterForm.repassword !== "") {
          this.$refs.RegisterForm.validateField("repassword");
        }
        callback();
      }
    };

    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.RegisterForm.inputpassword) {
        callback(new Error("两次输入密码不一致！"));
      } else {
        callback();
      }
    };

    return {
      inputError: false,
      passwordError: false,
      RegisterForm: {
        inputaccount: "",
        inputpassword: "",
        repassword: "",
      },
      rules: {
        inputaccount: [
          { required: true, validator: validUsername, trigger: "blur" },
        ],
        inputpassword: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        repassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
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
          console.log("submit!!");
          this.Register();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    CloseRegister() {
      this.$emit("CloseRegister", "registerClose");
    },
    Register() {
      this.commAPI
        .post("/register", {
          username: this.RegisterForm.inputaccount,
          password: this.RegisterForm.inputpassword,
        })
        .then((res) => {
          console.log(res);
          console.log("注册成功")
          let data = res.data;
          if (res.status == 200) {
            // this.$store.dispatch("UPDusermode", "online");
            // this.$store.dispatch("UPDusername", data.user.nickname);
            // this.$store.dispatch("UPDuserid", data.user.userid);

            this.$emit("CloseRegister", "registerClose");
          } else {
            console.log(data);
            alert("注册失败");
          }
        })
        .catch(function (err) {
          alert("注册失败");
          console.log(err);
        });
    },
  },
};
</script>
<style lang='less'>
.password-error {
  margin-bottom: 30px;
}
.input-error {
  margin-bottom: 30px;
}
#register {
  width: 100%;
  height: 100%;
  background-color: rgba(243, 230, 230, 0.274);
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  .main {
    opacity: 1;
    width: 450px;
    height: 300px;
    border-color: cadetblue;
    border: 2px cadetblue solid;
    position: relative;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-50%);
    box-sizing: border-box;
    padding: 10px 20px 0;
    .main-close {
      float: right;
      position: relative;
      z-index: 1;
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
<style>
#register .el-form-item__error {
  width: 250px;
  text-align: left;
  left: 20px;
}
</style>
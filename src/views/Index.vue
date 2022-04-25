<template>
  <div class="index">
    <div class="login-popup">
      <Register v-show="Registershow" @CloseRegister="OpensignType"></Register>
      <Login
        v-show="Loginshow"
        @CloseLogin="OpensignType"
        @Pushloginstatus="Getloginstatus"
      ></Login>
    </div>
    <header class="header">
      <HeaderNav
        @Opensign="OpensignType"
        @outlogin="outlogin"
        :loginstatus="loginstatus"
      ></HeaderNav>
    </header>
    <router-view :browserwidth="browserwidth"></router-view>
    <div class="chatroom">
      <IM v-bind:autologin="autologin" v-bind:loginstatus="loginstatus"></IM>
    </div>
  </div>
</template>

<script>
import HeaderNav from "@/components/Header/HeaderNav.vue";
import Register from "@/components/Login/Register.vue";
import Login from "@/components/Login/Login.vue";
import IM from "@/components/IM/IM.vue";

export default {
  name: "home",
  components: {
    HeaderNav,
    Register,
    Login,
    IM,
  },

  data() {
    return {
      Registershow: false, //注册组件显示
      Loginshow: false, //登录组件显示
      loginstatus: "0", //0:未登录 1:登录
      autologin: "0", //"0":自动登录中 "1":登录失败 "2":登录成功
      browserwidth: document.body.clientWidth,
    };
  },
  computed: {
    params() {
      return this.$route.params;
    },
  },

  methods: {
    OpensignType(key) {
      if (key == "register") {
        this.Registershow = true;
      } else if (key == "login") {
        this.Loginshow = true;
      } else if (key == "registerClose") {
        this.Registershow = false;
      } else if (key == "LoginClose") {
        this.Loginshow = false;
      }
    }, //登录，注册组件显示
    Getloginstatus(key) {
      if (key == 1) {
        this.loginstatus = "1";
      }
    }, //用户状态改变
    outlogin() {
      this.$store.dispatch("UPDusermode", "");
      this.$store.dispatch("UPDusername", "");
      this.$store.dispatch("UPDuserid", "");
      this.loginstatus = "0";
      this.$cookies.remove("token");
    }, //退出登录
    openautologin(token) {
      if (token) {
        this.commAPI
          .post("/vartoken", {
            token: token,
          })
          .then((res) => {
            // console.log(res);
            let data = res.data;
            if (res.status == 200) {
              this.$store.dispatch("UPDusermode", "online");
              this.$store.dispatch("UPDusername", data.user.nickname);
              this.$store.dispatch("UPDuserid", data.user.userid);
              this.loginstatus = "1";
              this.autologin = "1";
            } else {
              this.autologin = "2";
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      } else {
        this.autologin = "2";
      }
    },
  },

  mounted() {
    var token = this.$cookies.get("token");
    this.openautologin(token);
    window.onresize = () => {
      return (this.browserwidth = document.body.clientWidth);
    };
    // this.$router.push('/contents')
  },

  destroyed() {
    window.onresize = null;
  },
};
</script>

<style>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
.nav {
  height: 140px;
}
.chatroom {
  position: fixed;
  right: 0;
  bottom: 50px;
}
.ContentMenu {
  margin-top: 20px;
}
</style>

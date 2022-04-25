<template>
  <div id="HeaderNav">
    <el-menu
      class="el-menu"
      mode="horizontal"
      text-color="#fff"
      background-color="#545c64"
      active-text-color="#fff"
    >
      <!-- 地区信息 -->
      <el-submenu index="1" class="el-submenu_left region">
        <template slot="title">{{ activeregion }}</template>
        <el-menu-item
          v-for="(item, i) in region"
          :key="i"
          @click="Selectregion(item)"
          >{{ item }}</el-menu-item
        >
      </el-submenu>

      <!-- 用户登录 -->
      <el-menu-item index="2" class="el-submenu_left" v-if="loginstatus == '0'">
        <slot></slot>
        <el-button
          type="success"
          round
          size="small"
          @click="Opensign('register')"
        >
          注册</el-button
        >
        <el-button type="primary" round size="small" @click="Opensign('login')">
          登录
        </el-button>
      </el-menu-item>

      <el-menu-item
        index="3"
        class="el-submenu_left username"
        v-if="loginstatus == '1'"
      >
        欢迎:{{ username }}
        <el-button class="usernamebutton" @click="outlogin">退出</el-button>
      </el-menu-item>

      <el-menu-item v-if="loginstatus == '1'">
        <router-link to="/">前往个人中心</router-link>
      </el-menu-item>

      <el-menu-item index="4" class="el-submenu_right">
        <router-link to="/">前往首页</router-link>
      </el-menu-item>

      <el-submenu index="5" class="el-submenu_right">
        <template slot="title">网站导航</template>
        <el-menu-item index="5-1">我的足迹</el-menu-item>
        <el-menu-item index="5-2">联系客服</el-menu-item>
        <el-menu-item index="5-3">卖家中心</el-menu-item>
        <el-menu-item index="5-4">商品分类</el-menu-item>
      </el-submenu>

      <el-submenu index="6" class="el-submenu_right">
        <template slot="title">收藏夹</template>
        <el-menu-item index="6-1">
          <router-link to="/">收藏的宝贝</router-link>
        </el-menu-item>
        <el-menu-item index="6-2">
          <router-link to="/">收藏的店铺</router-link>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="7" class="el-submenu_right">
        <template slot="title">购物车</template>
        <el-submenu index="7-1">
          <template slot="title">您的购物车里还没有任何宝贝</template>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "HeaderNav",
  data() {
    return {
      region: ["全 球", "中国大陆"],
      activeregion: "全球",
      userform: {
        username: "",
      },
    };
  },
  props: {
    loginstatus: {
      type: String,
      required: true,
    },
  },
  components: {},
  computed: {
    username() {
      if (this.$store.state.username) return this.$store.state.username;
      return "请等待";
    },
  },
  methods: {
    Selectregion(key) {
      this.activeregion = key;
    },
    Opensign(key) {
      if (key == "register") {
        this.$emit("Opensign", "register");
      } else if (key == "login") {
        this.$emit("Opensign", "login");
      }
    }, //组件显示
    outlogin() {
      this.$emit("outlogin", "outlogin");
    },
  },
};
</script>
<style lang='less'>
a {
  text-decoration: none;
  color: #fff;
}
.el-submenu__title {
  padding: 0 8px;
  margin: 0 auto 0 8px;
}

#HeaderNav {
  min-width: 800px;
  .username {
    color: #6cf59e !important;
    .usernamebutton {
      padding: 2px 4px;
    }
  }
}
.el-menu {
  text-align: left;
}
.el-menu .el-submenu_left {
  float: left;
}
.el-submenu_right {
  float: right !important;
}
#HeaderNav .el-menu .is-active {
  border-bottom: none;
  .el-submenu__title {
    border-bottom: none;
  }
}
</style>
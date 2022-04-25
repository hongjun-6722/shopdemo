<template>
  <div id="IM">
    <div class="hide" @click="lessen()" v-if="!this.lessenstate">
      <i class="el-icon-chat-dot-round"></i>
    </div>
    <transition name="chatroom">
      <div class="chatroom" v-if="this.lessenstate">
        <!-- 标题 -->
        <div class="IM-title">
          <span>商城聊天室</span>
          <div class="current-state">
            <span>{{ userstate }}</span>
            <i class="stateicon" :class="{ stateiconOnline: this.commstate }"></i>
            <el-button type="info" @click="link()" class="link" v-if="!commstate"
              >重新连接</el-button
            >
            <div class="lessen" @click="lessen()">
              <i class="el-icon-remove-outline"></i>
            </div>
          </div>
        </div>
        <div class="IM-main">
          <!-- 信息框 -->
          <div class="messages">
            <div class="container">
              <div class="slideshow" ref="slide">
                <div
                  class="message message-left"
                  v-for="(message, index) in messages"
                  :key="index"
                >
                  <div class="user-info">
                    <!-- <el-avatar shape="square" :size="'small'"></el-avatar> -->
                    <span class="message-username">{{ message.nickname }}</span>
                  </div>
                  <p class="message-text">{{ message.data }}</p>
                </div>
              </div>
            </div>
            <div class="input-field">
              <el-input placeholder="请输入" v-model="inputcontent">
                <template slot="append"
                  ><el-button type="success" @click="Sendmessage()"
                    >GO</el-button
                  ></template
                >
              </el-input>
            </div>
          </div>
          <!-- 用户列表 -->
          <div class="users">
            <div class="users-slide">
              <div class="user" v-for="(user, index) in users" :key="index">
                <!-- <el-avatar shape="square" :size="'small'"></el-avatar> -->
                <span class="user-username">{{ user.nickname }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputcontent: "", //输入栏输入
      commstate: 0, //通信状态 0:离线 1：在线
      users: [], //用户列表
      messages: [], //消息列表
      globalMessageTip: [], //浏览器接受信息
      Socket: null, //ws连接
      timer: null, //定时器
      lessenstate:true,
    };
  },

  props: {
    autologin: {
      type: String,
      required: true,
    }, //自动登录 0：正在登录 1：已登录 2：登录失败
    loginstatus: {
      type: String,
      required: true,
    }, //登录 0：未登录 1：已登录
  },

  computed: {
    // squareUrl(username) {
    //   return;
    // },
    userstate() {
      if (this.commstate == 0) {
        return "离线";
      } else {
        return "在线";
      }
    }, //用户状态
  },

  methods: {
    initwebsocket() {
      if (this.timer) {
        this.clearautologin();
      } //清除定时器

      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        this.socket = new WebSocket(`${process.env.VUE_WSSAPI}`);
        //打开事件
        this.socket.onopen = this.onopen;
        //获得消息事件
        this.socket.onmessage = this.onmessage;
        //关闭事件
        this.socket.onclose = this.onclose;
        //错误事件
        this.socket.onerror = this.onerror;
      }
    }, //ws连接
    link() {
      if (this.$cookies.get("token")) {
        this.initwebsocket();
      } else {
        alert("请先登录");
      }
    }, //重连
    createmessage(type, user, data) {
      return JSON.stringify({
        type: type,
        user: user,
        data: data,
      });
    }, //消息结构
    Sendmessage() {
      let usermsg = this.createmessage(
        "usermsg",
        `${this.$store.state.username}`,
        `${this.inputcontent}`
      );
      this.socket.send(usermsg);
      console.log(usermsg);

      this.inputcontent = "";
      if (this.$refs.slide) {
        this.$refs.slide.scrollIntoView(false);
      } //底端对齐
    }, //发送消息
    onopen() {
      console.log("websocket已打开");
      this.commstate = 1;
      sessionStorage.setItem("username", this.$store.state.username);

      let joinmsg = this.createmessage(
        "join",
        `${this.$store.state.username}`,
        `用户${this.$store.state.username}加入聊天室`
      );
      this.socket.send(joinmsg);
      console.log(joinmsg);
    }, //连接成功
    onmessage(msg) {
      if (typeof msg.data == "string") {
        var msgdata = JSON.parse(msg.data);
        if (msgdata.data) {
          msgdata.data = msgdata.data.toString();
        }
        if (msgdata.errmsg) {
          console.log(msgdata.errmsg);
        }
      }
      console.log(msgdata);

      if (msgdata.type == "join") {
        this.users.push({ nickname: msgdata.nickname });
        this.messages.push(msgdata);
      } else if (msgdata.type == "exit") {
        this.users = this.users.filter((item) => {
          return item.nickname != msgdata.nickname;
        });
        this.messages.push(msgdata);
      } else if (msgdata.type == "usermsg") {
        this.messages.push(msgdata);
      } else if (msgdata.type == "usertable") {
        this.users = msgdata.usertable;
      }

      if (this.$refs.slide) {
        this.$refs.slide.scrollIntoView(false); //底端对齐
      }
    }, //接收信息
    onclose() {
      let nickname = sessionStorage.getItem("username");
      let exitmsg = this.createmessage(
        "exit",
        `${nickname}`,
        `用户${nickname}退出聊天室`
      );
      this.socket.send(exitmsg);
      this.commstate = 0;
      sessionStorage.clear("username");
      this.socket.close("1001", "用户");
    }, //ws关闭
    onerror() {
      console.log("websocket发生了错误");
    }, //ws错误
    clearautologin() {
      clearInterval(this.timer);
    }, //清除定时器
    lessen(){
      this.lessenstate = !this.lessenstate;
    }
  },

  watch: {
    loginstatus() {
      if (this.loginstatus == "0") {
        this.onclose();
      } else if (this.loginstatus == "1") {
        this.link();
      }
    }, //监听登录状态
    messages() {
      if (this.$refs.slide) {
        this.$refs.slide.scrollIntoView(false); //底端对齐
      }
    },
  },

  mounted() {
    this.$refs.slide.scrollIntoView(false); //底端对齐

    this.timer = setInterval(() => {
      if (this.autologin == "1") {
        this.initwebsocket();
      } else if (this.autologin == "2") {
        if (this.timer) {
          this.clearautologin();
        }
      }
    }, 1000); //轮询判断自动登录
  },
};
</script>
<style lang='less'>

#IM {
  .hide {
    height: 40px;
    width: 40px;
    bottom: 205px;
    position: relative;
    background: #ffc5c5;
    border: 2px solid #2c3e50;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1;
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      color: #ff6363;
      transform: translate(-50%, -50%) scale(2.3);
    }
  }
  .chatroom {
    height: 250px;
    width: 500px;
    box-sizing: border-box;
    border: 1px solid rgba(128, 128, 128, 0.5);
    box-shadow: rgba(128, 128, 128, 0.5) 5px 2px 2px 1px;
    border-radius: 5px 0 0 5px;
    background: #ff6363;
  }
}
.IM-title {
  height: 40px;
  & > span {
    text-align: left;
    color: #000;
    font: bold 16px/40px "Micorsoft Yahei";
    letter-spacing: 4px;
    margin-left: 5px;
  }
  .current-state {
    height: 30px;
    margin: 5px;
    float: right;
    span {
      text-align: left;
      color: #000;
      font: bold 16px/30px "Micorsoft Yahei";
    }
    .el-button {
      padding: 0 2px;
    }
  }
  .link {
    display: inline-block;
  }
  .lessen{
    display: inline-block;
    cursor: pointer;
  }
}
.IM-main {
  height: calc(~"100% - 45px");
  display: table;
  white-space: -1em;
  color: #000;
  .messages {
    width: 390px;
    height: 100%;
    margin: 0 5px;
    border: 1px solid rgba(128, 128, 128, 0.5);
    border-radius: 4px;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    position: relative;
    background: #fff;
    .input-field {
      height: 40px;
      width: 96%;
      position: absolute;
      left: 2%;
      .el-input__inner:focus {
        border: 1px solid rgba(128, 128, 128, 0.5);
      }
    }
    .message {
      margin-bottom: 5px;
      p {
        margin: 0;
      }
      .message-text {
        max-width: 330px;
        margin-top: 5px;
        font: normal 14px/28px "Micorsoft Yahei";
        background: #fff;
        border-radius: 5px;
        display: inline-block;
        border: solid 1px rgba(128, 128, 128, 0.5);
        background: rgba(135, 223, 233, 0.329);
      }
      .user-info {
        text-align: left;
        display: inline-block;
        vertical-align: top;
        .message-username {
          font: bold 16px/28px "Micorsoft Yahei";
          vertical-align: top;
        }
      }
    }
  }
  .users {
    width: 95px;
    height: 100%;
    border: 1px solid rgba(128, 128, 128, 0.5);
    border-radius: 4px;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: top;
    background: #fff;
    .user {
      height: 28px;
      margin-bottom: 5px;
      .user-username {
        font: bold 16px/28px "Micorsoft Yahei";
        vertical-align: top;
      }
    }
  }
}
.messages {
  .container {
    position: relative;
    height: calc(~"100% - 45px");
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .slideshow {
    position: absolute;
    width: 100%;
  }
  .container::-webkit-scrollbar {
    display: none;
  }
} //滑动
.users {
  position: relative;
  overflow-y: scroll;
  overflow-x: hidden;
  .users-slide {
    position: absolute;
  }
  &::-webkit-scrollbar {
    display: none;
  }
} //滑动
.stateicon {
  width: 10px;
  height: 10px;
  background-color: gray;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
.stateiconOnline {
  background-color: rgb(0, 255, 0);
}
</style>
<style>
.chatroom-enter,.chatroom-leave-to{
  opacity: 0;
}
.chatroom-enter-active,.chatroom-leave-active{
  transition: opacity 0.4s;
}
</style>
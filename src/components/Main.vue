<template>
  <el-container>
    <el-header style="z-index: 99;padding-left: 15px;" width="100%">
      <div class="right">
        <span>欢迎 {{this.userId}} </span>
        <div class="logout"><span class="txt" v-on:click="gotoUserInfo">查看个人信息</span></div>
        <div class="logout"><span class="txt" v-on:click="logout">退出登录</span></div>
      </div>
    </el-header>
    <el-main>
      <el-button type="primary" v-on:click="gotoVirtualScene">选择该场景</el-button>
    </el-main>
  </el-container>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        userId: this.$store.state.currentId,
        userData: [
          {
            id: "lvchangze",
            age: 22,
            gender: 1
          }
        ],
        // websocket: this.$store.getters.getSocketConn,
      }
    },
    created() {
      // this.$axios.post("/listAllUsers", "")
      //   .then(resp => {
      //     this.userData = resp.data.allUsers
      //     for (let i = 0; i < this.userData.length; i++) {
      //       if (this.userData[i].gender === 0) {
      //         this.userData[i].gender = "男"
      //       } else {
      //         this.userData[i].gender = "女"
      //       }
      //     }
      //   })

      //连接后端的WebSocket
      // if (window.WebSocket) {
      //   const websocket = this.$store.getters.getSocketConn;
      //
      //   //第一次连接websocket
      //   websocket.onopen = function () {
      //     websocket.send(localStorage.getItem("currentId"));
      //     console.log("WebSocket连接成功");
      //   };
      //
      //   //接收到消息
      //   websocket.onmessage = function (event) {
      //     console.log(event.data)
      //   };
      //   //连接发生错误
      //   websocket.onerror = function () {
      //     console.log("WebSocket连接发生错误");
      //   };
      //   //连接关闭
      //   websocket.onclose = function () {
      //     console.log("WebSocket连接关闭");
      //   };
      //   //监听窗口关闭事件，当窗口关闭时，主动关闭websocket连接
      //   window.onbeforeunload = function () {
      //     websocket.close()
      //   };
      // }
    },

    methods: {
      logout() {
        this.$store.commit('logout')
        this.$router.push('/login');
        // this.websocket.close()
      },
      gotoUserInfo() {
        this.$router.push('/UserInfo')
      },
      gotoVirtualScene() {
        this.$router.push('/VirtualScene')
      },
    },

  }
</script>

<style scoped>
  .el-header {
    text-align: center;
    line-height: 60px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .08)
  }

  .el-header .right .logout {
    margin-left: 20px;
    display: inline-block;
  }

  .el-header .right .logout .txt {
    cursor: pointer;
    color: #939699;
    font-size: 13px;
  }

  .el-header .right .logout .txt:hover {
    color: black;
  }

  .right {
    float: right;
    font-size: 14px;
    cursor: pointer;
  }

</style>


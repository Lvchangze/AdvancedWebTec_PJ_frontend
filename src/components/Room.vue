<template>
  <el-container class="room-wrapper">
    <el-aside class="chat-block" width="30%">
      <Chat :chat-list="chatList" :ws="webSocket"/>
    </el-aside>
    <el-main class="scene-block">
      main
    </el-main>
  </el-container>
</template>

<script>
  import Chat from "./Chat";

  export default {
    name: "Room",
    components: {
      Chat
    },
    props: ['roomId'],
    data() {
      return {
        webSocket: null,
        userId: this.$store.state.currentId,
        chatList: [],
        positionList: []
      }
    },
    methods: {
      initWebSocket() {
        this.webSocket = new WebSocket("ws://localhost:8080/ws/" + this.roomId + "/" + this.userId);

        let that = this;

        //建立连接
        this.webSocket.onopen = function () {
          console.log("ws连接成功");
        };

        this.webSocket.onmessage = function (event) {
          //获取服务端消息
          const message = JSON.parse(event.data) || {};
          console.log(message);
          switch (message.type) {
            case "ENTER":
              that.handleEnter(message.userId);
              break;
            case "QUIT" :
              that.handleQuit(message.userId);
              break;
            case "SPEAK":
              that.handleSpeak(message.userId, message.msg);
              break;
            default:
              break;
          }
        };

        this.webSocket.onclose = function (event) {
          console.log('ws关闭连接');
        };

        this.webSocket.onerror = function (event) {
          console.log('ws发生异常');
        };

        window.onbeforeunload = function () {
          this.webSocket.close()
        };
      },
      handleEnter(userId) {
        this.$message.info(userId + "进入房间！");
      },
      handleQuit(userId) {
        this.$message.info(userId + "退出房间！");
      },
      handleSpeak(userId, message) {
        this.chatList.push(
          {
            userId: userId,
            msg: message
          }
        )
      }
    },
    mounted() {
      this.initWebSocket();
    }
  }
</script>

<style scoped>
  .room-wrapper {
    height: 100%;
  }

  .chat-block {
    height: 100%;
  }

  .scene-block {
    height: 100%;
  }

</style>

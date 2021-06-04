<template>
  <el-container class="room-wrapper">
    <el-aside class="chat-block" width="30%">
      <Chat :chat-list="chatList" :ws="webSocket" @lock="changeLock"/>
    </el-aside>
    <el-main class="scene-block">
      <hanoi-tower ref="virtualScene" v-if="roomId < 4" :ws="webSocket"
                   :disk-count="diskCount" :move-lock="moveLock" @npc="chatToNpc"/>
    </el-main>
  </el-container>
</template>

<script>
  import Chat from "./Chat";
  import HanoiTower from "./HanoiTower";

  export default {
    name: "Room",
    components: {
      Chat,
      HanoiTower
    },
    props: ['roomId'],
    data() {
      return {
        webSocket: null,
        userId: this.$store.state.currentId,
        chatList: [{
          userId:'小提示',
          msg:'靠近按F可拿起或放下'
        }],
        diskCount:0,
        moveLock:false
      }
    },
    methods: {
      chatToNpc(id){
        this.chatList.push({
          userId:'萨勒芬妮',
          msg:"你好呀" + id + "!"
        })
      },
      changeLock(state){
        this.moveLock = state;
      },
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
          switch (message.type) {
            case "ENTER":
              that.handleEnter(message.userId,message.msg);
              break;
            case "ROLE":
              that.$refs.virtualScene.handleRole(message.userId,message.msg);
              break;
            case "QUIT" :
              that.handleQuit(message.userId);
              break;
            case "SPEAK":
              that.handleSpeak(message.userId, message.msg);
              break;
            case "POSITION":
              that.$refs.virtualScene.handlePosition(message.userId,message.msg);
              break;
            case "LIFT":
              that.$refs.virtualScene.handleLift(message.userId, message.msg);
              break;
            case "DROP":
              that.$refs.virtualScene.handleDrop(message.userId, message.msg);
              break;
            case "DISK":
              that.$refs.virtualScene.handleDisk(message.msg);
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
      handleEnter(userId,role) {
        this.$message.info(userId + "进入房间！");
      },
      handleQuit(userId) {
        this.$refs.virtualScene.handleQuit(userId);
        this.$message.info(userId + "退出房间！");
      },
      handleSpeak(userId, message) {
        this.chatList.push(
          {
            userId: userId,
            msg: message
          }
        )
      },
    },
    mounted() {
      this.diskCount = Number(this.roomId) + 2;
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

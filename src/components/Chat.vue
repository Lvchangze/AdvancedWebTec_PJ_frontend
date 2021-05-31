<template>
  <div class="chat-wrapper">
    <div class="chat-box">
      <div v-for="message in chatList">

        <!--发言者为此时用户-->
        <div v-if="message.userId==userId">
          <el-row>
            <el-col :span="2">
              <p></p>
            </el-col>
            <el-col :span="18">
              <el-alert :closable="false" type="success">{{message.msg}}</el-alert>
            </el-col>
            <el-col :span="4">
              <div>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
                <p class="name-demo">{{message.userId}}</p>
                <br>
              </div>
            </el-col>
          </el-row>
        </div>

        <!--发言者不是此时用户-->
        <div v-if="message.userId!=userId">
          <el-row>
            <el-col :span="4">
              <div>
                <el-avatar icon="el-icon-user-solid"></el-avatar>
                <p class="name-demo">{{message.userId}}</p>
                <br>
              </div>
            </el-col>
            <el-col :span="18">
              <el-alert :closable="false" type="info">{{message.msg}}</el-alert>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="input-box">
      <el-row>
        <el-col :span="14">
          <el-input v-model="msg" @focus="moveLock = false" @blur="moveLock = true"></el-input>
        </el-col>
        <el-col :span="5">
          <el-button @click="sendMessage" round type="success">发送</el-button>
        </el-col>
        <el-col :span="5">
          <el-button @click="back" round type="primary">退出</el-button>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Chat",
    props: ['ws', 'chatList','moveLock'],
    data() {
      return {
        userId: this.$store.state.currentId,
        msg: ""
      }
    },
    methods: {
      back() {
        this.ws.close();
        this.$router.replace({path: "/main"})
      },
      sendMessage() {
        let that = this;
        if (this.msg === "") {
          this.$message.warning("输入不得为空!");
          return;
        }
        this.ws.send(
          JSON.stringify(
            {
              type: "SPEAK",
              userId: that.userId,
              msg: that.msg,
              time: ""
            }
          )
        );
        this.msg = "";
      }
    }
  }
</script>

<style scoped>
  .chat-wrapper {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .name-demo {
    font-size: 10px;
  }

  .input-box {
    height: 5%;
    min-height: 20px;
    padding: 5px;
  }

  .chat-box {
    padding-top: 15px;
    height: 90%;
    overflow: auto;
  }

</style>

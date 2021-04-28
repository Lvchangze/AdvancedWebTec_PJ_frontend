<template>
  <el-container>
    <el-main>
      <h2>欢迎{{ this.userId }}</h2>
      <el-button type="primary" v-on:click="logout">退出登录</el-button>
      <el-table
        :data="userData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import * as Three from 'three'

export default {
  name: 'Main',
  data() {
    return {
      userId: this.$store.state.currentId,
      userData: [],
      websocket: this.$store.getters.getSocketConn,

      // camera: null,
      // scene: null,
      // renderer: null,
      // mesh: null
    }
  },
  created() {
    this.$axios.post("/listAllUsers", "")
      .then(resp => {
        this.userData = resp.data.allUsers
        for (let i = 0; i < this.userData.length; i++) {
          if (this.userData[i].gender === 0) {
            this.userData[i].gender = "男"
          } else {
            this.userData[i].gender = "女"
          }
        }
        console.log(resp)
      })

    //连接后端的WebSocket
    if (window.WebSocket) {
      var websocket = this.$store.getters.getSocketConn

      //第一次连接websocket
      websocket.onopen = function () {
        websocket.send(localStorage.getItem("currentId"));
        console.log("WebSocket连接成功");
      };

      //接收到消息
      websocket.onmessage = function (event) {
        console.log(event.data)
      };
      //连接发生错误
      websocket.onerror = function () {
        console.log("WebSocket连接发生错误");
      };
      //连接关闭
      websocket.onclose = function () {
        console.log("WebSocket连接关闭");
      };
      //监听窗口关闭事件，当窗口关闭时，主动关闭websocket连接
      window.onbeforeunload = function () {
        websocket.close()
      };
    }
  },

  mounted() {
    // this.init();
    // this.animate()
  },

  methods: {
    logout() {
      this.$store.commit('logout')
      this.$router.push('/login');
      this.websocket.close()
    },

    // init: function () {
    //   let container = document.getElementById('container');
    //   this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10);
    //   this.camera.position.z = 1;
    //
    //   this.scene = new Three.Scene();
    //
    //   let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
    //   let material = new Three.MeshNormalMaterial();
    //
    //   this.mesh = new Three.Mesh(geometry, material);
    //   this.scene.add(this.mesh);
    //
    //   this.renderer = new Three.WebGLRenderer({antialias: true});
    //   this.renderer.setSize(container.clientWidth, container.clientHeight);
    //   container.appendChild(this.renderer.domElement);
    //
    // },
    // animate: function () {
    //   requestAnimationFrame(this.animate);
    //   this.mesh.rotation.x += 0.01;
    //   this.mesh.rotation.y += 0.02;
    //   this.renderer.render(this.scene, this.camera);
    // }
  },

}
</script>
<style scoped>
#container {
  height: 400px;
}
</style>

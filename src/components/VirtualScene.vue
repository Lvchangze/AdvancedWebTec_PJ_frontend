<template>
  <el-container>
    <div class="test-wrapper">
      <div id="container"></div>
    </div>
    <el-form>
      <el-form-item>
        <el-input auto-complete="off"
                  placeholder="请输入聊天内容"
                  type="textarea"
                  v-model="sendMsg"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round
                   style="background-color: #356eff;border-color: #356eff;width: 260px;border-radius: 3px;margin-top: 25px;margin-bottom: 5px"
                   type="primary" v-on:click="sendMessage">发送
        </el-button>
      </el-form-item>
      <ul>
        <template v-for="list in chatList">
          <li>
            {{ list.userId }}
          </li>
          <li>
            {{ list.msg }}
          </li>
        </template>
      </ul>
    </el-form>


  </el-container>
</template>

<script>
  import * as Three from 'three'
  import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
  import {MMDLoader} from 'three/examples/jsm/loaders/MMDLoader'

  export default {
    name: "Test",
    data() {
      return {
        container: null,
        camera: null,
        scene: null,
        renderer: null,
        orbitControls: null,
        mobileControls: null,
        model: null,
        moveForward: false,
        moveLeft: false,
        moveBackward: false,
        moveRight: false,

        userId: this.$store.state.currentId,
        webSocketChat: null,
        sendMsg: "",
        chatList: [],
      }
    },
    methods: {
      init() {
        this.initContainer();
        this.initScene();
        this.initCamera();
        this.initWebGLRender();
        this.initLight();
        this.initBase();
        this.initPerson();
        this.render();
        this.initControls();
        this.initMobile();
      },
      initContainer() {
        this.container = document.getElementById('container');
      },
      initScene() {
        this.scene = new Three.Scene();
      },
      initCamera() {
        this.camera = new Three.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 1, 5000);
        this.camera.position.set(-125, 250, -500);
        this.camera.lookAt(this.scene.position);
      },
      initWebGLRender() {
        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
      },
      initLight() {
        //点光源
        let point = new Three.PointLight(0x888888);
        point.position.set(-400, 200, -300);
        this.scene.add(point);

        //环境光
        let ambientLight = new Three.AmbientLight(0x666666);
        this.scene.add(ambientLight);
      },
      initBase() {
        let stick = new Three.Mesh(
          new Three.CylinderGeometry(3, 3, 160, 100),
          new Three.MeshLambertMaterial({color: 0x754E2F})
        );
        stick.position.set(-200, 80, 100);

        let stick1 = stick.clone();
        stick1.position.set(0, 80, 100);

        let stick2 = stick.clone();
        stick2.position.set(200, 80, 100);

        let sticks = new Three.Group();
        sticks.add(stick);
        sticks.add(stick1);
        sticks.add(stick2);
        this.scene.add(sticks);

        let base = new Three.Mesh(
          new Three.BoxGeometry(1200, 10, 700),
          new Three.MeshLambertMaterial({color: 0xC7C739})
        );
        base.position.set(0, -5, 0);
        this.scene.add(base);
      },
      initPerson() {
        let that = this;
        let loader = new MMDLoader();
        /*let helper = new MMDAnimationHelper();
        loader.loadWithAnimation('static/烟绯/烟绯.pmx','static/Walk.vmd',function (mmd) {
          helper.add(mmd.mesh,{
            animation: mmd.animation,
            physics:true
          });
          that.model = mmd.mesh;
          that.scene.add(mmd.mesh);

        })*/
        loader.load('static/烟绯/烟绯.pmx', function (mesh) {
          that.model = mesh;
          mesh.scale.multiplyScalar(7);
          mesh.position.set(0, 0, -170);
          that.scene.add(mesh);
        })
      },
      render() {
        let that = this;
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        //this.renderer.shadowMap.enabled = true;

        if (this.moveForward) {
          this.model.position.z += 5;

        }
        if (this.moveBackward) {
          this.model.position.z -= 5;
        }
        if (this.moveLeft) {
          this.model.position.x += 5;

        }
        if (this.moveRight) {
          this.model.position.x -= 5;
        }
      },
      initControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableZoom = false;
      },
      initMobile() {
        let that = this;

        let onKeyDown = function (e) {
          switch (e.key) {
            case 'a':
              that.moveLeft = true;
              break;
            case 's':
              that.moveBackward = true;
              break;
            case 'd':
              that.moveRight = true;
              break;
            case 'w':
              that.moveForward = true;
              break;
          }
        };
        let onKeyUp = function (e) {
          switch (e.key) {
            case 'a':
              that.moveLeft = false;
              break;
            case 's':
              that.moveBackward = false;
              break;
            case 'd':
              that.moveRight = false;
              break;
            case 'w':
              that.moveForward = false;
              break;
          }
        };

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
      },

      initWebSocketChat() {
        this.webSocketChat = new WebSocket('ws://localhost:8080/1')

        this.webSocketChat.onopen = function () {
          console.log("WebSocketChat连接成功");
        };

        let that = this;
        this.webSocketChat.onmessage = function (event) {
          //获取服务端消息
          const message = JSON.parse(event.data) || {};
          console.log(message)
          if (message.type === "SPEAK") {
            that.chatList.push(message)
          }
        };

        this.webSocketChat.onclose = function (event) {
          console.log('WebSocketChat关闭连接');
        };

        this.webSocketChat.onerror = function (event) {
          console.log('WebSocketChat发生异常');
        };

        window.onbeforeunload = function () {
          this.webSocketChat.close()
        };
      },
      sendMessage() {
        if (this.sendMsg !== "") {
          this.webSocketChat.send(JSON.stringify({
            userId: this.userId,
            msg: this.sendMsg,
          }))
          this.sendMsg = ""
        } else {
          this.$message.error("请输入聊天内容")
        }
      },
    },
    mounted() {
      this.init();
      this.initWebSocketChat()
      this.sendMessage()
    },
  }
</script>

<style scoped>
  .test-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;
  }

  #container {
    position: fixed;
    display: block;
    height: 100%;
    width: 100%;
    margin: 0;
    color: rgb(34, 27, 117);
  }
</style>

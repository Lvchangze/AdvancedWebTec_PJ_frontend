<template>
  <div class="hanoi-tower-wrapper">
    <div id="hanoi-scene"></div>
  </div>
</template>

<script>
  import * as Three from "three";
  import {MMDLoader} from "three/examples/jsm/loaders/MMDLoader";
  import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

  export default {
    name: "HanoiTower",
    props:["ws","diskCount"],
    data() {
      return {
        players:null,
        container: null,
        camera: null,
        scene: null,
        renderer: null,
        orbitControls: null,
        mobileControls: null,
        moveForward: false,
        moveLeft: false,
        moveBackward: false,
        moveRight: false,
        userId: this.$store.state.currentId,
        disks:[]
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
        this.render();
        this.initControls();
        this.initMobile();
      },
      initContainer() {
        this.container = document.getElementById('hanoi-scene');
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
      render() {
        let that = this;
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        //this.renderer.shadowMap.enabled = true;
        if (!this.players.has(this.userId)) return;

        if (this.moveForward) {
          this.players.get(this.userId).position.z += 5;
        }
        if (this.moveBackward) {
          this.players.get(this.userId).position.z -= 5;
        }
        if (this.moveLeft) {
          this.players.get(this.userId).position.x += 5;
        }
        if (this.moveRight) {
          this.players.get(this.userId).position.x -= 5;
        }

        if (this.moveLeft || this.moveRight || this.moveBackward || this.moveForward)
          this.sendPosition();

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
      handleEnter(userId,role){
        let that = this;
        let loader = new MMDLoader();
        let modelUrl = 'static/models/' + role + '/' + role + '.pmx';
        loader.load(modelUrl, function (mesh) {
          that.players.set(userId,mesh);
          mesh.scale.multiplyScalar(7);
          mesh.position.set(0, 0, -170);
          that.scene.add(mesh);
        });
      },
      handleQuit(userId){
        this.scene.remove(this.players.get(userId))
      },
      handleLift(userId, msg) {

      },
      handleDrop(userId, msg) {

      },
      handleMove(userId,position){
        if (userId===this.userId) return;
        let jsonPosition = JSON.parse(position)
        this.players.get(userId).position.set(jsonPosition.x,jsonPosition.y,jsonPosition.z);
      },
      sendPosition(){
        let that = this;
        let userId = this.userId;
        this.ws.send(
          JSON.stringify(
            {
              type:"MOVE",
              userId:userId,
              msg:JSON.stringify(
                {
                  x:that.players.get(userId).position.x,
                  y:that.players.get(userId).position.y,
                  z:that.players.get(userId).position.z,
                }
              ),
              time:""
            }
          )
        )
      },
      sendLift(num){
        let userId = this.userId;
        this.ws.send(
          JSON.stringify(
            {
              type:"LIFT",
              userId:userId,
              msg:num,
              time:""
            }
          )
        )
      },
      sendDrop(num){
        let userId = this.userId;
        this.ws.send(
          JSON.stringify(
            {
              type:"DROP",
              userId:userId,
              msg:num,
              time:""
            }
          )
        )
      }
    },
    mounted() {
      let stick1 = [];
      for (let i = this.diskCount; i > 0; i++) {
        stick1.push(i);
      }
      this.disks.push(stick1);
      this.disks.push([]);
      this.disks.push([]);

      this.players = new Map();
      this.init();
    }
  }
</script>

<style scoped>

  .hanoi-tower-wrapper, #hanoi-scene {
    height: 100%;
  }
</style>

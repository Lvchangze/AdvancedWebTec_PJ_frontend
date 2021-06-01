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
    props:["ws","diskCount","moveLock"],
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
        diskModels:[],
        disks:[],
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
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
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
        for (let i = 0; i < 3; i++) {
          let stick = new Three.Mesh(
            new Three.CylinderGeometry(3, 3, 160, 100),
            new Three.MeshLambertMaterial({color: 0x754E2F})
          );
          stick.position.set(-200 + i * 200, 80, 100);
          this.scene.add(stick);
        }

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
        if (that.moveLock) return;

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
          console.log(that.moveLock);
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
      handleRole(userId,role){
        let loader = new MMDLoader();
        let modelUrl = 'static/models/' + role + '/' + role + '.pmx';
        let g = new Three.Group();
        loader.load(modelUrl, function (mesh) {
          //that.players.set(userId,mesh);
          mesh.scale.multiplyScalar(7);
          //mesh.position.set(0, 0, 0);
          g.add(mesh);
        });
        let textLoader = new Three.FontLoader();
        textLoader.load('static/helvetiker_bold.typeface.json',font=>{
          let geometry = new Three.TextGeometry( userId, {
            font: font,
            size: 10,
            height: 5,
            bevelThickness: 1,
            bevelSize: 8,
          } );
          let mesh = new Three.Mesh(geometry, new Three.MeshLambertMaterial({color: 0xCC3E38})
          );
          mesh.scale.set(-1,1,1);
          mesh.position.set(25, 150, 0);
          g.add(mesh);
        });
        g.position.set(0,0,-170);
        this.scene.add(g);
        this.players.set(userId,g);
      },
      handleQuit(userId){
        this.scene.remove(this.players.get(userId))
      },
      handleDisk(msg){
        this.disks = JSON.parse(msg);
        for (let i = 0; i < this.diskCount; i++) {
          let disk = new Three.Mesh(
            new Three.CylinderGeometry(20 + i*5, 20 + i*5, 10, 100),
            new Three.MeshLambertMaterial({color: 0x76BF66})
          );
          this.diskModels.push(disk);
          //在柱子上
          if (this.disks[i].location < 4){
            disk.position.set(-400 + this.disks[i].location * 200,-5 + this.disks[i].position * 10, 100);
            this.scene.add(disk);
          }
          //在人手上
          else {
            disk.position.set(0, 100, 60);
            this.players.get().add(disk);
          }
        }
      },
      handleLift(userId, msg) {
        this.liftObject(userId,Number(msg));
      },
      handleDrop(userId, msg) {
        let jsonDrop = JSON.parse(msg);
        this.dropObject(userId,jsonDrop.num,jsonDrop.stick);
      },
      handlePosition(userId,position){
        if (userId===this.userId) return;
        let jsonPosition = JSON.parse(position);
        this.players.get(userId).position.set(jsonPosition.x,jsonPosition.y,jsonPosition.z);
      },
      sendPosition(){
        let that = this;
        let userId = this.userId;
        this.ws.send(
          JSON.stringify(
            {
              type:"POSITION",
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
      sendDrop(num,stick){
        let userId = this.userId;
        this.ws.send(
          JSON.stringify(
            {
              type:"DROP",
              userId:userId,
              msg:JSON.stringify(
                {
                  num:num,
                  stick:stick
                }
              ),
              time:""
            }
          )
        )
      },
      sendDisk(){
        let userId = this.userId;
        this.ws.send(
          JSON.stringify(
            {
              type:"DISK",
              userId:userId,
              msg:JSON.stringify(this.disks),
              time:""
            }
          )
        )
      },
      /*moveObject(object,x1,y1,z1,x2,y2,z2,intervalTime){
        let startTime = Date.now();
        let moveState;
        function moveTick() {
          let nowTime = Date.now();
          let elapsed = nowTime - startTime;
          let x = (x1 * (intervalTime - elapsed) + x2 * elapsed)/intervalTime;
          let y = (y1 * (intervalTime - elapsed) + y2 * elapsed)/intervalTime;
          let z = (z1 * (intervalTime - elapsed) + z2 * elapsed)/intervalTime;
          object.position.set(x,y,z);
          moveState = requestAnimationFrame(moveTick);
        }
        setTimeout(function () {
          cancelAnimationFrame(moveState);
        },intervalTime);
      },*/
      liftObject(userId,num){
        this.scene.remove(this.diskModels[num]);
        this.diskModels[num].position.set(0, 100, 60);
        this.players.get(userId).add(this.diskModels[num]);
        this.disks[num].location = 4;
        this.disks[num].position = userId;
      },
      dropObject(userId,num,stick){
        let count = 1;
        for (let i = 0; i < this.diskCount; i++) {
          if (i===num) continue;
          if (this.disks[i].location===stick) count++;
        }
        this.diskModels[num].position.set(-400 + stick * 200,-5 + count * 10, 100);
        this.players.get(userId).remove(this.diskModels[num]);
        this.scene.add(this.diskModels[num]);
        this.disks[num].location = stick;
        this.disks[num].position = count;
      }
    },
    mounted() {
      /*this.disks = new Array(4);
      for (let i = this.diskCount; i > 0; i--) {
        this.disks[0].push(i);
      }*/

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

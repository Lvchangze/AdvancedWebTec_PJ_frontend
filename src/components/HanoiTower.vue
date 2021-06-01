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
        diskState:3,
        diskSelected:-1,
        stickNearby:-1
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
            case 'f':
              that.diskAction();
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
        loader.load(modelUrl, function (model) {
          //that.players.set(userId,model);
          model.scale.multiplyScalar(7);
          //model.position.set(0, 0, 0);
          g.add(model);
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
          let textMesh = new Three.Mesh(geometry, new Three.MeshLambertMaterial({color: 0xCC3E38})
          );
          textMesh.scale.set(-1,1,1);
          textMesh.position.set(25, 150, 0);
          g.add(textMesh);
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
        this.diskState = 1;
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
            this.diskState = 3;
            disk.position.set(0, 100, 60);
            this.players.get(this.disks[i].position).add(disk);
          }
        }
        console.log(this.diskModels);
      },
      handleLift(userId, msg) {
        if (userId===this.userId) return;
        this.liftObject(userId,Number(msg));
        this.diskState = 3;
        this.diskSelected = Number(msg);
      },
      handleDrop(userId, msg) {
        if (userId===this.userId) return;
        let jsonDrop = JSON.parse(msg);
        this.dropObject(userId,jsonDrop.num,jsonDrop.stick);
        this.diskState = 1;
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
      },
      diskAction(){
        this.judgeDisk();
        if (this.diskState===3 || this.diskSelected < 0 || this.stickNearby < 0) return;
        if (this.diskState===1){
          this.liftObject(this.userId,this.diskSelected);
          this.sendLift(this.diskSelected);
          this.diskState = 2;
          this.sendDisk();
          return;
        }
        if (this.diskState===2){
          //判断盘子是否可以放置
          let minNum = 6;
          for (let i = 0; i < this.diskCount; i++) {
            if (this.disks[i].location===this.stickNearby){
              minNum = i;
              break;
            }
          }
          if (minNum < this.diskSelected){
            this.$message.warning("大盘子不得放在小盘子上方");
            return;
          }
          this.dropObject(this.userId,this.diskSelected,this.stickNearby);
          this.sendDrop(this.diskSelected,this.stickNearby);
          this.diskState = 1;
          this.sendDisk();
        }
      },
      judgeDisk(){
        if (this.diskState===3) return;
        for (let i = 0; i < 3; i++) {
          if (Math.abs(this.players.get(this.userId).position.x + 200 - i*200) < 20 &&
            Math.abs(this.players.get(this.userId).position.z - 100) < 20){
            this.stickNearby = i+1;
            break;
          }
        }
        if (this.diskState===2) return;
        for (let i = 0; i < this.diskCount; i++) {
          if (this.disks[i].location===this.stickNearby){
            this.diskSelected = i;
            break;
          }
        }
      }
    },
    mounted() {
      //this.diskModels = new Array(this.diskCount);
      this.players = new Map();
      this.init();
      let that = this;
      setTimeout(function () {
        that.handleDisk(JSON.stringify(
          [{
            location:1,
            position:3
          },{
            location:1,
            position:2
          },{
            location:1,
            position:1
          },
          ]
        ));
      },5000);
      console.log(JSON.stringify(
        [{
          location:1,
          position:5
        },{
          location:1,
          position:4
        },{
          location:1,
          position:3
        },{
          location:1,
          position:2
        },{
          location:1,
          position:1
        },
        ]
      ));
    }
  }
</script>

<style scoped>
  .hanoi-tower-wrapper, #hanoi-scene {
    height: 100%;
  }
</style>

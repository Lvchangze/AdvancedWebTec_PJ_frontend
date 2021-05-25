<template>
  <div class="test-wrapper">
        <div id="container"></div>
  </div>
</template>

<script>
  import * as Three from 'three'
  import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
  import {DragControls} from 'three/examples/jsm/controls/DragControls'
  import {TransformControls} from 'three/examples/jsm/controls/TransformControls'
  import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
  import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
  import {MMDLoader} from 'three/examples/jsm/loaders/MMDLoader'

  export default {
    name: "Test",
    data() {
      return {
        container:null,
        camera: null,
        scene: null,
        renderer: null,
        orbitControls:null,
        mobileControls:null,
        model:null,
        moveForward:false,
        moveLeft:false,
        moveBackward:false,
        moveRight:false,
      }
    },
    methods: {
      init(){
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
      initContainer(){
        this.container = document.getElementById('container');
      },
      initScene(){
        this.scene = new Three.Scene();
      },
      initCamera(){
        this.camera = new Three.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 1, 5000);
        this.camera.position.set(100,150,400);
        this.camera.lookAt(this.scene.position);
      },
      initWebGLRender(){
        this.renderer = new Three.WebGLRenderer({antialias:true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
      },
      initLight(){
        //点光源
        let point = new Three.PointLight(0x888888);
        point.position.set(400,200,300);
        this.scene.add(point);

        //环境光
        let ambientLight = new Three.AmbientLight(0x444444);
        this.scene.add(ambientLight);
      },
      initBase(){
        let stick = new Three.Mesh(
          new Three.CylinderGeometry(3,3,160,100),
          new Three.MeshLambertMaterial({color: 0x754E2F})
        );
        stick.position.set(-200,80,-100);

        let stick1 = stick.clone();
        stick1.position.set(0,80,-100);

        let stick2 = stick.clone();
        stick2.position.set(200,80,-100);

        let sticks = new Three.Group();
        sticks.add(stick);
        sticks.add(stick1);
        sticks.add(stick2);
        this.scene.add(sticks);

        let base = new Three.Mesh(
          new Three.BoxGeometry(1000,10,500),
          new Three.MeshLambertMaterial({color:0xC7C739})
        );
        base.position.set(0,-5,0);
        this.scene.add(base);
      },
      initPerson() {
        let that = this;
        let loader = new MMDLoader();
        loader.load('static/烟绯/烟绯.pmx',function (mesh) {
          that.model = mesh;
          mesh.scale.multiplyScalar(5);
          that.scene.add(mesh);
        })

      },
      render(){
        let that = this;
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene,this.camera);
        this.renderer.shadowMap.enabled = true;

        if (this.moveForward){
          this.model.position.z -= 1;

        }
        if (this.moveBackward){
          this.model.position.z += 1;
        }
        if (this.moveLeft){
          this.model.position.x -= 1;

        }
        if (this.moveRight){
          this.model.position.x += 1;
        }
      },
      initControls(){
        this.orbitControls = new OrbitControls(this.camera,this.renderer.domElement);
        this.orbitControls.enableZoom = false;
      },
      initMobile(){
        let that = this;

        let onKeyDown = function (e) {
          switch (e.key) {
            case 'a':that.moveLeft = true;break;
            case 's':that.moveBackward = true;break;
            case 'd':that.moveRight = true;break;
            case 'w':that.moveForward = true;break;
          }
        };
        let onKeyUp = function (e) {
          switch (e.key) {
            case 'a':that.moveLeft = false;break;
            case 's':that.moveBackward = false;break;
            case 'd':that.moveRight = false;break;
            case 'w':that.moveForward = false;break;
          }
        };

        document.addEventListener('keydown',onKeyDown,false);
        document.addEventListener('keyup',onKeyUp,false);
      },
    },
    mounted() {
      this.init();
    },
  }
</script>

<style scoped>
  .test-wrapper{
    position: fixed;
    width: 100%;
    height: 100%;
  }

#container{
  position: fixed;
  display: block;
  height: 100%;
  width: 100%;
  margin: 0;
  color: rgb(34,27,117);
}
</style>

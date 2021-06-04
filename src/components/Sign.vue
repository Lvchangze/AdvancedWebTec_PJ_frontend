<template>
  <div class="sign_wrapper">
    <el-container>
      <!--侧边 3d展示-->
      <el-aside width="40%">
        <div id="sign_scene"></div>
      </el-aside>

      <!--登录和注册组件-->
      <el-main>
        <div class="sign_form_wrapper">
          <el-row>
            <el-col :span="8">
              <div>
                <img
                  src="../assets/cas_logo.png"
                  style="width: 50px;height: 50px"/>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="form_title">统一身份认证</div>
            </el-col>
          </el-row>
          <hr>
          <br>
          <router-view/>
        </div>
        <footer>
          Copyright © 2021 泽哥和他的底层室友们小组 版权所有 沪ICP备:83091720-9 沪公网安备31987102320309
          <i class="el-icon-paperclip"></i>
        </footer>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import * as Three from "three";
  import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
  import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

  export default {
    name: "Sign",
    data() {
      return {
        renderer: null,
        scene: null,
        camera: null,
      }
    },
    methods: {
      initScene() {
        let container = document.getElementById('sign_scene');
        this.scene = new Three.Scene();

        //相机
        this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 5000);
        this.camera.position.set(-500, 250, 0);
        this.camera.lookAt(this.scene.position);

        //渲染器
        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        //控制器
        let controller = new OrbitControls(this.camera, this.renderer.domElement);

        //光源
        let ambientLight = new Three.AmbientLight(0xffffff);
        this.scene.add(ambientLight);

        let texture = new Three.ImageUtils.loadTexture('static/seraphine/textures/userboy17.png')
        let loader = new FBXLoader();
        let that = this;
        loader.load('static/seraphine/source/girl.fbx', function (obj) {
          that.scene.add(obj);
          obj.scale.multiplyScalar(0.5);
          obj.position.set(0, -200, 0);
          obj.traverse(function (child) {
            let material = new Three.MeshPhongMaterial({
              map: texture
            });
            child.material = material;
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
        });

      },
      render() {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
      }
    },
    mounted() {
      this.initScene();
      this.render();
    }
  }
</script>

<style scoped>
  .form_title {
    margin-top: 5px;
    text-align: center;
    font-size: 28px;
    color: #3d35ff;
    font-weight: bold;
  }

  .sign_form_wrapper {
    width: 400px;
    margin: auto;
  }


  .el-main {
    padding: 0;
    background-color: #E9EEF3;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .sign_wrapper {
    height: 100%;
  }

  .el-container {
    height: 100%;
  }

  #sign_scene {
    width: 100%;
    height: 100%;
  }

  footer {
    color: #2d3764;
    margin-bottom: 5px;
    margin-top: 10%;
  }

</style>

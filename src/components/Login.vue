<template>
  <div id="base_login"
       style="height: 100%;">

    <el-container>
      <el-aside width="40%">
        <div id="login_scene"></div>
      </el-aside>
      <el-main>

            <div class="login_container">
              <el-form :model="loginForm"
                       :rules="rules"
                       label-width="80px"
                       style="width: 320px;margin: auto"
                       v-loading="loading">
                <el-row>
                  <el-col :span="8">
                    <div>
                      <img
                        style="width: 60px;height: 60px"
                        src="../assets/cas_logo.png">
                      </img>
                    </div>
                  </el-col>
                  <el-col :span="16">
                    <div class="login_title" style="">统一身份认证</div>
                  </el-col>
                </el-row>

                <el-form-item  label="账号" prop="id">
                  <el-input auto-complete="off"
                            placeholder="请输入用户名"
                            type="text"
                            v-model="loginForm.id"></el-input>
                </el-form-item>

                <el-form-item  label="密码"  prop="password" >
                  <el-input auto-complete="off"
                            placeholder="请输入密码"
                            type="password"
                            v-model="loginForm.password"></el-input>
                </el-form-item>

                <br>
                <el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-button round type="primary" v-on:click="login" round>登录
                      </el-button>
                    </el-col>
                    <el-col :span="12">
                      <router-link style="color: #006FFF;font-size: 12px;text-decoration: none;width: 100px"
                                   to="register">
                        <a>注册</a>
                      </router-link>
                    </el-col>
                  </el-row>

                </el-form-item>

              </el-form>
            </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>
  import * as Three from 'three'
  import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
  import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'

  export default {
    name: 'Login',

    data() {
      return {
        renderer:null,
        scene:null,
        camera:null,
        loginForm: {
          id: '',
          password: ''
        },
        rules: {
          id: [{required: true, message: '用户名不得为空', trigger: 'blur'}],
          password: [{required: true, message: '密码不得为空', trigger: 'blur'}]
        },
        loading: false,
      }
    },

    methods: {
      login() {
        if (this.loginForm.id === "" ||
          this.loginForm.password === "") {
          this.$message.error('用户名和密码均不得为空');
          return;
        }

        let loginFormData = new FormData();
        loginFormData.append("id", this.loginForm.id);
        loginFormData.append("password", this.loginForm.password);
        this.$axios.post('/login',
          loginFormData
        ).then(resp => {
          console.log(resp);
          if (resp.status === 200) {
            this.$message({
              message: '登陆成功',
              type: 'success',
              duration: 1000
            });
            this.$store.commit('changeLogin', resp.data)
            // this.$store.commit('webSocketConnect')
            this.$router.replace({path: '/Main'})
          }
        })
          .catch(error => {
              this.$message.error('用户名或密码错误');
              console.log(error)
            }
          );
      },
      initScene(){
        let container = document.getElementById('login_scene');
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
        let controller = new OrbitControls(this.camera,this.renderer.domElement);

        //光源
        let ambientLight = new Three.AmbientLight(0xffffff);
        this.scene.add(ambientLight);

        let texture = new Three.ImageUtils.loadTexture('static/seraphine/textures/userboy17.png')
        let loader = new FBXLoader();
        let that = this;
        loader.load('static/seraphine/source/girl.fbx',function (obj) {
          that.scene.add(obj);
          obj.scale.multiplyScalar(0.5);
          obj.position.set(0,-200,0);
          obj.traverse(function (child) {
            let material = new Three.MeshPhongMaterial({
              map:texture
            });
            child.material = material;
            if ( child.isMesh ) {
              child.castShadow = true;
              child.receiveShadow = true;
            };
          });
        });

      },
      render(){
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
  #base_login {
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  #login_scene{
    position: fixed;
    display: block;
    margin: 0;
    width: 40%;
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
  }

  .login_container {
    background-clip: padding-box;
    margin-top: 20%;
  }

  .login_title {
    margin: 15px auto 45px auto;
    text-align: center;
    font-size: 26px;
    color: #3d35ff;
    font-weight: bold;
  }
</style>

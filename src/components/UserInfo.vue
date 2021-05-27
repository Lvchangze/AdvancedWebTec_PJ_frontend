<template>
  <el-container class="info-wrapper">

    <!--用于展示3d形象-->
    <el-aside width="45%">
      <div id="character_scene"></div>
    </el-aside>

    <el-main>
      <!--记录个人信息-->
      <el-form :model="userData"
               label-width="50px">
      <el-form-item label="账号" prop="id">
          <el-input v-model="userData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input auto-complete="off" v-model="userData.age" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="userData.gender" disabled>
            <el-option
              :key="sex.value"
              :label="sex.label"
              :value="sex.value"
              v-for="sex in genders">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="形象" prop="character">
          <el-select v-model="userData.character" disabled>
            <el-option
              :key="character.value"
              :label="character.value"
              :value="character.value"
              v-for="character in characters">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!--记录历史纪录-->
      <h2>历史记录</h2>
      <el-table
        :data="historyList"
        stripe>
        <el-table-column
          label="编号"
          prop="id"
          width="180">
        </el-table-column>
        <el-table-column
          label="描述"
          prop="desc">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
  import * as Three from "three";
  import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
  import {MMDLoader} from "three/examples/jsm/loaders/MMDLoader";

  export default {
    name: "UserInfo",
    data() {
      return {
        renderer: null,
        scene: null,
        camera: null,
        userId: this.$store.state.currentId,
        userData:
          {
            id: "lvchangze",
            age: 22,
            gender: 1,
            character:'刻晴'
          },
        genders: [
          {
            value: 0,
            label: '男'
          },
          {
            value: 1,
            label: '女'
          }
        ],
        characters: [
          {
            value: '迪奥娜'
          },
          {
            value: '甘雨'
          },
          {
            value: '公子'
          },
          {
            value: '胡桃'
          },
          {
            value: '可莉'
          },
          {
            value: '罗莎莉亚'
          },
          {
            value: '莫娜'
          },
          {
            value: '凝光'
          },
          {
            value: '诺艾尔'
          },
          {
            value: '七七'
          },
          {
            value: '温迪'
          },
          {
            value: '香菱'
          },
          {
            value: '魈'
          },
          {
            value: '辛焱'
          },
          {
            value: '行秋'
          },
          {
            value: '烟绯'
          },
          {
            value: '钟离'
          }
        ],
        historyList:[
          {
            id:1,
            desc:'1'
          }
        ]
      }
    },
    methods:{
      initScene() {
        let container = document.getElementById('character_scene');
        this.scene = new Three.Scene();

        //相机
        this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 1, 5000);
        this.camera.position.set(0, 100, 200);
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

        let that = this;
        let loader = new MMDLoader();
        let modelUrl = 'static/models/'+ this.userData.character + '/' + this.userData.character + '.pmx';
        loader.load(modelUrl, function (mesh) {
          that.model = mesh;
          mesh.scale.multiplyScalar(10);
          mesh.position.set(0, -100, 0);
          that.scene.add(mesh);
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
  .info-wrapper {
    height: 100%;
  }

  .info-wrapper .el-aside{
    height: 100%;
  }

  #character_scene{
    height: 100%;
  }

  .el-select{
    width: 100%;
  }

</style>

<template>
  <el-container>
    <el-main>
      <el-button type="primary" v-on:click="logout">退出登录</el-button>
      <div>
        <div id="container">
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import * as Three from 'three'

export default {
  name: 'Main',
  created() {
    let testFormData = new FormData();
    testFormData.append("id", "lvchangze");
    this.$axios.post("/test", testFormData)
  },
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
    }
  }
  ,
  methods: {
    logout() {
      this.$store.commit('logout')
      this.$router.push('/login');
    }
    ,
    init: function () {
      let container = document.getElementById('container');
      this.camera = new Three.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.01, 10);
      this.camera.position.z = 1;

      this.scene = new Three.Scene();

      let geometry = new Three.BoxGeometry(0.2, 0.2, 0.2);
      let material = new Three.MeshNormalMaterial();

      this.mesh = new Three.Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.renderer = new Three.WebGLRenderer({antialias: true});
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

    }
    ,
    animate: function () {
      requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
    }
  }
  ,
  mounted() {
    this.init();
    this.animate()
  }
}
</script>
<style scoped>
#container {
  height: 400px;
}
</style>

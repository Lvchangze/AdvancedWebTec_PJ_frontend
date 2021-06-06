<template>
  <el-container class="main-wrapper">
    <el-header>
      <el-menu mode="horizontal">
        <el-menu-item style="float: left">
          <i class="el-icon-s-home"></i>
          欢迎 {{userId}}
        </el-menu-item>

        <el-menu-item @click="logout" index="3" style="float: right">
          <i class="el-icon-error"></i>
          退出登录
        </el-menu-item>
        <el-menu-item @click="gotoUserInfo" index="2" style="float: right">
          <i class="el-icon-user-solid"></i>
          个人信息
        </el-menu-item>
        <el-menu-item @click="gotoRooms" index="1" style="float: right">
          <i class="el-icon-menu"></i>
          房间列表
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
    <el-footer>
      Copyright © 2021 泽哥和他的底层室友们小组 版权所有 沪ICP备:83091720-9 沪公网安备31987102320309
      <i class="el-icon-paperclip"></i>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {
        userId: this.$store.state.currentId
      }
    },
    methods: {
      logout() {
        this.$store.commit('logout')
        this.$router.push('/login');
      },
      gotoRooms() {
        this.$router.push('/main/rooms')
      },
      gotoUserInfo() {
        this.$router.push('/main/userInfo')
      },
      gotoVirtualScene() {
        this.$router.push('/VirtualScene')
      },
    },

  }
</script>
<style scoped>
  .main-wrapper {
    height: 100%;
  }

  .main-wrapper .el-header {
    height: 5%;
  }

  .main-wrapper.el-main {
    height: 100%;
  }

</style>


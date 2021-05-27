<template>
  <div class="info-wrapper">
    用户信息
  </div>
</template>

<script>
  export default {
    name: "UserInfo",
    data() {
      return {
        userId: this.$store.state.currentId,
        userData: [
          {
            id: "lvchangze",
            age: 22,
            gender: 1
          }
        ],

      }
    }
  }
</script>

<style scoped>
  .info-wrapper {
    height: 100%;
  }
</style>

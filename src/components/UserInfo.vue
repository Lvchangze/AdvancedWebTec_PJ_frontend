<template>
  <el-container>
    <el-main>
      <el-table
        :data="userData"
        style="width: 100%">
        <el-table-column
          label="昵称"
          prop="id">
        </el-table-column>
        <el-table-column
          label="年龄"
          prop="age">
        </el-table-column>
        <el-table-column
          label="性别"
          prop="gender">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
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

</style>

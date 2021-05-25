<template>
  <el-container>
    <el-main>
      <el-table
        :data="userData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="age"
          label="年龄">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="性别">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "UserInfo",
  data(){
    return{
      userId: this.$store.state.currentId,
      userData: [
        {
          id:"lvchangze",
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

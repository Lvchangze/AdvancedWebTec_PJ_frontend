<template>
  <div class="room-table-wrapper">
    <el-table
      :data="roomList"
      stripe>
      <el-table-column
        label="房间名"
        prop="name"
        width="180">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="desc"
        width="600">
      </el-table-column>
      <el-table-column
        label="在线人数"
        prop="count">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="goInto(scope.$index)"
            type="text">
            进入
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "Rooms",
    data() {
      return {
        roomList: [{
          id: 1,
          name: '汉诺塔初级',
          desc: '在这个房间中，用户可以进行 3 层汉诺塔的相关教学实验',
          count: 0
         },
          {
            id: 2,
            name: '汉诺塔中级',
            desc: '在这个房间中，用户可以进行 4 层汉诺塔的相关教学实验',
            count: 0
          },
          {
            id: 3,
            name: '汉诺塔高级',
            desc: '在这个房间中，用户可以进行 5 层汉诺塔的相关教学实验',
            count: 0
          }]
      }
    },
    methods: {
      goInto(index) {
        this.$message.success("进入" + this.roomList[index].id + "房间");
      }
    }
  }
</script>

<style scoped>
  .el-table {
    width: 100%;
    text-align: center;
  }
</style>

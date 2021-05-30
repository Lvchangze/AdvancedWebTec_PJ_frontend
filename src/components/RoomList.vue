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
        prop="description"
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
    name: "RoomList",
    data() {
      return {
        roomList: []
      }
    },
    methods: {
      goInto(index) {
        this.$message.success("进入" + this.roomList[index].roomId + "房间");
        this.$router.push({path: '/room/' + this.roomList[index].roomId});
      },
      fetchRoomList() {
        this.$axios.post('/getAllRooms', "")
          .then(resp => {
            if (resp.status === 200) {
              console.log(resp.data)
              this.roomList = resp.data.rooms;
            } else {
              this.$message.error("获取历史记录失败！")
            }
          })
          .catch(err => {
            this.$message.error(err)
          })
      }
    },
    mounted() {
      this.fetchRoomList();
    }
  }
</script>

<style scoped>
  .el-table {
    width: 100%;
    text-align: center;
  }
</style>

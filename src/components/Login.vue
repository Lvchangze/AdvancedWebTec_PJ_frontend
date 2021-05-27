<template>
  <div class="login_container">
    <el-form :model="loginForm"
             :rules="rules"
             label-width="50px"
             v-loading="loading">
      <el-form-item label="账号" prop="id" required>
        <el-input auto-complete="off"
                  placeholder="请输入用户名"
                  type="text"
                  v-model="loginForm.id"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" required>
        <el-input auto-complete="off"
                  placeholder="请输入密码"
                  type="password"
                  v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-button round type="primary" v-on:click="login">登录</el-button>
      <el-button round v-on:click="gotoRegister">注册</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Login',

    data() {
      return {
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
            this.$router.replace({path: '/main'})
          }
        })
          .catch(error => {
              this.$message.error('用户名或密码错误');
              console.log(error)
            }
          );
      },
      gotoRegister() {
        this.$router.replace({path: '/register'})
      }
    }
  }
</script>

<style scoped>
</style>

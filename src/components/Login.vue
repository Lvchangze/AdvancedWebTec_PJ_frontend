<template>
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
              src="../assets/cas_logo.png"
              style="width: 60px;height: 60px">
            </img>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="login_title" style="">统一身份认证</div>
        </el-col>
      </el-row>

      <el-form-item label="账号" prop="id">
        <el-input auto-complete="off"
                  placeholder="请输入用户名"
                  type="text"
                  v-model="loginForm.id"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input auto-complete="off"
                  placeholder="请输入密码"
                  type="password"
                  v-model="loginForm.password"></el-input>
      </el-form-item>

      <br>
      <el-form-item>
        <el-row>
          <el-col :span="12">
            <el-button round round type="primary" v-on:click="login">登录
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
            this.$router.replace({path: '/Main'})
          }
        })
          .catch(error => {
              this.$message.error('用户名或密码错误');
              console.log(error)
            }
          );
      },
    }
  }
</script>

<style scoped>
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

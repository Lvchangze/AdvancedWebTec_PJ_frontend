<template>
  <div id="base_login"
       style="height: 100%;">
    <div class="login_container">
      <el-form :model="loginForm"
               :rules="rules"
               label-position="top"
               label-width="0px"
               size="small"
               style="width: 260px;margin: auto"
               v-loading="loading">
        <div class="login_title" style="">登录</div>

        <el-form-item prop="id" label="用户名" class="form-label" style="text-align: left"
                      label-width="80px">
          <el-input type="text"
                    v-model="loginForm.id"
                    auto-complete="off"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item prop="password" label="密码" class="form-label" style="text-align: left" label-width="80px">
          <el-input type="password"
                    v-model="loginForm.password"
                    auto-complete="off"
                    placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item style="width: 100%">
          <el-button type="primary"
                     style="background-color: #356eff;border-color: #356eff;width: 260px;border-radius: 3px;margin-top: 25px;margin-bottom: 5px"
                     v-on:click="login" round>登录
          </el-button>
          <router-link to="register"
                       style="color: #006FFF;font-size: 12px;text-decoration: none;width: 100px">
            <a>注册</a>
          </router-link>
        </el-form-item>

      </el-form>
    </div>

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
        console.log(resp)
        if (resp.status === 200) {
          this.$message({
            message: '登陆成功',
            type: 'success'
          });
          this.$store.commit('setCurrentId', resp.data.user);
          this.$router.replace({path: '/Main'})
        }
      })
        .catch(error => {
            this.$message.error('用户名或密码错误');
            console.log(error)
          }
        );
    }
  }
  ,
}
</script>

<style scoped>
#base_login {
  background: url("../assets/bg.jpeg") repeat center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

body {
  margin: 0;
  padding: 0;
}

.login_container {
  border-radius: 3px;
  background-clip: padding-box;
  top: 50%;
  position: relative;
  height: 400px;
  margin: -250px auto;
  width: 330px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
}

.login_title {
  margin: 5px auto 45px auto;
  text-align: center;
  font-size: 32px;
  color: black;
}
</style>
<style>
.login_container .form-label .el-form-item__label {
  padding-bottom: 3px;
  color: #888888;
  font-size: 12px;
}
</style>

<template>
  <div class="register_container">
    <el-form :model="registerForm" :ref="registerForm" :rules="rules" label-position="top"
             label-width="0px"
             size="small" style="width: 263px;margin-left: 45px;" v-loading="loading">
      <div class="register_title" style="color: black;font-size: 32px">注册</div>

      <el-form-item class="form-label" label="用户名" label-width="80px" prop="id">
        <el-input auto-complete="off" placeholder="请输入用户名"
                  style="width: 250px" type="text" v-model="registerForm.id"></el-input>
      </el-form-item>

      <el-form-item class="form-label" label="密码" label-width="80px" prop="password">
        <el-input auto-complete="off" placeholder="请输入密码"
                  style="width: 250px" type="password" v-model="registerForm.password"></el-input>
      </el-form-item>

      <el-form-item class="form-label" label="年龄" label-width="80px" prop="age">
        <el-input auto-complete="off" placeholder="请输入年龄"
                  style="width: 250px" type="text" v-model="registerForm.age"></el-input>
      </el-form-item>

      <el-form-item class="form-label" label="性别" label-width="80px" prop="gender">
        <el-select placeholder="请选择性别" style="width: 250px" v-model="registerForm.gender">
          <el-option
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-for="item in genderOption">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="width: 100%;margin-top: 50px;margin-left: -10px">
        <router-link to="login">
          <el-button style="width: 100px;background-color: white;border-color:#ddd;border-radius: 3px;margin-right: 11px;color: black"
                     type="primary"
          >返回
          </el-button>
        </router-link>
        <el-button style="width: 100px;background-color: #356eff;border-color: #356eff;border-radius: 3px"
                   type="primary"
                   v-on:click="register">注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>

  export default {
    name: "Register",
    data() {
      return {
        rules: {
          id: [{required: true, message: '用户名不得为空', trigger: 'blur'}],
          password: [{required: true, message: '密码不得为空', trigger: 'blur'}],
          age: [{required: true, message: '年龄不得为空', trigger: 'blur'}],
          gender: [{required: true, message: '性别不得为空', trigger: 'blur'}],
        },
        registerForm: {
          id: '',
          password: '',
          age: '',
          gender: '',
        },
        loading: false,
        genderOption: [
          {
            value: 0,
            label: '男'
          },
          {
            value: 1,
            label: '女'
          },
        ]
      }

    },
    methods: {
      register() {
        console.log(this.registerForm)
        if (
          this.registerForm.id === "" ||
          this.registerForm.password === "" ||
          this.registerForm.age === "" ||
          this.registerForm.gender === "") {
          this.$message.error('任何一项不得为空');
          return;
        }

        let registerFormData = new FormData();
        registerFormData.append("id", this.registerForm.id);
        registerFormData.append("password", this.registerForm.password);
        registerFormData.append("age", this.registerForm.age);
        registerFormData.append("gender", this.registerForm.gender);

        this.$axios.post('/register',
          registerFormData
        )
          .then(resp => {
            console.log(resp)
            if (resp.status === 200) {
              this.$message({
                message: '注册成功',
                type: 'success',
                duration: 6000
              });
              this.$router.replace('/login');
            }
          })
          .catch(error => {
            this.$message.error('注册失败，用户名已存在');
            console.log(error)
          })
      }
    }
  }
</script>

<style scoped>
  .register_container {
    /*
      border-radius: 3px;
    */
    background-clip: padding-box;
    margin-top: 10%;
    margin-left: 25%;
    /*width: 330px;
    height: 480px;
    top: 50%;
    position: relative;
    margin: -250px auto;
    padding: 25px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;*/
  }

  .register_title {
    margin: 0 auto 20px auto;
    text-align: center;
    color: #494e8f;
    font-size: 27px;
  }

  .form-label {
    text-align: left;
  }

  .register_container .form-label .el-form-item__label {
    padding-bottom: 8px;
    color: #888888;
    font-size: 12px;
    line-height: 1.5;
  }

  .register_container .form-label .el-input__inner {
    height: 30px;
  }
</style>

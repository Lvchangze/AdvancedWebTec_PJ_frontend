<template>
  <div id="base_register" style="height: 100%">
    <div class="register_container">
      <el-form :model="registerForm" :rules="rules" label-position="top" size="small"
               style="width: 263px;margin-left: 52px;"
               label-width="0px" v-loading="loading" :ref="registerForm">
        <div class="register_title" style="color: black;font-size: 32px">注册</div>

        <el-form-item prop="job" label="类别" class="form-label" style="text-align: left"
                      label-width="80px">
          <el-select v-model="registerForm.job" placeholder="请选择类型" style="width: 203px">
            <el-option
              v-for="item in jobOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="name" class="form-label" label="姓名" label-width="80px">
          <el-input type="text" v-model="registerForm.name"
                    auto-complete="off" placeholder="请输入姓名" style="width: 203px"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="form-label" label="密码" label-width="80px">
          <el-input type="password" v-model="registerForm.password"
                    auto-complete="off" placeholder="请输入密码" style="width: 203px"></el-input>
        </el-form-item>

        <el-form-item prop="gender" class="form-label" label="性别" label-width="80px">
          <el-select v-model="registerForm.gender" placeholder="请选择性别" style="width: 203px">
            <el-option
              v-for="item in genderOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="age" class="form-label" label="年龄" label-width="80px">
          <el-input type="text" v-model="registerForm.age"
                    auto-complete="off" placeholder="请输入年龄" style="width: 203px"></el-input>
        </el-form-item>

        <el-form-item style="width: 100%;margin-left: -30px">
          <router-link to="login">
            <el-button type="primary"
                       style="width: 100px;background-color: white;border-color:#ddd;border-radius: 3px;margin-right: 11px;color: black"
            >返回
            </el-button>
          </router-link>
          <el-button type="primary"
                     style="width: 100px;background-color: #356eff;border-color: #356eff;border-radius: 3px"
                     v-on:click="register(registerForm)">注册
          </el-button>
        </el-form-item>

      </el-form>

    </div>


  </div>
</template>

<script>
  export default {
    name: "Register",
    data() {
      return {
        rules: {
          job: [{required: true, message: '类型不得为空', trigger: 'blur'}],
          name: [{required: true, message: '姓名不得为空', trigger: 'blur'}],
          password: [{required: true, message: '密码不得为空', trigger: 'blur'}],
          gender: [{required: true, message: '性别不得为空', trigger: 'blur'}],
          age: [{required: true, message: '年龄不得为空', trigger: 'blur'}],
        },
        registerForm: {
          job: '',
          password: '',
          name: '',
          gender: '',
          age: '',
        },
        loading: false,
        jobOption: [
          {
            value: 0,
            label: '主治医生'
          },
          {
            value: 1,
            label: '急诊护士'
          },
          {
            value: 2,
            label: '护士长'
          },
        ],
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
        if (this.registerForm.job === '' ||
          this.registerForm.id === "" ||
          this.registerForm.name === "" ||
          this.registerForm.age === "" ||
          this.registerForm.gender === "") {
          this.$message.error('任何一项不得为空');
          return;
        }
        let formData = new FormData();
        formData.append("id",1);
        this.$axios.post('/register',
          formData
        )
          .then(resp => {

          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style scoped>
  #base_register {
    background: url("../assets/bg.jpeg") repeat center;
    height: 100%;
    width: 100%;
    background-size: cover;
    position: fixed;
  }

  .register_container {
    border-radius: 3px;
    background-clip: padding-box;
    width: 330px;
    top: 50%;
    position: relative;
    margin: -303.8px auto;
    padding: 25px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
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

</style>
<style>
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

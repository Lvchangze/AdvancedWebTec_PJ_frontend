<template>
  <div class="register_container">
    <el-form :model="registerForm" :ref="registerForm" :rules="rules"
             label-width="50px"
             v-loading="loading">
      <el-form-item label="账号" prop="id" required>
        <el-input auto-complete="off" placeholder="请输入用户名"
                  type="text" v-model="registerForm.id"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password" required>
        <el-input auto-complete="off" placeholder="请输入密码"
                  type="password" v-model="registerForm.password"></el-input>
      </el-form-item>

      <el-form-item label="年龄" prop="age" required>
        <el-input auto-complete="off" placeholder="请输入年龄"
                  type="text" v-model="registerForm.age"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender" required>
        <el-select placeholder="请选择性别" v-model="registerForm.gender">
          <el-option
            :key="sex.value"
            :label="sex.label"
            :value="sex.value"
            v-for="sex in genders">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="形象" prop="character" required>
        <el-select placeholder="请选择形象" v-model="registerForm.character">
          <el-option
            :key="character.value"
            :label="character.value"
            :value="character.value"
            v-for="character in characters">
          </el-option>
        </el-select>
      </el-form-item>

      <el-button round type="primary" v-on:click="register">注册</el-button>
      <el-button round v-on:click="back">返回</el-button>
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
          character: [{required: true, message: '形象不得为空', trigger: 'blur'}],
        },
        registerForm: {
          id: '',
          password: '',
          age: '',
          gender: '',
          character: ''
        },
        loading: false,
        genders: [
          {
            value: 0,
            label: '男'
          },
          {
            value: 1,
            label: '女'
          }
        ],
        characters: [
          {
            value: '迪奥娜'
          },
          {
            value: '甘雨'
          },
          {
            value: '公子'
          },
          {
            value: '胡桃'
          },
          {
            value: '可莉'
          },
          {
            value: '罗莎莉亚'
          },
          {
            value: '莫娜'
          },
          {
            value: '凝光'
          },
          {
            value: '诺艾尔'
          },
          {
            value: '七七'
          },
          {
            value: '温迪'
          },
          {
            value: '香菱'
          },
          {
            value: '魈'
          },
          {
            value: '辛焱'
          },
          {
            value: '行秋'
          },
          {
            value: '烟绯'
          },
          {
            value: '钟离'
          }
        ]
      }

    },
    methods: {
      back() {
        this.$router.replace({path: '/login'})
      },
      register() {
        console.log(this.registerForm);
        if (
          this.registerForm.id === "" ||
          this.registerForm.password === "" ||
          this.registerForm.age === "" ||
          this.registerForm.gender === "" ||
          this.registerForm.character === "") {
          this.$message.error('任何一项不得为空');
          return;
        }

        let registerFormData = new FormData();
        registerFormData.append("id", this.registerForm.id);
        registerFormData.append("password", this.registerForm.password);
        registerFormData.append("age", this.registerForm.age);
        registerFormData.append("gender", this.registerForm.gender);
        registerFormData.append("character", this.registerForm.character);

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
  .el-select {
    width: 100%;
  }
</style>

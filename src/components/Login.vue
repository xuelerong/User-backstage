<template>
  <div class="login-loo">
    <div class="login-box">
      <!--        登录页顶部图片-->
      <div class="login-pic">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--        登录表单区域-->
      <el-form ref="loginef" label-width="0px" class="login-input" :model="loginUser" :rules="loginRules">
        <!--          用户名区域-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginUser.username"/>
        </el-form-item>
        <!--         密码区域-->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginUser.password"/>
        </el-form-item>
        <el-form-item class="btns">
          <!--          按钮区域-->
          <el-button type="primary" @click="loginCheck">登录</el-button>
          <el-button type="info" @click="loginRemoveref">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { fetchPost } from '../network/request'

export default {
  name: 'Login',
  data () {
    return {
      // 登录表单的数据绑定对象
      loginUser: {
        username: 'admin',
        password: '123456'
      },
      // 验证表单的验证规则对象
      loginRules: {
        // 验证用户名是否合法  trigger表示当失去焦点
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置   重置登录表单
    loginRemoveref () {
      this.$refs.loginef.resetFields()
    },
    // 点击表单预验证(data中声明的规则)，当预验证不通过就不进行数据请求 validate函数可以对整个表单进行校验
    loginCheck () {
      this.$refs.loginef.validate(vali => {
        console.log(vali)
        // //如果vail的值为false就直接return出去不进行登录访问
        if (!vali) return
        fetchPost('/login', this.loginUser)
          .then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              // return console.log('登录失败')
              return this.$message.error('登陆失败')
            } else {
              // return console.log('登录成功')
              this.$message.success('登陆成功')
              // 1.将登陆成功后的tocken保存到sessionStorage中
              // 1.1项目中除了登录，之外的其他api接口必须在登陆后才能访问
              // 1.2tocken只能在当前网站打开期间生效(会话期间的存储机制)，所以将token保存在sessionStorage中,而localStorage是持久化的存储机制
              window.sessionStorage.setItem('token', res.data.token)
              // 通过编程式导航跳转到home后台主页，路由地址是home
              this.$router.push('/home')
            }
          })
      })
    }
  }
}
</script>

<style scoped>
  .login-loo {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login-box {
    background-color: aliceblue;
    width: 450px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
  }

  .login-pic {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  .login-pic img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .login-input {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>

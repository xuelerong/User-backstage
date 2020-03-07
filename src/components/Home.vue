<template>
<!--  布局容器-->
  <el-container class="home-container">
<!--    头部区域-->
    <el-header>
      <div class="home-title">
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="gologin">退出</el-button>
    </el-header>
<!--    页面主体区域-->
    <el-container>
<!--      侧边栏-->
      <el-aside :width="collspc ? '64px' : '200px'">
<!--        侧边栏菜单区域  :collapse-transition="false"取消侧边栏折叠动画效果
:unique-opened点击一个列表关闭其他列表 :router开启路由跳转-->
        <div class="point-home" @click="smallPointer"> |||</div>
        <el-menu  background-color="#333744" text-color="#fff" active-text-color="#409EFF"
                  :unique-opened="true" :collapse="collspc" :collapse-transition="false"
                  :router="true" :default-active="activePath">
<!--         一级菜单 index动态绑定每一个值都是唯一的 因为index只接受字符串当id是数值所以后面拼接个字符串转换成数值-->
          <el-submenu :index="item.id + ''" v-for="item in message" :key="item.id">
<!--            一级菜单模板区域-->
            <template slot="title">
<!--              图标-->
              <i :class="listObj[item.id]"/>
<!--              文本-->
              <span>{{item.authName}}</span>
            </template>
<!--            二级菜单 little.path把id改为path作为跳转地址比较合适-->
            <el-menu-item :index="'/' + little.path" v-for="little in item.children"
                          :key="little.id" @click="serveStatus('/' + little.path)">
              <template slot="title">
<!--                二级菜单图标-->
                <i class="el-icon-menu"/>
<!--                二级菜单文本-->
                <span>{{little.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      右侧内容区域-->
      <el-main>
<!--        路由占位符-->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { request } from '../network/request'

export default {
  name: 'Home',
  data () {
    return {
      // 左侧菜单数据
      message: [],
      listObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 控制侧边栏展开关闭
      collspc: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMessage()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 当点击退出按钮清空token并跳转到登录页
    gologin () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMessage () {
      request('/menus').then(res => {
        console.log(res)
        this.message = res.data
      })
    },
    // 点击控制侧边栏展开关闭
    smallPointer () {
      this.collspc = !this.collspc
    },
    // 保存链接的激活状态
    serveStatus (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
  .home-container{
    height: 100%;
    position: fixed;
    width: 100vw;
  }
  .el-header{
    background-color: #373d41;
    display:flex;
    justify-content:space-between;
    padding-left:0;
    align-items: center;
}
  .home-title{
    color: #eeeeee;
    display: flex;
    align-items: center;
    font-size: 20px;
  }
  .home-title span{
    margin-left: 15px;
  }
  .el-aside{
    background-color: #333744;
  }
  .el-menu{
    border-right: none;
  }
  .el-main{
    background-color: #eaedf1;
  }
  .iconfont{
    margin-right: 10px;
  }
  .point-home{
    line-height: 24px;
    color: #eeeeee;
    background-color:#333744;
    text-align: center;
    letter-spacing: 4px;
    cursor:pointer;
  }
</style>

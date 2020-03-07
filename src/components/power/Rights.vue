<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图    stripe隔行变色-->
    <el-card >
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"/>
        <el-table-column label="权限path名称" prop="authName"/>
        <el-table-column label="路径" prop="path"/>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { request } from '../../network/request'

export default {
  name: 'Rights',
  data () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created () {
    // 获取所有权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    getRightsList () {
      request('rights/list')
        .then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('获取权限列表失败')
          } else {
            this.rightsList = res.data
          }
        })
    }
  }
}
</script>

<style scoped>
.el-card{
  margin-top: 15px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .1) !important;
  overflow-y: scroll;
  max-height: 89vh;
}
</style>

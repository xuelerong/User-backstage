<template>
  <div>
    <!--      面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getList()" placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getList()"/>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="pushAdd">添加商品</el-button>
        </el-col>
      </el-row>

      <!--      table表格区域-->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"/>
        <el-table-column label="商品名称" prop="goods_name"/>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"/>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"/>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">搜索</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"
            @click="removeID(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--      底部分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { deleteModify, request } from '../../network/request'

export default {
  name: 'List',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      //  商品列表
      goodsList: [],
      //  总数据条数
      total: 0
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      request('goods', this.queryInfo)
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('用户信息获取失败')
          } else {
            this.$message.success('用户信息获取成功')
            this.goodsList = res.data.goods
            this.total = res.data.total
            console.log(res)
          }
        })
    },
    // pagesize数发生变化
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getList()
    },
    // 页码值发生变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getList()
    },
    // 点击删除用户
    async removeID (id) {
      //  根据弹窗是否决定删除
      const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).catch(err => {
        return err
      })
      // 如果用户确认删除则返回值为字符串confirm
      /// /如果用户确认删除则返回值为字符串cancel
      if (res !== 'confirm') {
        return this.$message.info('已取消了删除')
      } else {
        deleteModify(`goods/${id.goods_id}`)
          .then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('用户删除失败')
            } else {
              // 刷新用户数据列表
              // this.getListRoles();
              this.getList()
              this.$message.success('用户删除成功')
            }
          })
      }
    },
    // 点击跳转到添加商品页面
    pushAdd () {
      this.$router.push('/add')
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
    overflow-y: scroll;
    max-height: 86vh;
  }
</style>

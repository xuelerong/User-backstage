<template>
  <div>
    <!--      面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片视图区-->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
<!--      订单列表数据  type="index"显示索引列-->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"/>
        <el-table-column width="220px" label="订单编号" prop="order_number"/>
        <el-table-column width="100px" label="订单价格" prop="order_price"/>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="是否发货" prop="is_send"/>

        <el-table-column width="220px" label="订单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template >
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="dialogVisible=true"/>
            <el-button type="success" size="mini" icon="el-icon-location" @click="openOrge"/>
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
<!--    修改地址对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="50%" @close="clesrOrdes">
      <el-form :model="orderruleForm" :rules="orderruleFormrules"
               ref="orderrumrule" label-width="90px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="addre1">
          <el-input  />
        </el-form-item>
        <el-form-item label="详细地址" prop="addre2">
           <el-input v-model="orderruleForm.addre2" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
<!--    w物流进度对话框-->
    <el-dialog
      title="物流信息"
      :visible.sync="dialogVisfsdfible"
      width="50%">
<!--       时间线-->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in getOrderUserMessage"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { request } from '../../network/request'

export default {
  name: 'Order',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      dialogVisible: false,
      dialogVisfsdfible: false,
      // 总数据条数，默认为零
      total: 0,
      orderList: [],
      orderruleForm: {
        addre1: [],
        addre2: ''
      },
      getOrderUserMessage: [],
      orderruleFormrules: {
        addre1: [
          { required: true, message: '请输入用户邮箱号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        addre2: [
          { required: true, message: '请输入用户邮箱号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    getOrders () {
      request('orders', this.queryInfo).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('用户信息获取失败')
        } else {
          this.total = res.data.total
          this.orderList = res.data.goods
        }
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrders()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrders()
    },
    clesrOrdes () {
      this.$refs.orderrumrule.resetFields()
    },
    openOrge () {
      this.dialogVisfsdfible = true
      request('kuaidi/804909574412544580')
        .then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('用户信息获取失败')
          } else {
            this.getOrderUserMessage = res.data
          }
        })
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
    overflow-y: scroll;
    max-height: 84vh;
  }
  .el-pagination{
    margin-top: 12px;
  }
</style>

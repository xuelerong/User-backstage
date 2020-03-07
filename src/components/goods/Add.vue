<template>
  <div>
    <!--      面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图-->
    <el-card>
      <!--      头部提示信息-->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"/>
      <!--      步骤条信息-->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"/>
        <el-step title="商品参数"/>
        <el-step title="商品属性 3"/>
        <el-step title="商品图片"/>
        <el-step title="商品内容"/>
        <el-step title="完成"/>
      </el-steps>
      <!--      左边tab栏区域-->
      <el-form :model="addform" :rules="addformrules"
               ref="addformruleForm" label-width="100px"
               label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'"
                 :before-leave="AddLeave" @tab-click="liveClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addform.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addform.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addform.goods_weight" type="number"/>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addform.goods_number" type="number"/>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addform.goods_cat"
                :options="cartList"
                expandTrigger='hover'
                :props='ListProps'
                @change="addformH"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单的Item项-->
            <el-form-item :label="desable.attr_name"
                          v-for="item in desable" :key="item.attr_id">
              <!--              复选框组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cd"
                             v-for="(cd,i) in item.attr_vals" :key="i"/>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name"
                          v-for="item in onlyTabdata" :key="item.attr_id">
              <el-input v-model='item.attr_vals'/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--            action表示图片要上传的后台url地址-->
            <el-upload
              :action="upload"
              :on-preview="handlePrevie"
              :on-remove="handleRemov"
              list-type="picture" :headers="picDile" :on-success="handlSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
<!--副本编辑器组件-->
            <quill-editor v-model="addform.discaver"> </quill-editor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
<!--    图片的显示-->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVipicsibledd"
      width="50%">
      <img :src="privesoj" alt="" class="csf">
    </el-dialog>
<!--    添加按钮-->
    <el-button type="primary" class="btun" @click="disegf">添加</el-button>
  </div>
</template>

<script>
import _ from 'lodash'
import { request, fetchPost } from '../../network/request'

export default {
  name: 'Add',
  data () {
    return {
      activeIndex: '0',
      //  添加商品的表单数据对象
      addform: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        /* 商品所属的分类数组 */
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品的详情描述
        discaver: '',
        attrs: []
      },
      ListProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      //  图片
      privesoj: '',
      // 控制图片对话框显示隐藏
      dialogVipicsibledd: false,
      // 图片上传组件的请求头对象
      picDile: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片URL地址
      upload: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 动态参数数据
      desable: [],
      // 静态参数数据
      onlyTabdata: [],
      // 商品分类列表
      cartList: [],
      //  表单验证规则对象
      addformrules: {
        goods_name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    //  获取所有数据
    this.getUser()
  },
  methods: {
    getUser () {
      request('categories')
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('用户信息获取失败')
          } else {
            this.$message.success('用户信息获取成功')
            this.cartList = res.data
          }
        })
    },
    addformH () {
      console.log(this.addform.goods_cat)
      if (this.addform.goods_cat.length !== 3) {
        this.addform.goods_cat = []
      }
    },
    // 阻止标签页的切换
    AddLeave (ActiveName, oldActiveName) {
      if (this.addform.goods_cat.length !== 3 &&
          oldActiveName === '0') {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    // 图片预处理效果
    handlePrevie (file) {
      this.privesoj = file.response.data.url
      this.dialogVipicsibledd = true
    },
    // 移出图片的操作
    handleRemov: function (file) {
      const indefile = file.response.data.tmp_path
      const i = this.addform.pics.findIndex(x =>
        x.pic === indefile
      )
      this.addform.pics.splice(i, 1)
      console.log(this.addform)
    },
    // 图片上传成功的事件
    handlSuccess (response) {
      // 拼接得到一个图片对象
      const addPic = { pic: response.data.tmp_path }
      // 将图片对象push到图片pics数组中
      this.addform.pics.push(addPic)
      console.log(this.addform)
    },
    liveClick () {
      console.log(this.activeIndex)
      //  证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        request(`categories/${this.addform.goods_cat[2]}/attributes`, {
          sel: 'many'
        }).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('用户信息获取失败')
          } else {
            console.log(res)
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
            })
            this.desable = res.data
          }
        })
      } else if (this.activeIndex === '2') {
        request(`categories/${this.addform.goods_cat[2]}/attributes`, {
          sel: 'only'
        }).then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('用户信息获取失败')
          } else {
            console.log(res)
            res.data.forEach(item => {
              item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
            })
            this.onlyTabdata = res.data
          }
        })
      }
    },
    // 添加商品
    disegf () {
      this.$refs.addformruleForm.validate(val => {
        if (!val) {
          return this.$message.error('请填写对应的信息')
        } else {
          const form = _.cloneDeep(this.addform)
          this.addform.goods_cat = form.goods_cat.join(',')
          //  处理动态参数
          this.desable.forEach(item => {
            const addSan = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(',')
            }
            this.addform.attrs.push(addSan)
          })
          //  处理静态属性
          this.onlyTabdata.forEach(item => {
            const newaddSan = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join
            }
            this.addform.attrs.push(newaddSan)
          })
          form.attrs = this.addform.attrs
          //  进行数据请求
          fetchPost('goods', form)
            .then(res => {
              console.log(res)
            })
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
  }

  .el-steps {
    margin-top: 10px;
    font-size: 13px;
  }

  .el-tabs {
    margin-top: 15px;
  }

  .el-checkbox {
    margin-right: 8px !important;
  }

  .csf {
    width: 100%;
  }
  .quill-editor{
  min-height: 300px;
    height: 300px;
  }
  .btun{
    margin-top: 15px;
  }
</style>

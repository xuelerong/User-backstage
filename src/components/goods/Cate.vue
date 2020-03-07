<template>
  <div>
    <!--      面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button class="btn" type="primary" @click="showAddCateListMessage">添加分类</el-button>
        </el-col>
      </el-row>

      <!--      表格-->
      <tree-table index-text="#" border :data="cartList" :show-index="true" :expand-type="false"
                  :selection-type='false' :columns="columns">
        <!--        是否有效-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: #33ee63"
             v-if="scope.row.cat_deleted===false"/>
          <i class="el-icon-error" style="color: red" v-else/>
        </template>
        <!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level ===0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level ===1" type="success">二级</el-tag>
          <el-tag size="mini"  else="scope.row.cat_level ===2" type="warning">三级</el-tag>
        </template>
        <!--      操作-->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" @click="primarCart(scope.row)" icon="el-icon-edit" >编辑</el-button>
          <el-button size="mini" type="danger" @click="eliminate(scope.row)" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!--      分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--      添加分类的对话框-->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateListMessage"
        width="50%" @close="deleteCate">
        <el-form :model="addCartFrom" :rules="addCartRules" ref="addCartRef"
                 label-width="90px" class="demo-ruleForm">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addCartFrom.cat_name"> </el-input>
          </el-form-item>
          <el-form-item label="父级分类:">
<!--            options用来指定数据源  props用来指定配置对象           -->
            <el-cascader
              v-model="selectUser"
              :options="parentCartList"
              expand-trigger="hover"
              :props="castprops"
              @change="selectCateChange"
            clearable change-on-select/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="addCateListMessage = false">取 消</el-button>
    <el-button type="primary" @click="addCart">确 定</el-button>
  </span>
      </el-dialog>
      <!--    修改分类的对话框-->
      <el-dialog
        title="编辑分类"
        :visible.sync="modifyGetUserCate"
        width="50%"
        @close="edildFromUserCart">
        <el-form :model="edildFormCart" :rules="edildFormRulesCart"
                 label-width="90px" ref="edildCartFormRef">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="edildFormCart.cat_name"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="modifyGetUserCate = false">取 消</el-button>
    <el-button type="primary" @click="output" >确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { request, fetchPost, putModify, deleteModify } from '../../network/request'

export default {
  name: 'Cate',
  data () {
    return {
      // 查询条件   默认获取三层级别的分类，显示第一页，每页数据显示五条
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 添加分类对话框的显示与隐藏
      addCateListMessage: false,
      // 编辑分类对话框的显示与隐藏
      modifyGetUserCate: false,
      // 查询到分类的表单数据对象
      edildFormCart: {},
      // 添加分类的表单数据对象
      addCartFrom: {
        // 添加分类对象的名称
        cat_name: '',
        //  父级分类的id
        cat_pid: 0,
        //  当前默认添加的分类等级为一级分类
        cat_level: 0
      },
      // 编辑分类表单的验证规则对象
      edildFormRulesCart: {
        cat_name: [
          { required: true, message: '请输入用户邮箱号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 添加分类表单的验证规则对象
      addCartRules: {
        cat_name: [
          { required: true, message: '请输入用户邮箱号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      // 商品分类的数据列表默认为空
      cartList: [],
      // 总数据条数
      total: 0,
      // 父级分类的列表数据
      parentCartList: [],
      // 指定级联选择器的配置对象
      castprops: {
        // 具体选中值的属性
        value: 'cat_id',
        // 指定看到的属性
        label: 'cat_name',
        // 指定父子嵌套用的哪个属性
        children: 'children'
      },
      // 选中的父级分类的id数组
      selectUser: [],
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          // 表示 将当前列定义为模板列
          type: 'template',
          //  表示当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示 将当前列定义为模板列
          type: 'template',
          //  表示当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示 将当前列定义为模板列
          type: 'template',
          //  表示当前这一列使用的模板名称
          template: 'opt'
        }
      ]
    }
  },
  created () {
    this.getCartList()
  },
  methods: {
    getCartList () {
      request('categories', this.queryInfo)
        .then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品分类失败')
          } else {
            // 把数据列表赋值给cartL
            this.cartList = res.data.result
            // 为总数据条数赋值
            this.total = res.data.total
            console.log(this.total)
          }
        })
    },
    // 监听pagesize的改变
    handleSizeChange (newSize) {
      this.queryInfo.pgesize = newSize
      this.getCartList()
    },
    // 监听pagenum的改变
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getCartList()
    },
    // 点击按钮展示分类对话框
    showAddCateListMessage () {
      // 先获取父级的分类列表数据
      this.getFather()
      // 展示出对话框
      this.addCateListMessage = true
    },
    //  获取父级分类的数据列表
    getFather () {
      request('categories', { type: 2 })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取商品分类失败')
          } else {
            this.parentCartList = res.data
            console.log(this.parentCartList)
          }
        })
    },
    //  选择项发生变化触发这个函数
    selectCateChange () {
      console.log(this.selectUser)
      // 如果selectUser数组中的length大于0，证明选中了父级分类
      // 反之就说明没有选中任何父级分类
      if (this.selectUser.length > 0) {
        // 父级分类的id
        this.addCartFrom.cat_pid = this.selectUser[this.selectUser.length - 1]
        //  为当前分类的等级赋值
        this.addCartFrom.cat_level = this.selectUser.length
      } else {
        this.addCartFrom.cat_pid = 0
        //  为当前分类的等级赋值
        this.addCartFrom.cat_level = 0
      }
    },
    /// 监听添加用户对话框的关闭事件
    deleteCate () {
      this.$refs.addCartRef.resetFields()
      this.selectUser = []
      this.addCartFrom.cat_level = 0
      this.addCartFrom.cat_pid = 0
    },
    // 点击按钮添加新的分类
    addCart () {
      this.$refs.addCartRef.validate(val => {
        if (!val) return // 如果预校验失败则直接如return出去不进行下一步
        fetchPost('categories', this.addCartFrom)
          .then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error('创建用户失败')
            } else {
              this.$message.success('创建用户成功')
              this.getCartList()
              this.addCateListMessage = false
            }
          })
      })
    },
    // 监听编辑分类对话框的关闭事件 关闭清空输入信息
    edildFromUserCart () {
      this.$refs.edildCartFormRef.resetFields()
    },
    // 监听编辑的点击事件
    primarCart (val) {
      request('categories/' + val.cat_id)
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取用户信息失败')
          } else {
            this.edildFormCart = res.data
            console.log(this.edildFormCart)
            this.modifyGetUserCate = true
          }
        })
    },
    // 修改用户信息并提交
    output () {
      // 如果预校验为true表示用过进行数据请求，为false未通过直接return出去
      this.$refs.edildCartFormRef.validate(val => {
        console.log(val)
        if (!val) return
        //  发起修改用户信息的数据请求
        putModify('categories/' + this.edildFormCart.cat_id,
          {
            cat_name: this.edildFormCart.cat_name
          })
          .then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('用户信息修改失败')
            } else {
              // 刷新用户数据列表
              this.getCartList()
              // 提示修改成功
              this.$message.success('用户信息修改成功')
              // 关闭对话框
              this.modifyGetUserCate = false
            }
          })
      })
    },
    // 根据ID删除对应的用户信息
    eliminate: async function (val) {
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
      console.log(res)
      if (res !== 'confirm') {
        return this.$message.info('已取消了删除')
      } else {
        // console.log('取人了');
        deleteModify('categories/' + val.cat_id)
          .then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('用户删除失败')
            } else {
              // 刷新用户数据列表
              this.getCartList()
              this.$message.success('用户删除成功')
              this.modifyGetUserCate = false
            }
          })
      }
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
    overflow-y: scroll;
    max-height: 89vh;
  }

  .btn {
    margin-bottom: 10px;
  }
  .el-cascader{
    width: 100%;
  }
</style>

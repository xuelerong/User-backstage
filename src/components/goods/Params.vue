<template>
  <div>
    <!--      面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片视图区域-->
    <el-card>
      <!--     头部的警告区域-->
      <el-alert show-icon :closable="false"
                title="注意：只允许为第三级分类设置相关参数！"
                type="warning">
      </el-alert>
      <!--      选择商品分类区域-->
      <el-row class="Cat_P">
        <el-col>
          <span>选择商品分类：</span>
          <!--          商品分类的级联选择框-->
          <el-cascader
            v-model="valueParams"
            :options="getParams"
            expandTrigger='hover'
            :props="cartProps"
            @change="handleChange"/>
        </el-col>
      </el-row>
      <!--        tabs标签页-->
      <el-tabs v-model="activeName" @tab-click="handleClickTabs">
        <!--        添加动态参数的面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isBtn" type="primary" @click="dialogVisibleParame = true" size="mini">添加参数</el-button>
          <!--          动态参数表格 stripe隔行变色-->
          <el-table class="topPs" :data="manyParamsData" border stripe>
            <!--            展开行-->
            <!--            循环渲染tag标签 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item,index) in scope.row.attr_vals"
                        :key="index" @close="removeParames(index,scope.row)">{{item}}
                </el-tag>
                <!--                输入的文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisibleParam"
                  v-model="scope.row.inputValueinputVisibleParam"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirminputVisibleParam(scope.row)"
                  @blur="handleInputConfirminputVisibleParam(scope.row)">
                </el-input>
                <!--                添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="wInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--            索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop=attr_name></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-search"
                           @click='ibleParame(scope.row.attr_id)'>编辑
                </el-button>
                <el-button size="mini" type="danger" @click="delePromer(scope.row.attr_id)" icon="el-icon-delete">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--        添加静态参数的面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isBtn" type="primary" @click='dialogVisibleParame = true' size="mini">添加属性</el-button>
          <!--          静态参数表格 stripe隔行变色 -->
          <el-table class="topPs" :data="onlyParamsData" border stripe>
            <!--            展开行-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item,index) in scope.row.attr_vals"
                        :key="index" @close="removeParames(index,scope.row)">{{item}}
                </el-tag>
                <!--                输入的文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisibleParam"
                  v-model="scope.row.inputValueinputVisibleParam"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirminputVisibleParam(scope.row)"
                  @blur="handleInputConfirminputVisibleParam(scope.row)">
                </el-input>
                <!--                添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="wInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--            索引列-->
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop=attr_name> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-search"
                           @click='ibleParame(scope.row.attr_id)'>编辑
                </el-button>
                <el-button size="mini" type="danger" @click="delePromer(scope.row.attr_id)" icon="el-icon-delete">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--    控制添加参数或属性对话框的显示与隐藏-->
    <el-dialog
      :title="'添加'+ btnUserParmar"
      :visible.sync="dialogVisibleParame"
      width="50%" @close="addDivgParams">
      <el-form :model="paramsFormModel" :rules="paramsFormRules" ref="paramsFormRef"
               label-width="100px">
        <el-form-item :label="btnUserParmar" prop="attr_name">
          <el-input v-model="paramsFormModel.attr_name"> </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleParame = false">取 消</el-button>
    <el-button type="primary" @click="addParamsUser">确 定</el-button>
  </span>
    </el-dialog>

    <!--    控制编辑参数或属性对话框的显示与隐藏-->
    <el-dialog
      :title="'修改'+ btnUserParmar"
      :visible.sync="VisibleParame"
      width="50%" @close="DivgParams">
      <el-form :model="paramsForm" :rules="pamsFormRules" ref="pamsFormRef"
               label-width="100px">
        <el-form-item :label="btnUserParmar" prop="attr_name">
          <el-input v-model="paramsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="VisibleParame = false">取 消</el-button>
    <el-button type="primary" @click="amsUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { request, fetchPost, putModify, deleteModify } from '../../network/request'

export default {
  name: 'Params',
  data () {
    return {
      getParams: [],
      // 级联选择框双向帮定到的数组
      valueParams: [],
      // 级联选择框的配置对象
      cartProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //  被激活的页签名称
      activeName: 'many',
      // 动态参数的数据
      manyParamsData: [],
      // 静态参数的数据
      onlyParamsData: [],
      // 控制添加参数或属性对话框的显示与隐藏
      dialogVisibleParame: false,
      // 控制编辑参数或属性对话框的显示与隐藏
      VisibleParame: false,
      // 添加数据的表单数据对象
      paramsFormModel: {
        attr_name: ''
      },
      // 编辑数据的表单数据对象
      paramsForm: {},
      // 添加表单的验证规则对象
      paramsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 编辑表单的验证规则对象
      pamsFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCarelist()
  },
  methods: {
    getCarelist () {
      request('categories')
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取用户信息失败')
          } else {
            this.getParams = res.data
          }
        })
    },
    // 级联选择框中选中项变化会触发这个函数
    handleChange () {
      this.getUsuerParams()
    },
    // tabs页签点击时候的处理函数
    handleClickTabs () {
      console.log(this.activeName)
      this.getUsuerParams()
    },
    //  获取参数的列表数据
    getUsuerParams () {
      // 证明选中的不是三级分类
      if (this.valueParams.length !== 3) {
        this.valueParams = []
        this.manyParamsData = []
        this.onlyParamsData = []
      } else {
        // 证明选中的是三级分类
        console.log(this.valueParams)
        // 根据所选分类的id，和当前所处的面板，获取对应的参数
        request(`categories/${this.cartUser}
          /attributes`, { sel: this.activeName })
          .then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('用户信息获取失败')
            } else {
              res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                //  控制文本框的显示于隐藏
                item.inputVisibleParam = false
                // 文本框中输入的值
                item.inputValueinputVisibleParam = ''
              })
              console.log(res)
              if (this.activeName === 'many') {
                this.manyParamsData = res.data
              } else {
                if (this.activeName === 'only') {
                  this.onlyParamsData = res.data
                }
              }
            }
          })
      }
    },
    // 监听对话框的关闭事件，当触发的时候清空表单
    addDivgParams () {
      this.$refs.paramsFormRef.resetFields()
    },
    // 监听对话框的关闭事件，当触发的时候清空表单
    DivgParams () {
      this.$refs.pamsFormRef.resetFields()
    },
    // 点击按钮添加参数
    addParamsUser () {
      // 先进行表单预验证，如果取反则表示未通过，不进行数据请求
      this.$refs.paramsFormRef.validate(val => {
        if (!val) return
        fetchPost(`categories/${this.cartUser}/attributes`, {
          attr_name: this.paramsFormModel.attr_name,
          attr_sel: this.activeName
        })
          .then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error('参数信息添加失败')
            } else {
              this.$message.success('参数信息添加成功')
              this.dialogVisibleParame = false
              this.getUsuerParams()
            }
          })
      })
    },
    // 文本框失去焦点或按下了enter键盘
    handleInputConfirminputVisibleParam (row) {
      row.inputVisibleParam = false
      row.attr_vals.push(row.inputValueinputVisibleParam.trim())
      row.inputVisibleParam = false
      // 文本框中输入的值
      row.inputValueinputVisibleParam = ''
      //  发起请求保存这次操作
      this.saceParams(row)
    },
    // 将对attr_valuesv保存到数据库中
    saceParams (row) {
      putModify(`categories/${this.cartUser}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      }).then(res => {
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数信息失败')
        } else {
          this.$message.success('获取参数信息成功')
          console.log(res)
        }
      })
    },
    //
    wInput (row) {
      row.inputVisibleParam = true
      // 让文本框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击按钮确认编辑参数
    amsUser () {
      // 先进行表单预验证，如果取反则表示未通过，不进行数据请求
      this.$refs.pamsFormRef.validate(val => {
        if (!val) return
        putModify(`categories/${this.cartUser}/attributes/${this.paramsForm.attr_id}`, {
          attr_name: this.paramsForm.attr_name,
          attr_sel: this.activeName
        })
          .then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('参数信息更改失败')
            } else {
              this.$message.success('参数信息更改成功')
              this.VisibleParame = false
              this.getUsuerParams()
            }
          })
      })
    },
    // 点击按钮确认删除参数
    async delePromer (attrId) {
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
        deleteModify(`categories/${this.cartUser}/attributes/${attrId}`)
          .then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('参数信息删除失败')
            } else {
              this.$message.success('参数信息删除成功')
              this.getUsuerParams()
            }
          })
      }
    },
    // 点击编辑获取数据显示编辑面板
    ibleParame (attrId) {
      request(`categories/${this.cartUser}/attributes/${attrId}`, {
        attr_sel: this.activeName
      })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取参数信息失败')
          } else {
            this.paramsForm = res.data
            this.VisibleParame = true
          }
        })
    },
    // 点击删除对应的参数可选项
    removeParames (index, row) {
      row.attr_vals.splice(index, 1)
      this.saceParams(row)
    }
  },
  computed: {
    // 如果按钮需要禁用则返回true，否则返回false
    isBtn () {
      if (this.valueParams.length !== 3) {
        return true
      } else {
        return false
      }
    },
    //  当前选中的三级分类id
    cartUser () {
      if (this.valueParams.length === 3) {
        return this.valueParams[2]
      } else {
        return null
      }
    },
    // 控制控制添加参数或属性对话框的标题
    btnUserParmar () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
  }

  .Cat_P {
    margin: 15px 0;
  }

  .topPs {
    margin-top: 10px;
  }

  .el-tag {
    margin-right: 9px;
  }

  .input-new-tag {
    width: 120px;
  }
</style>

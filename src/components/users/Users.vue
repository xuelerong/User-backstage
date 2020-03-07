<template>
  <div>
    <!--      面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片视图区-->
    <el-card>
      <!--        搜索与添加区域-->
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="querInfo.query"
                    clearable @clear="getUser">
            <el-button slot="append" icon="el-icon-search" @click="getUser"/>
          </el-input>
          <el-col>
            <el-button class="btn" type="primary" @click="addvisible=true">添加用户</el-button>
          </el-col>
        </el-col>
      </el-row>
      <!--      用户列表区域 border表格添加边框 stripe 隔行变色 prop表示当前指向哪个数据
      type="index"给表格添加序号-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"/>
        <el-table-column label="姓名" prop="username"/>
        <el-table-column label="邮箱" prop="email"/>
        <el-table-column label="电话" prop="mobile"/>
        <el-table-column label="角色" prop="role_name"/>
        <el-table-column label="状态">
          <!--        使用scope接收一下作用域插槽的数据  -->
          <template slot-scope="scope">
            <!--            {{scope.row}}-->
            <el-switch
              v-model="scope.row['mg_state']" @change="userState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
          <!--          编辑按钮-->
          <el-button type="primary" icon="el-icon-edit" @click="clearUser(scope.row.id)" size="mini"/>
          <!--          删除按钮-->
          <el-button type="danger" icon="el-icon-delete"
                     size="mini" @click="removeUser(scope.row.id)"/>
          <!--          分配权限按钮-->
          <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting"
                       @click="setRoleDialongOpen(scope.row)" size="mini"/>
          </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域   current-page表示当前显示是第几页的数据 :page-size当前状态下每页显示多少条数据-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--    添加用户的对话框-->
    <el-dialog
      title="添加用户" :visible.sync="addvisible" width="50%" @close="addClose">
      <!--      内容主题区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="useremail">
          <el-input v-model="addForm.useremail"/>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"/>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addvisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
<!--    修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="modifyGetUser"
      width="50%"
    @close="edildFromUser">
      <el-form :model="edildForm" :rules="edildFormRules"
               label-width="70px" ref="edildFormRef">
        <el-form-item label="用户名">
          <el-input v-model="edildForm.username" disabled/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edildForm.email"/>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="edildForm.mobile"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="modifyGetUser = false">取 消</el-button>
    <el-button type="primary" @click="eidltUsersInfo">确 定</el-button>
  </span>
    </el-dialog>
<!--    分配角色对话框-->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialong"
      width="50%" @close="noQius">
      <div>
        <p>当前的用户:{{userInfo.username}}</p>
        <p>当前的角色:{{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectRowId" placeholder="请选择">
            <el-option
              v-for="item in rolrsUserList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialong = false">取 消</el-button>
    <el-button type="primary" @click="saveInfo">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { request, putModify, fetchPost, deleteModify } from '../../network/request'

export default {
  name: 'Users',
  data () {
    // 验证邮箱规则
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取当前用户列表的参数对象
      querInfo: {
        // 用户名
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制用户对话框的显示与隐藏
      addvisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        useremail: '',
        mobile: ''
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialong: false,
      // 控制修改用户对话框的显示与隐藏
      modifyGetUser: false,
      // 查询到的用户信息对象
      edildForm: {},
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolrsUserList: [],
      // 已选中的角色ID值
      selectRowId: '',
      // 修改表单的验证规则对象
      edildFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        useremail: [
          { required: true, message: '请输入用户邮箱号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    getUser: function () {
      request('users', this.querInfo)
        .then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('获取用户列表失败')
          }
          this.userlist = res.data.users
          this.total = res.data.total
        })
    },
    // 监听pagesize改变的事件
    handleSizeChange (val) {
      this.querInfo.pagesize = val
      this.getUser()
    },
    // 监听页码值改变的事件
    handleCurrentChange (val) {
      this.querInfo.pagenum = val
      this.getUser()
    },
    // 监听switch的开关
    userState (val) {
      console.log(val)
      putModify(`users/${val.id}/state/${val.mg_state}`)
        .then(res => {
          // console.log(res)
          if (res.meta.status !== 200) {
            val.mg_state = !val.mg_state
            return this.$message.error('用户状态更新失败')
          } else {
            return this.$message.success('用户状态更新成功')
          }
        })
    },
    // 监听添加用户对话框的关闭事件(清除添加用户表单调用resetFields)
    addClose () {
      this.$refs.addForm.resetFields()
    },
    // 点击按钮添加新用户
    addUser: function () {
      this.$refs.addForm.validate(val => {
        console.log(val)
        if (!val) return
        // 可以发起用户请求
        fetchPost('users', this.addForm)
          .then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error('用户信息添加失败')
            } else {
              this.$message.success('用户信息添加成功')
              //  隐藏添加的对话框
              this.addvisible = false
              //  重新获取用户列表数据
              this.getUser()
            }
          })
      })
    },
    //  展示编辑用户的对话框
    clearUser (id) {
      // 点击修改用户对话框显示
      this.modifyGetUser = true
      console.log(id)
      request('users/' + id)
        .then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('查询用户信息失败')
          } else {
            this.edildForm = res.data
          }
        })
    },
    // 监听修改用户对话框的关闭事件
    edildFromUser () {
      this.$refs.edildFormRef.resetFields()
    },
    // 修改用户信息并提交
    eidltUsersInfo () {
      this.$refs.edildFormRef.validate(val => {
        console.log(val)
        if (!val) return
        //  发起修改用户信息的数据请求
        putModify('users/' + this.edildForm.id,
          {
            email: this.edildForm.email,
            mobile: this.edildForm.mobile
          })
          .then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('用户信息修改失败')
            } else {
              // 刷新用户数据列表
              this.getUser()
              // 提示修改成功
              this.$message.success('用户信息修改成功')
              // 关闭对话框
              this.modifyGetUser = false
            }
          })
      })
    },
    // 根据ID删除对应的用户信息
    removeUser: async function (id) {
      console.log(id)
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
        console.log('取人了')
        deleteModify('users/' + id)
          .then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('用户删除失败')
            } else {
              // 刷新用户数据列表
              this.getUser()
              this.$message.success('用户删除成功')
            }
          })
      }
    },
    // 展示分配角色的对话框
    setRoleDialongOpen (userInfo) {
      this.userInfo = userInfo
      console.log(userInfo)
      // 在展示对话框之前获取所有的角色列表
      request('roles')
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取角色列表失败')
          } else {
            this.rolrsUserList = res.data
          }
        })
      this.setRoleDialong = true
    },
    // 点击按钮分配角色
    saveInfo () {
      if (!this.selectRowId) {
        return this.$message.error('请选择分配角色')
      } else {
        putModify(`users/${this.userInfo.id}/role`,
          { rid: this.selectRowId })
          .then(res => {
            if (res.meta.status !== 200) {
              return this.$message.error('更新角色失败')
            } else {
              this.$message.success('更新角色成功')
              this.setRoleDialong = false
              this.getUser()
            }
          })
      }
    },
    // 监听分配对话框的关闭事件
    noQius () {
      this.userInfo = {}
      this.selectRowId = ''
    }
  }
}
</script>

<style scoped>
  .el-breadcrumb {
    font-size: 16px;
    margin-bottom: 15px;
  }

  .el-card {
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1) !important;
  }

  .el-row {
    width: 364px;
  }

  .btn {
    position: absolute;
    top: 0;
    left: 380px;
  }

  .el-table {
    margin-top: 15px;
    font-size: 13px;
  }

  .el-pagination {
    margin-top: 15px;
  }
</style>

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--      卡片视图区-->
    <el-card>
      <el-row>
        <el-col>
          <el-button class="btndd" type="primary"
                     @click="addRoles=true">添加用户
          </el-button>
        </el-col>
      </el-row>
      <!--      角色列表区域-->
      <el-table :data="listRoles" border stripe>
        <!--        展开列  expand给每个角色添加一个展开按钮-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',il ===0?'btn' :'','vencter']" v-for="(item1,il) in scope.row.children"
                    :key="item1.id">
              <!--               渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRolesuser(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"/>
              </el-col>
              <!--              渲染二级和三级权限-->
              <el-col :span="19">
                <el-row :class="[i2===0?'':'btn','vencter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRolesuser(scope.row,item2.id)">{{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"/>
                  </el-col>
                  <!--                  三级权限-->
                  <el-col :span="18">
                    <el-tag type="warning" class="wltag" v-for="item3 in item2.children"
                            :key="item3.id" closable @close="removeRolesuser(scope.row,item3.id)">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--        索引列-->
        <el-table-column type="index"/>
        <el-table-column label="角色名称" prop="roleName">

        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc">

        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
                       @click="modifyGet(scope.row.id)">编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoles(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting"
                       @click="openuser(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--    添加用户对话框  :visible.sync用来控制对话框的显示与隐藏-->
    <el-dialog
      title="添加用户" :visible.sync="addRoles" width="50%" @close="addCloseRoles">
      <!--      内容主体区域-->
      <el-form :model="addpostRoles" :rules="addpostRolesRules"
               ref="addpostRolesRef" label-width="80px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addpostRoles.roleName"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addpostRoles.roleDesc"/>
        </el-form-item>
      </el-form>
      <!--      底部区域-->
      <span slot="footer" class="dialog-footer">
    <el-button @click="addRoles = false">取 消</el-button>
    <el-button type="primary" @click="addUserPoles">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改用户的对话框-->
    <el-dialog
      title="修改用户"
      :visible.sync="modifyGetRoles"
      width="50%" @close="edildGFromUser">
      <el-form :model="ildGetForm" :rules="edildGetFormRules"
               label-width="80px" ref="getedildFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ildGetForm.roleName"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ildGetForm.roleDesc"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="modifyGetRoles = false">取 消</el-button>
    <el-button type="primary" @click="resovelRoles">确 定</el-button>
  </span>
    </el-dialog>
    <!--    分配权限的对话框-->
    <el-dialog
      title="分配权限" class="xuelerong"
      :visible.sync="setRightVisible"
      width="50%" @close="clickRrights">
      <!--      树形控件-->
      <el-tree class="rightSER" :data="rightListUser" default-expand-all
               show-checkbox node-key="id" :props="threeProps"
               ref="treeRef" :default-checked-keys="defKeys"/>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightVisible = false">取 消</el-button>
    <el-button type="primary" @click="setMessage">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPost, request, putModify, deleteModify } from '../../network/request'

export default {
  name: 'Roles',
  data () {
    return {
      // 所有角色列表区域
      listRoles: [],
      // 控制分配权限的对话框显示与隐藏
      setRightVisible: false,
      // 所有权限的数据
      rightListUser: [],
      // 树形控件的属性绑定对象
      threeProps: {
        label: 'authName',
        children: 'children'
      },
      // 控制添加用户对话框的显示与隐藏
      addRoles: false,
      // 默认选中的节点ID数组
      defKeys: [],
      // 当前即将分配权限的id
      rileId: '',
      // 添加用户的表单数据
      addpostRoles: {
        roleName: '',
        roleDesc: ''
      },
      // 控制编辑用户对话框的显示与隐藏
      modifyGetRoles: false,
      // 查询到的用户信息对象
      ildGetForm: {},
      // 添加表单的验证规则对象
      addpostRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 修改表单验证规则对象
      edildGetFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getListRoles()
  },
  methods: {
    // 获取所有角色的列表
    getListRoles () {
      request('roles')
        .then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('获取用户角色失败')
          } else {
            this.listRoles = res.data
            // this.$message.success('获取用户列表成功')
          }
        })
    },
    // 监听添加用户对话框的关闭事件(清除添加用户表单调用resetFields)
    addCloseRoles () {
      this.$refs.addpostRolesRef.resetFields()
    },
    // 点击按钮添加新用户
    addUserPoles () {
      this.$refs.addpostRolesRef.validate(val => {
        console.log(val)
        if (!val) return
        // 可以发起用户请求
        fetchPost('roles', this.addpostRoles)
          .then(res => {
            if (res.meta.status !== 201) {
              return this.$message.error('用户信息添加失败')
            } else {
              this.$message.success('用户信息添加成功')
              //  隐藏添加的对话框
              this.addRoles = false
              //  重新获取用户列表数据
              this.getListRoles()
            }
          })
      })
    },
    modifyGet (id) {
      console.log(id)
      request('roles/' + id)
        .then(res => {
          // console.log(res.data.roleId);
          if (res.meta.status !== 200) {
            return this.$message.error('获取用户信息失败')
          } else {
            this.modifyGetRoles = true
            this.ildGetForm = res.data
            console.log(this.ildGetForm)
            this.$message.success('获取用户信息成功')
          }
        })
    },
    // 监听修改用户对话框的关闭事件(重置)
    edildGFromUser () {
      this.$refs.getedildFormRef.resetFields()
    },
    // 修改用户信息并提交
    resovelRoles () {
      // 如果预校验为true表示用过进行数据请求，为false未通过直接return出去
      this.$refs.getedildFormRef.validate(val => {
        console.log(val)
        if (!val) return
        //  发起修改用户信息的数据请求
        putModify('roles/' + this.ildGetForm.roleId,
          {
            roleName: this.ildGetForm.roleName,
            roleDesc: this.ildGetForm.roleDesc
          })
          .then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('用户信息修改失败')
            } else {
              // 刷新用户数据列表
              this.getListRoles()
              // 提示修改成功
              this.$message.success('用户信息修改成功')
              // 关闭对话框
              this.modifyGetRoles = false
            }
          })
      })
    },
    // 根据ID删除对应的用户信息
    removeRoles: async function (id) {
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
        // console.log('取人了');
        deleteModify('roles/' + id)
          .then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('用户删除失败')
            } else {
              // 刷新用户数据列表
              this.getListRoles()
              this.$message.success('用户删除成功')
            }
          })
      }
    },
    // 根据id删除对应的权限
    async removeRolesuser (rold, rightId) {
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
        deleteModify(`roles/${rold.id}/rights/${rightId}`)
          .then(res => {
            console.log(res)
            if (res.meta.status !== 200) {
              return this.$message.error('用户删除失败')
            } else {
              // 刷新用户数据列表
              // this.getListRoles();
              rold.children = res.data
              this.$message.success('用户删除成功')
            }
          })
      }
    },
    // 展示分配权限的对话框
    openuser (role) {
      // 获取所有权限的数据
      request('rights/tree')
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取权限数据失败')
          } else {
            // 递归获取三级节点的id
            this.rileId = role.id
            this.getUserId(role, this.defKeys)
            this.setRightVisible = true
            this.rightListUser = res.data
            console.log(this.rightListUser)
            this.$message.success('获取权限数据成功')
          }
        })
    },
    // 通过递归的形式，获取角色下所有三级权限的id并保存到defKeys数组中
    getUserId (node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      //  如果不是三级节点这里就调用递归的方法来获取到三级节点
      //  每循环一项拿到一个字节点的item，根据item再次调用递归函数
      node.children.forEach(item => {
        this.getUserId(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    clickRrights () {
      this.defKeys = []
    },
    // 点击分配权限
    setMessage () {
      const key = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(key)
      const strID = key.join(',')
      fetchPost(`roles/${this.rileId}/rights`, { rids: strID })
        .then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('添加权限数据失败')
          } else {
            this.$message.success('添加权限数据成功')
            this.setRightVisible = false
            this.getListRoles()
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
    max-height: 90vh;
  }

  .el-tag {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .wltag {
    margin-right: 12px;
  }

  .btndd {
    margin-bottom: 10px;
  }

  .btn {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vencter {
    display: flex;
    align-items: center;
  }

  .xuelerong {
    position: absolute;
  }
</style>

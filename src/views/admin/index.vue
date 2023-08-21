<template>
  <div class="table-container">
    <br>
    <el-button class="add-button" type="primary" @click="createUser()">添加新账号</el-button>
    <br>
    <el-table :data="tableDataComputed" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="200" />
      <el-table-column prop="name" label="账号" width="200" />
      <el-table-column prop="enable" label="是否可用" width="200" />
      <el-table-column prop="role" label="角色" width="200" />
      <el-table-column prop="created" label="创建时间" width="200" />
      <el-table-column prop="updated" label="修改时间" width="200" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.name)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="adminForm"
        label-position="left"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="ID">
          <el-input v-model="adminForm.id" disabled />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="adminForm.name" :disabled="oldUser" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="adminForm.role" class="align-left">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用">
          <el-select v-model="adminForm.enable" class="align-left">
            <el-option v-for="item in enableOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUser()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { userList, userDelete, userUpsert } from '@/api/user'

export default {

  data() {
    return {
      tableData: [],
      adminForm: {
        id: null,
        name: null,
        role: null,
        enable: null
      },
      dialogFormVisible: false,
      oldUser: true,
      enableOptions: [
        {
          label: '是',
          value: true
        },
        {
          label: '否',
          value: false
        }
      ],
      roleOptions: [
        {
          label: '超级管理员',
          value: 'admin'
        },
        {
          label: '管理员',
          value: 'user'
        },
        {
          label: '访客',
          value: 'visitor'
        }
      ]
    }
  },
  computed: {
    tableDataComputed() {
      return this.tableData.map((item) => {
        let role
        switch (item.role) {
          case 'admin':
            role = '超级管理员'
            break
          case 'user':
            role = '管理员'
            break
          default :
            role = '访客'
        }
        return {
          id: item.id,
          name: item.name,
          role: role,
          srcRole: item.role,
          enable: item.enable === true ? '是' : '否',
          created: moment.unix(item.created).format('YYYY-MM-DD HH:mm:ss'),
          updated: moment.unix(item.updated).format('YYYY-MM-DD HH:mm:ss'),
          srcEnable: item.enable
        }
      })
    }
  },
  created() {
    this.fetchAll()
  },
  methods: {
    fetchAll() {
      userList()
        .then((response) => {
          this.tableData = response.data.list
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '获取用户列表失败',
            type: 'warning'
          })
        })
    },
    handleEdit(row) {
      this.adminForm = {
        id: row.id,
        name: row.name,
        role: row.srcRole,
        enable: row.srcEnable
      }
      this.oldUser = true
      this.dialogFormVisible = true
    },
    handleDelete(name) {
      userDelete(name)
        .then((response) => {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.fetchAll()
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'warning'
          })
        })
    },
    submitUser() {
      userUpsert(this.adminForm)
        .then(() => {
          console.log(this.$router)
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.fetchAll()
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '修改失败',
            type: 'warning'
          })
        })
    },
    createUser() {
      this.adminForm = {
        id: 0,
        name: '',
        role: 'visitor',
        enable: true
      }
      this.oldUser = false
      this.dialogFormVisible = true
    }
  }
}
</script>

<style>
.table-container {
  text-align: center;
}
.align-left {
  display: flex;
}
.add-button {
  display: flex;
  margin-left: 20px;
}
</style>

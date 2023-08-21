<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" status-icon label-width="200px">
      <el-form-item label="原始密码" prop="oldPassword">
        <el-input v-model.trim="form.oldPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model.trim="form.newPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="repeatedPassword">
        <el-input v-model.trim="form.repeatedPassword" type="password" autocomplete="off" placeholder="再次输入新密码" />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          @click="onSubmit"
        >提交</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePassword, checkPassword } from '@/api/user'
export default {
  data() {
    var validateOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('长度不能小于6位'))
        } else {
          checkPassword(value)
            .then((response) => {
              callback()
            })
            .catch(() => {
              callback(new Error('原始密码错误'))
            })
        }
      }
    }
    var validateNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('长度不能小于6位'))
        } else {
          if (this.form.repeatedPassword !== '') {
            this.$refs.form.validateField('repeatedPassword')
          }
          callback()
        }
      }
    }
    var validateRepeated = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        repeatedPassword: ''
      },
      loading: false,
      rules: {
        oldPassword: [
          { validator: validateOld, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validateNew, trigger: 'blur' }
        ],
        repeatedPassword: [
          { validator: validateRepeated, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.loading = true

      this.$refs.form.validate((valid) => {
        if (valid) {
          return true
        } else {
          return false
        }
      })

      changePassword(this.form)
        .then((response) => {
          this.loading = false
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
        })
    },

    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}

.el-input {
  width: 400px;
}
</style>

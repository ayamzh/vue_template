<template>
  <div class="app-container">
    <el-form
      ref="formSearch"
      :inline="true"
      :model="formSearch"
      label-width="150px"
    >
      <el-form-item label="查询账号">
        <el-input
          v-model.trim="formSearch.name"
          placeholder="please input passport"
          @change="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="searchLoading"
          type="primary"
          @click="onSearch"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <br>
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="FP账号">
        <el-input v-model="form.name" :disabled="true" required />
      </el-form-item>
      <el-form-item label="Uid">
        <el-input v-model="form.id" :disabled="true" />
      </el-form-item>
      <el-form-item label="注册时间">
        <el-date-picker
          v-model="form.registTime"
          type="datetime"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          @click="onSubmit"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { editPassport, getPassport } from '@/api/passport'
export default {
  data() {
    return {
      formSearch: {
        name: ''
      },
      form: {
        name: '',
        id: null,
        registTime: '',
        registTimestamp: null
      },
      loading: false,
      searchLoading: false
    }
  },
  watch: {
    'form.registTime': function(val) {
      this.form.registTimestamp = moment(val).unix()
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      if (this.form.name === '') {
        this.$message({
          showClose: true,
          message: '请输入用户名',
          type: 'warning'
        })
        this.loading = false
        return
      }

      editPassport(this.form)
        .then((response) => {
          this.loading = false
          this.$message({
            showClose: true,
            message: '修改成功息',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    onSearch() {
      this.searchLoading = true
      getPassport(this.formSearch.name)
        .then((response) => {
          this.form.id = response.data.id
          this.form.name = response.data.name
          this.form.registTimestamp = response.data.registTimestamp
          this.form.registTime = moment.unix(response.data.registTimestamp).format('YYYY-MM-DD HH:mm:ss')
          this.searchLoading = false
        })
        .catch(() => {
          this.searchLoading = false
        })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

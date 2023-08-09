<template>
  <div class="app-container">
    <el-form ref="formSearch" :inline="true" :model="formSearch" label-width="150px">
      <el-form-item label="查询账号">
        <el-input v-model="formSearch.name" placeholder="please input passport" @change="onSearch" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="searchLoading" type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <br>
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="FP账号">
        <el-input v-model="form.fpID" :disabled="true" />
      </el-form-item>
      <el-form-item label="Uid">
        <el-input v-model.number="form.uid" :disabled="true" required />
      </el-form-item>
      <el-form-item label="经验值">
        <el-input v-model.number="form.exp" type="number" placeholder="等级经验只需修改任意一项" />
      </el-form-item>
      <el-form-item label="等级">
        <el-input v-model.number="form.level" type="number" placeholder="等级经验只需修改任意一项" />
      </el-form-item>
      <el-form-item label="金币">
        <el-input v-model.number="form.coin" type="number" />
      </el-form-item>
      <el-form-item label="钻石">
        <el-input v-model.number="form.gem" type="number" />
      </el-form-item>
      <el-form-item label="累计登录次数">
        <el-input v-model.number="form.loginCount" type="number" />
      </el-form-item>
      <el-form-item label="最近一次登录时间">
        <el-date-picker v-model="form.loginTime" type="datetime" placeholder="Pick a date" style="width: 100%" />
      </el-form-item>
      <el-form-item label="时间偏移量">
        <el-input v-model.number="form.timeOffset" type="number" placeholder="单位秒" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { editPlayer, getPlayer } from '@/api/player'
export default {
  data() {
    return {
      formSearch: {
        name: ''
      },
      form: {
        fpID: '',
        uid: null,
        exp: null,
        level: null,
        coin: null,
        gem: null,
        loginCount: null,
        loginTime: null,
        loginTimestamp: null,
        timeOffset: null
      },
      loading: false,
      searchLoading: false
    }
  },
  watch: {
    'form.registTime': function(val) {
      this.form.loginTimestamp = moment(val).unix()
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      if (this.form.name === '') {
        this.$message('no data')
        this.loading = false
        return
      }

      editPlayer(this.form)
        .then((response) => {
          response.data.loginTime = moment(response.data.loginTimestamp)
            .format('YYYY-MM-DD HH:mm:ss')
          this.form = response.data
          this.loading = false
          this.$message('修改成功')
        })
        .catch(() => {
          this.loading = false
        })
    },
    onSearch() {
      this.searchLoading = true
      getPlayer(this.formSearch.name)
        .then((response) => {
          response.data.loginTime = moment(response.data.loginTimestamp)
            .format('YYYY-MM-DD HH:mm:ss')
          this.form = response.data
          this.searchLoading = false
        })
        .catch(() => {
          this.searchLoading = false
        })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
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

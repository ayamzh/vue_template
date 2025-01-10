<template>
  <div class="app-container">
    <el-form ref="formSearch" :inline="true" :model="formSearch" label-width="150px">
      <el-form-item label="查询账号">
        <el-input v-model.trim="formSearch.name" placeholder="please input passport" @change="onSearch" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="searchLoading" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="Uid">
        <el-input v-model.number="form.uid" :disabled="true" required style="width: 30%" />
      </el-form-item>
      <el-form-item label="小黑屋到期时间">
        <el-date-picker v-model="form.banEndtime" type="datetime" placeholder="Pick a date" style="width: 30%" />
      </el-form-item>
      <el-form-item label="封禁天数">
        <el-input-number v-model.number="form.banDays" :min="-9999" :max="9999" placeholder="请输入封禁天数 范围-9999~9999"
          style="width: 30%" />
      </el-form-item>
      <el-form-item label="小黑屋类型">
        <el-select v-model="form.reportType" placeholder="请选择类型" style="width: 30%">
          <el-option v-for="option in reportTypeOptions" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { reportTypes, getOneReport, editReport } from '@/api/report'

export default {
  data() {
    return {
      deleting: null,
      formSearch: {
        name: ''
      },
      form: {
        uid: null,
        banEndtime: '',
        banEndtimestamp: null,
        reportType: null // 小黑屋类型，绑定整数值
      },
      loading: false,
      searchLoading: false,
      reportTypeOptions: [] // 动态获取选项
    }
  },
  watch: {
    'form.banEndtime': function (val) {
      this.form.banEndtimestamp = moment(val).unix()
    }
  },
  mounted() {
    const rawTypeMap = reportTypes(); // 获取原始 typeMap
    this.reportTypeOptions = Object.entries(rawTypeMap).map(([key, value]) => ({
      value: Number(key), // 转换键为数字类型
      label: value,       // 保留显示的文本
    }));
    const { defendantID } = this.$route.query;
    const { uid } = this.$route.query;
    if (defendantID) {
      this.formSearch.name = String(defendantID); // 假设表单搜索字段为 name
      this.onSearch(); // 调用查询方法
    }

    if (uid) {
      this.formSearch.name = String(uid); // 假设表单搜索字段为 name
      this.onSearch(); // 调用查询方法
    }
  },
  methods: {
    onSubmit() {
      this.loading = true
      editReport(this.form)
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
      getOneReport(this.formSearch.name)
        .then((response) => {
          this.form.uid = response.data.uid
          this.form.banEndtimestamp = response.data.banEndtimestamp
          this.form.banEndtime = moment.unix(response.data.banEndtimestamp).format('YYYY-MM-DD HH:mm:ss')
          this.form.reportType = response.data.reportType
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

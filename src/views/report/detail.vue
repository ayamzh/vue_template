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
      <el-form-item label="昵称">
        <el-input v-model="form.nickName" :disabled="true" placeholder="昵称不可编辑" style="width: 30%" />
      </el-form-item>
      <el-form-item label="小黑屋到期时间">
        <!-- 将 el-date-picker 替换为 el-input 使其只读 -->
        <el-input v-model="form.banEndtime" readonly placeholder="Pick a date" style="width: 30%" />
      </el-form-item>
      <el-form-item label="封禁天数">
        <el-input-number v-model.number="form.banDays" :min="-9999" :max="9999" placeholder="请输入封禁天数 范围-9999~9999"
          style="width: 30%" @change="onBanDaysChange" />
      </el-form-item>
      <el-form-item label="小黑屋类型">
        <el-select v-model="form.reportType" placeholder="请选择类型" style="width: 30%">
          <el-option v-for="option in reportTypeOptions" :key="option.value" :label="option.label"
            :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="封禁描述">
        <el-input v-model="form.reason" maxlength="64" placeholder="请输入封禁描述" style="width: 30%" />
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
        nickName: '',  // 新增字段
        banEndtime: '',
        banEndtimestamp: null,
        reportType: null, // 小黑屋类型，绑定整数值
        reason: '' // 新增字段，封禁描述
      },
      loading: false,
      searchLoading: false,
      reportTypeOptions: [], // 动态获取选项
      lastSubmittedBanEndtime: '' // 新增字段，保存上次提交的封禁结束时间
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
      this.loading = true;
      editReport(this.form)
        .then((response) => {
          this.loading = false;
          // 提交成功后，确保表单数据已更新
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success',
          });

          // 手动更新 form 的数据，确保页面数据反映最新内容
          this.form.uid = response.data.uid;
          this.form.nickName = response.data.nickName; // 更新昵称
          this.form.banEndtime = moment.unix(response.data.banEndtimestamp).format('YYYY-MM-DD HH:mm:ss');
          this.form.banEndtimestamp = response.data.banEndtimestamp;
          this.form.reportType = response.data.reportType;
          this.form.reason = response.data.reason; // 更新封禁描述

          // 保存提交后的 banEndtime
          this.lastSubmittedBanEndtime = this.form.banEndtime;
          // 重置封禁天数为 0
          this.form.banDays = 0;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    onSearch() {
      this.searchLoading = true
      getOneReport(this.formSearch.name)
        .then((response) => {
          this.form.uid = response.data.uid
          this.form.nickName = response.data.nickName; // 设置昵称
          this.form.banEndtimestamp = response.data.banEndtimestamp
          this.form.banEndtime = moment.unix(response.data.banEndtimestamp).format('YYYY-MM-DD HH:mm:ss')
          this.form.reportType = response.data.reportType
          this.form.reason = response.data.reason; // 设置封禁描述
          this.searchLoading = false

          // 保存提交后的 banEndtime
          this.lastSubmittedBanEndtime = this.form.banEndtime;
          // 重置封禁天数为 0
          this.form.banDays = 0;
        })
        .catch(() => {
          this.searchLoading = false
        })
    },
    onBanDaysChange() {
      let baseTime = moment(); // 默认为当前时间

      // 如果 lastSubmittedBanEndtime 存在，并且大于当前时间，使用 lastSubmittedBanEndtime 作为基准
      if (this.lastSubmittedBanEndtime) {
        const submittedTime = moment(this.lastSubmittedBanEndtime);
        if (submittedTime.isAfter(moment())) {
          baseTime = submittedTime; // 使用 lastSubmittedBanEndtime 作为基准时间
        }
      } else if (this.form.banEndtime) {
        // 如果小黑屋到期时间尚未到期，使用小黑屋到期时间为基准
        baseTime = moment(this.form.banEndtime);
      }

      // 更新小黑屋到期时间
      const newBanEndtime = baseTime.add(this.form.banDays, 'days').format('YYYY-MM-DD HH:mm:ss');
      this.form.banEndtime = newBanEndtime;
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

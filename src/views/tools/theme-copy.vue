<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="源用户 UID" prop="fromUid">
        <el-input v-model.number="form.fromUid" type="number" placeholder="请输入源用户 UID" />
      </el-form-item>
      <el-form-item label="目标用户 UID" prop="toUid">
        <el-input v-model.number="form.toUid" type="number" placeholder="请输入目标用户 UID" />
      </el-form-item>
      <el-form-item label="机台 ID" prop="fromThemeId">
        <el-input v-model.number="form.fromThemeId" type="number" placeholder="请输入机台 ID" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit">执行拷贝</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { themeCopy } from '@/api/theme'

export default {
  data() {
    return {
      form: {
        fromUid: null,
        toUid: null,
        fromThemeId: null
      },
      loading: false
    }
  },
  methods: {
    onSubmit() {
      const { fromUid, toUid, fromThemeId } = this.form
      if (!fromUid || !toUid || !fromThemeId) {
        this.$message({
          showClose: true,
          message: 'fromUid、toUid、fromThemeId 均不能为空或 0',
          type: 'warning'
        })
        return
      }
      this.loading = true
      themeCopy({ fromUid, toUid, fromThemeId })
        .then(() => {
          this.loading = false
          this.$message({
            showClose: true,
            message: '操作成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
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

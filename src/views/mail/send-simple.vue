<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="目标UID列表">
        <el-input v-model.trim="form.uids" placeholder="逗号分割" required />
      </el-form-item>
      <el-form-item label="邮件模板ID">
        <el-select v-model.number="form.templateId" placeholder="请选择邮件模板ID" @change="onTemplateChange">
          <el-option v-for="item in templateOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮件标题">
        <el-input v-model="form.subject" placeholder="邮件标题" />
      </el-form-item>
      <el-form-item label="邮件内容">
        <el-input v-model="form.body" type="textarea" placeholder="邮件内容" />
      </el-form-item>
      <el-form-item label="附带奖励">
        <el-input v-model="form.customContent" placeholder="附件需填入通用奖励格式（可选）" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit">发送邮件</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getEmailTemplates, sendEmail } from '@/api/mail'

export default {
  data() {
    return {
      form: {
        uids: '',
        templateId: null,
        subject: '',
        body: '',
        customContent: ''
      },
      templateOptions: [],
      templateData: {},
      loading: false
    }
  },
  created() {
    getEmailTemplates()
      .then((response) => {
        this.templateOptions = response.data.options
        // 将模板数据存储到一个对象中，方便后续查找
        this.templateData = response.data.options.reduce((acc, template) => {
          acc[template.value] = template
          return acc
        }, {})
      })
      .catch(() => {
        this.$message({
          showClose: true,
          message: '获取邮件模板列表失败',
          type: 'warning'
        })
      })
  },
  methods: {
    onTemplateChange(templateId) {
      const selectedTemplate = this.templateData[templateId]
      if (selectedTemplate) {
        this.form.subject = selectedTemplate.title
        this.form.body = selectedTemplate.content
      } else {
        this.form.subject = ''
        this.form.body = ''
      }
    },
    onSubmit() {
      this.loading = true
      if (this.form.uids === '') {
        this.$message({
          showClose: true,
          message: '需要填写用户列表',
          type: 'warning'
        })
        this.loading = false
        return
      }

      sendEmail(this.form)
        .then(() => {
          this.loading = false
          this.$message({
            showClose: true,
            message: '邮件发送成功',
            type: 'success'
          })
        })
        .catch(() => {
          this.loading = false
          this.$message({
            showClose: true,
            message: '邮件发送失败',
            type: 'error'
          })
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

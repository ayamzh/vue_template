<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="目标UID列表">
        <el-input v-model="form.uids" placeholder="逗号分割" required />
      </el-form-item>
      <el-form-item label="奖励类型">
        <el-select v-model.number="form.mainType" placeholder="please select type" type="number">
          <el-option v-for="item in mainTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="子类型">
        <el-select v-model.number="form.subType" placeholder="please select type" :disabled="subDisabled" type="number">
          <el-option v-for="item in subTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="数值">
        <el-input v-model.number="form.value" type="number" />
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="确定发送奖励么" @onConfirm="onSubmit">
          <el-button slot="reference" :loading="loading" type="primary">提交</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import { getMainTypes, getSubTypes, sendReward } from '@/api/reward'
export default {
  data() {
    return {
      form: {
        uids: '',
        mainType: null,
        subType: null,
        value: 0
      },
      mainTypeOptions: [

      ],
      subTypeOptions: [

      ],
      subDisabled: true,
      loading: false
    }
  },
  watch: {
    'form.mainType': function(val) {
      this.subDisabled = false
      getSubTypes(val)
        .then((response) => {
          this.subTypeOptions = response.data.options
          if (this.subTypeOptions.length === 0) {
            this.subType = null
            this.subDisabled = true
          }
        })
        .catch(() => {
          this.$message('获取奖励子类型列表失败')
        })
    }
  },
  created() {
    getMainTypes()
      .then((response) => {
        this.mainTypeOptions = response.data.options
      })
      .catch(() => {
        this.$message('获取奖励类型列表失败')
      })
    return
  },
  methods: {
    onSubmit() {
      this.loading = true
      if (this.form.uids === '') {
        this.$message('no data')
        this.loading = false
        return
      }

      sendReward(this.form)
        .then((response) => {
          this.loading = false
          this.$message('发放成功')
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

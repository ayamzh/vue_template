<template>
  <el-form ref="formSearch" :inline="true" :model="formSearch" label-width="150px">
    <el-form-item label="查询账号">
      <el-input v-model.trim="formSearch.name" placeholder="please input passport" @change="onSearch" />
    </el-form-item>
    <el-form-item>
      <el-button :loading="searchLoading" type="primary" @click="onSearch">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      formSearch: {
        name: ''
      },
      searchLoading: false,
      props: ['onSearch']
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

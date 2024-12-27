<template>
  <div class="dashboard-container">
    <div class="dashboard-text">服务器环境: {{ serverEnv }}</div>
    <div class="dashboard-text">用户: {{ adminName }}</div>
    <div class="dashboard-text">权限: {{ role }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'adminName',
      'role',
      'serverEnv'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>

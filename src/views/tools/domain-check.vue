<template>
  <div class="table-container">
    <vxe-table
      border
      show-header-overflow
      show-overflow
      :row-config="{isHover: true}"
      :loading="loading"
      :data="tableData"
      style="margin-top: 20px;"
    >
      <vxe-column field="name" title="域名" />
      <vxe-column field="notBefore" title="生效时间" sortable />
      <vxe-column field="notAfter" title="过期时间" sortable />
      <vxe-column field="version" title="版本" />
      <vxe-column field="serialNumber" title="序列号" />
      <vxe-column field="issuer" title="颁发者" />
      <vxe-column field="subject" title="主题" />
    </vxe-table>
  </div>
</template>

<script>
import moment from 'moment'
import { domainCheck } from '@/api/tools'

export default {
  data() {
    return {
      loading: false,
      tableData: [
      ]
    }
  },
  created() {
    this.fetchAll()
  },
  methods: {
    fetchAll() {
      this.loading = true
      domainCheck()
        .then((response) => {
          this.tableData = response.data.list.map((item) => {
            return {
              name: item.name,
              notBefore: moment.unix(item.notBefore).format('YYYY-MM-DD HH:mm:ss'),
              notAfter: moment.unix(item.notAfter).format('YYYY-MM-DD HH:mm:ss'),
              version: item.version,
              serialNumber: item.serialNumber,
              issuer: item.issuer,
              subject: item.subject
            }
          })
          console.log(this.tableData)
          this.loading = false
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '获取失败',
            type: 'warning'
          })
          this.loading = false
        })
    }
  }
}
</script>

<style>
.table-container {
  text-align: center;
}
</style>

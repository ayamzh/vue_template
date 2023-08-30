<template>
  <div class="table-container">
    <vxe-form :data="formData" style="margin-left: 20px;margin-top: 20px;" @submit="submitEvent">
      <vxe-form-item title="开始时间" field="startTime" span="4" :item-render="{}" title-overflow="ellipsis">
        <template #default="{ data }">
          <vxe-input v-model="data.startTime" type="datetime" placeholder="请选择日期" clearable />
        </template>
      </vxe-form-item>
      <vxe-form-item title="结束时间" field="endTime" span="4" :item-render="{}" title-overflow="ellipsis">
        <template #default="{ data }">
          <vxe-input v-model="data.endTime" type="datetime" placeholder="请选择日期" clearable />
        </template>
      </vxe-form-item>
      <vxe-form-item title="操作者" field="adminName" :item-render="{}" span="4">
        <template #default="{ data }">
          <vxe-input v-model="data.adminName" placeholder="请输入名称" />
        </template>
      </vxe-form-item>
      <vxe-form-item title="行为" field="action" :item-render="{}" span="4">
        <template #default="{ data }">
          <vxe-input v-model="data.action" placeholder="请输入名称" />
        </template>
      </vxe-form-item>
      <vxe-form-item>
        <template #default>
          <vxe-button type="submit" status="primary" size="small" content="查询" />
          <vxe-button type="reset" size="medium" content="重置" />
        </template>
      </vxe-form-item>
    </vxe-form>
    <vxe-table
      border
      show-header-overflow
      show-overflow
      :row-config="{isHover: true}"
      :loading="loading"
      :data="tableData"
      style="margin-top: 20px;"
    >
      <vxe-column field="created" title="操作时间" width="200" sortable />
      <vxe-column field="adminName" title="操作者" width="200" page-sizes />
      <vxe-column field="action" title="行为" width="300" page-sizes />
      <vxe-column field="param" title="参数" />
    </vxe-table>

    <vxe-pager
      :loading="loading"
      :current-page="tablePage.currentPage"
      :page-size="tablePage.pageSize"
      :page-sizes="tablePage.pageSizes"
      :total="tablePage.totalResult"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    />

  </div>
</template>

<script>
import moment from 'moment'
import { getOplogs } from '@/api/user'

export default {
  data() {
    return {
      loading: false,
      tableData: [
      ],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 100,
        pageSizes: [10, 20, 50, 100]
      },
      formData: {
        adminName: '',
        action: '',
        startTime: null,
        endTime: null
      }
    }
  },
  created() {
    this.fetchAll()
  },
  methods: {
    submitEvent() {
      this.fetchAll()
    },
    fetchAll() {
      this.loading = true
      this.formData.currentPage = this.tablePage.currentPage
      this.formData.pageSize = this.tablePage.pageSize
      this.formData.startTimestamp = moment(this.formData.startTime).unix()
      this.formData.endTimestamp = moment(this.formData.endTime).unix()
      console.log(this.formData)
      getOplogs(this.formData)
        .then((response) => {
          this.tableData = response.data.list.map((item) => {
            const binaryData = atob(item.param)

            return {
              adminName: item.adminName,
              action: item.action,
              param: binaryData,
              created: moment.unix(item.created).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          this.tablePage.totalResult = response.data.totalResult
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
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.fetchAll()
    }
  }
}
</script>

<style>
.table-container {
  text-align: center;
}
</style>

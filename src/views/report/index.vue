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
      <vxe-form-item title="举报者" field="reporterID" :item-render="{}" span="4">
        <template #default="{ data }">
          <vxe-input v-model.number="data.reporterID" placeholder="请输入名称" />
        </template>
      </vxe-form-item>
      <vxe-form-item title="被举报者" field="defendantID" :item-render="{}" span="4">
        <template #default="{ data }">
          <vxe-input v-model.number="data.defendantID" placeholder="请输入名称" />
        </template>
      </vxe-form-item>
      <vxe-form-item>
        <template #default>
          <vxe-button type="submit" status="primary" size="big" content="查询" />
          <vxe-button type="reset" size="big" content="重置" />
        </template>
      </vxe-form-item>
    </vxe-form>
    <vxe-table border show-header-overflow show-overflow :row-config="{ isHover: true }" :loading="loading"
      :data="tableData" style="margin-top: 20px;">
      <vxe-column field="id" title="ID" width="200" page-sizes />
      <vxe-column field="reporterID" title="举报者" width="200" page-sizes />
      <vxe-column title="被举报者" width="200">
        <template #default="{ row }">
          <a href="javascript:void(0)" @click="handleDefendantClick(row.defendantID)"
            style="color: #409EFF; cursor: pointer;">
            {{ row.defendantID }}
          </a>
        </template>
      </vxe-column>
      <vxe-column field="reportType" title="举报类型" width="200" sortable />
      <vxe-column field="insertTime" title="操作时间" />
    </vxe-table>

    <vxe-pager :loading="loading" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
      :page-sizes="tablePage.pageSizes" :total="tablePage.totalResult"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']" @page-change="handlePageChange" />

  </div>
</template>

<script>
import moment from 'moment'
import { getReports } from '@/api/report'
import { formatReportType } from '@/api/report'


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
        reporterID: 0,
        defendantID: 0,
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
      this.formData.defendantID = this.formData.defendantID
      this.formData.reporterID = this.formData.reporterID
      this.formData.currentPage = this.tablePage.currentPage
      this.formData.pageSize = this.tablePage.pageSize
      this.formData.startTimestamp = moment(this.formData.startTime).unix()
      this.formData.endTimestamp = moment(this.formData.endTime).unix()
      getReports(this.formData)
        .then((response) => {
          const list = response.data.list || []
          this.tableData = list.map((item) => {
            return {
              id: item.ID,
              reporterID: item.ReporterID,
              defendantID: item.DefendantID,
              reportType: formatReportType(item.ReportType),
              insertTime: moment.unix(item.InsertTime).format('YYYY-MM-DD HH:mm:ss')
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
    },
    handleDefendantClick(defendantID) {
      // 跳转到目标页面，并传递被举报者ID作为参数
      this.$router.push({
        path: '/report/detail', // 替换为实际目标页面路径
        query: { defendantID }
      });
    }
  }
}
</script>

<style>
.table-container {
  text-align: center;
}
</style>

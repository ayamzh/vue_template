<template>
  <div class="table-container">
    <vxe-form :data="formData" style="margin-left: 20px;margin-top: 20px;" @submit="submitEvent">
      <vxe-form-item title="封禁开始时间" field="startTime" span="4" :item-render="{}" title-overflow="ellipsis">
        <template #default="{ data }">
          <vxe-input v-model="data.startTime" type="datetime" placeholder="请选择日期" clearable />
        </template>
      </vxe-form-item>
      <vxe-form-item title="封禁结束时间" field="endTime" span="4" :item-render="{}" title-overflow="ellipsis">
        <template #default="{ data }">
          <vxe-input v-model="data.endTime" type="datetime" placeholder="请选择日期" clearable />
        </template>
      </vxe-form-item>
      <vxe-form-item title="开始时间" field="insertStartTime" span="4" :item-render="{}" title-overflow="ellipsis">
        <template #default="{ data }">
          <vxe-input v-model="data.startTime" type="datetime" placeholder="请选择日期" clearable />
        </template>
      </vxe-form-item>
      <vxe-form-item title="结束时间" field="insertEndTime" span="4" :item-render="{}" title-overflow="ellipsis">
        <template #default="{ data }">
          <vxe-input v-model="data.endTime" type="datetime" placeholder="请选择日期" clearable />
        </template>
      </vxe-form-item>
      <vxe-form-item title="用户ID" field="uid" :item-render="{}" span="4">
        <template #default="{ data }">
          <vxe-input v-model.number="data.uid" placeholder="请输入名称" />
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
      <vxe-column title="用户ID" width="200">
        <template #default="{ row }">
          <a href="javascript:void(0)" @click="handleDefendantClick(row.uid)" style="color: #409EFF; cursor: pointer;">
            {{ row.uid }}
          </a>
        </template>
      </vxe-column>
      <vxe-column field="banType" title="封禁类型" width="200" sortable />
      <vxe-column field="endTime" title="封禁结束日期" width="200" sortable />
      <vxe-column field="insertTime" title="操作时间" sortable />
    </vxe-table>

    <vxe-pager :loading="loading" :current-page="tablePage.currentPage" :page-size="tablePage.pageSize"
      :page-sizes="tablePage.pageSizes" :total="tablePage.totalResult"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']" @page-change="handlePageChange" />

  </div>
</template>

<script>
import moment from 'moment'
import { getBanList } from '@/api/report'
import { formatBanType } from '@/api/report'


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
        uid: 0,
        insertStartTime: null,
        insertEndTime: null,
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
      this.formData.uid = this.formData.uid
      this.formData.currentPage = this.tablePage.currentPage
      this.formData.pageSize = this.tablePage.pageSize
      this.formData.startTimestamp = moment(this.formData.startTime).unix()
      this.formData.endTimestamp = moment(this.formData.endTime).unix()
      this.formData.insertStartTimestamp = moment(this.formData.insertStartTime).unix()
      this.formData.insertEndTimestamp = moment(this.formData.insertEndTime).unix()
      getBanList(this.formData)
        .then((response) => {
          this.tableData = response.data.list.map((item) => {
            return {
              id: item.ID,
              uid: item.Uid,
              banType: formatBanType(item.BanType),
              insertTime: moment.unix(item.InsertTime).format('YYYY-MM-DD HH:mm:ss'),
              endTime: moment.unix(item.EndTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          this.tablePage.totalResult = response.data.totalResult
          this.loading = false
        })
        .catch(() => {
          console.log("22222222")
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
    handleDefendantClick(uid) {
      // 跳转到目标页面，并传递被举报者ID作为参数
      this.$router.push({
        path: '/report/detail', // 替换为实际目标页面路径
        query: { uid }
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

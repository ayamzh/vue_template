<template>
  <div class="app-container">
    <div>
      <el-form ref="formSearch" :inline="true" :model="formSearch" label-width="150px">
        <el-form-item label="查询账号">
          <el-input v-model.trim="formSearch.name" placeholder="please input passport" />
          <el-input v-model.trim="formSearch.themeID" placeholder="please input theme" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="searchLoading" type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.display_time }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getPlayer } from '@/api/player'
import VJsoneditor from 'v-jsoneditor'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      formSearch: {
        name: '',
        themeID: null
      },
      list: null,
      listLoading: false,
      searchLoading: false
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    onSearch() {
      this.searchLoading = true
      getPlayer(this.formSearch.name)
        .then((response) => {
          this.form = response.data
          this.searchLoading = false
        })
        .catch(() => {
          this.searchLoading = false
        })
    }
  }
}
</script>

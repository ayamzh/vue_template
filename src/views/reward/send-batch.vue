<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-button type="primary" icon="el-icon-download" @click="handleDownload">
          下载模板表格
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-upload
          ref="upload"
          class="upload-demo"
          action=""
          accept=".xls,.xlsx"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :auto-upload="false"
          :limit="1"
          :http-request="uploadFile"
        >
          <el-button slot="trigger" size="large" type="primary">选取发奖列表</el-button>
          <el-button
            style="margin-left: 20px;"
            size="large"
            type="success"
            @click="submitUpload"
          >
            上传到服务器
          </el-button>
          <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过1MB</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="records" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="100" />
          <el-table-column prop="name" label="文件名" />
          <el-table-column prop="adminName" label="操作者" />
          <el-table-column prop="isFinished" label="状态" width="100" />
          <el-table-column prop="errorNum" label="失败数" width="100" />
          <el-table-column prop="total" label="总数" width="100" />
          <el-table-column prop="created" label="创建时间" />
          <el-table-column prop="updated" label="修改时间" />
          <el-table-column label="下载" width="80">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-download" circle @click="downloadFile(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import moment from 'moment'
import { sendRewardBatch, getRecords } from '@/api/reward'
import { getToken, getAdminName } from '@/utils/auth'
export default {
  data() {
    return {
      records: [],
      fileID: null,
      fileList: [],
      cli: null,
      percentage: 0
    }
  },
  sse: {
    cleanup: true
  },
  created() {
    this.fetchAll()
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    close() {
      if (this.cli !== null) {
        this.cli.disconnect()
        this.cli = null
      }
    },
    handleDownload() {
      console.log('handler')
      import('@/vendor/Export2Excel').then(excel => {
        console.log('Export2Excel')
        excel.export_json_to_excel({
          header: ['FpID', '通用奖励，多个奖励用逗号分割', '状态 ok|ng|doing'], // 表头 必填
          data: [
            ['zhongzhong', '1_0_1000_0,1_0_2000_0'],
            ['hy02', '1_0_1000_0,1_0_2000_0']
          ],
          filename: '批量奖励模板', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    uploadFile(params) {
      console.log('-------uploadFile---------')
      console.log(params.file)
      const file = params.file
      if (!file) {
        return
      }
      // const eventSource = new EventSourcePolyfill('/your-event-source-endpoint')
      const formData = new FormData()
      formData.append('file', file)
      sendRewardBatch(formData)
        .then((response) => {
          this.fileID = response.data.fileID
          this.initSSE()
          this.$message({
            showClose: true,
            message: '提交成功 处理中',
            type: 'success'
          })
        })
        .catch(() => {
        })
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })

      return false
    },
    initSSE() {
      this.cli = this.$sse.create(process.env.VUE_APP_BASE_API +
      `/sse/event?type=reward&fileID=${this.fileID}`, {
        format: 'json',
        polyfill: true,
        polyfillOptions: {
          headers: {
            'X-ID': getAdminName(),
            'X-Token': getToken()
          }
        },
        forcePolyfill: true,
        withCredentials: true
      })

      this.cli.on('message', (msg) => {
        console.info('Message:', msg)
        const obj = JSON.parse(msg)
        this.percentage = Math.ceil(obj.done * 100 / obj.total)
        if (obj.total === obj.done) {
          this.$message({
            showClose: true,
            message: '处理完成',
            type: 'success'
          })
          this.fetchAll()
          this.close()
        }
      })
        .on('error', (err) => {
          console.error('Failed to parse or lost connection:', err)
          this.close()
        })
        .on('finish', (data) => {
          console.log('finish:', data)
          this.close()
        })
        .connect()
        .catch((err) => {
          console.error('Failed make initial connection:', err)
          this.close()
        })
    },
    fetchAll() {
      getRecords()
        .then((response) => {
          this.records = response.data.list.map((item) => {
            return {
              id: item.id,
              name: item.name,
              adminName: item.adminName,
              errorNum: item.errorNum,
              total: item.total,
              isFinished: item.isFinished === true ? '完成' : '未完成',
              created: moment.unix(item.created).format('YYYY-MM-DD HH:mm:ss'),
              updated: moment.unix(item.updated).format('YYYY-MM-DD HH:mm:ss')
            }
          })
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '获取失败',
            type: 'warning'
          })
        })
    },
    downloadFile(row) {
      const apiUrl = process.env.VUE_APP_BASE_API +
      `/reward/download?fileID=${row.id}`

      // 创建一个虚拟的 <a> 标签
      const link = document.createElement('a')
      link.href = apiUrl // 拼接文件下载接口地址和参数
      link.target = '_blank' // 在新标签页中打开链接
      link.download = row.name // 设置下载文件名

      // 触发点击事件
      link.click()
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
.el-row {
  margin-bottom: 50px;
}
.el-col {
  border-radius: 4px;
}
</style>

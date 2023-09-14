<template>
  <div class="table-container">
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="模拟template">
        <el-select v-model.number="form.simID" placeholder="please select type" type="number">
          <el-option v-for="item in simOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户数量">
        <el-input v-model.number="form.playerCount" type="number" />
      </el-form-item>
      <el-form-item label="单个用户Spin次数">
        <el-input v-model.number="form.maxSpinTimes" type="number" />
      </el-form-item>
      <el-form-item label="使用服务器CPU数量">
        <el-input v-model.number="form.numProcess" type="number" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit">开始模拟</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-popconfirm title="确定开始模拟吗" @onConfirm="onSubmit">
          <el-button slot="reference" :loading="loading" type="primary">开始模拟</el-button>
        </el-popconfirm>
      </el-form-item> -->
    </el-form>

    <template v-if="showProcess">
      <el-divider />
      <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" />
    </template>
    <el-divider />

    <el-row>
      <el-col :span="24">
        <el-collapse accordion>
          <el-collapse-item v-for="item in simList" :key="item.id">
            <template slot="title">
              <div class="title-container">
                <span><b>ID：</b>{{ item.id.replace(" ", "&nbsp;") }}</span>
                <span><b>模板：</b>{{ item.simID }}</span>
                <span><b>人数：</b>{{ item.times }}</span>
                <span><b>Spin次数：</b>{{ item.spinTimes }}</span>
                <span><b>进程数：</b>{{ item.numProcess }}</span>
                <span><b>耗时：</b>{{ item.cost }}</span>
                <span><b>状态：</b><b :style="{ color: item.color}">{{ item.status }}</b></span>
                <span><b>创建时间：</b>{{ item.created }}</span>
                <!-- <span><b>完成时间：</b>{{ item.updated }}</span> -->
              </div>
            </template>
            <el-descriptions class="margin-top" title="基本信息" :column="4" :size="size" border>
              <template slot="extra">
                <el-button type="primary" size="big">删除</el-button>
              </template>
              <el-descriptions-item>
                <template slot="label">
                  最小破产等级
                </template>
                {{ item.result.LowestBankruptcyLevel }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  最小破产等级用户占比
                </template>
                {{ item.result.LowestBankruptcyLevelPercent }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  最大破产等级
                </template>
                {{ item.result.HighestBankruptcyLevel }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  最小破产等级用户占比
                </template>
                {{ item.result.HighestBankruptcyLevelPercent }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  模拟用户数
                </template>
                {{ item.result.PlayerCount }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  限制最大Spin次数
                </template>
                {{ item.result.MaxSpinTimesLimit }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  达成最大Spin用户数
                </template>
                {{ item.result.FinishSpinPlayerCount }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  用户真实最大Spin次数
                </template>
                {{ item.result.RealMaxSpinTimes }}
              </el-descriptions-item>
            </el-descriptions>
          </el-collapse-item>
          <el-collapse-item title="反馈 Feedback">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { rtpTemplates, rtpSimulator, rtpReports } from '@/api/tools'
import { getToken, getAdminName } from '@/utils/auth'
import { numberToPaddedString } from '@/utils/index.js'
import moment from 'moment'
// import echarts from 'echarts'
export default {
  data() {
    return {
      form: {
        simID: null,
        playerCount: null,
        maxSpinTimes: null,
        numProcess: 10
      },
      simOptions: [

      ],
      loading: false,
      showProcess: false,
      reportID: 0,
      cli: null,
      percentage: 0,
      size: null,
      // 列表页用到的
      simList: [],
      simTotal: 0 // 总数
    }
  },
  computed: {
    noMore() {
      return this.count >= 20
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  created() {
    rtpTemplates()
      .then((response) => {
        this.simOptions = response.data.options
      })
      .catch(() => {
        this.$message({
          showClose: true,
          message: '获取模拟配置文件失败',
          type: 'warning'
        })
      })
    rtpReports()
      .then((response) => {
        console.log(response.data)
        this.simTotal = response.data.totalResult
        this.simList = response.data.list.map((item) => {
          let status, color
          switch (item.status) {
            case 0:
              status = '创建'
              color = 'black'
              break
            case 1:
              status = '成功'
              color = 'green'
              break
            case 2:
              status = '异常'
              color = 'red'
              break
          }

          console.log(item.result)
          return {
            id: numberToPaddedString(item.id, 10),
            simID: numberToPaddedString(item.simID, 10),
            times: numberToPaddedString(item.times, 10),
            spinTimes: numberToPaddedString(item.spinTimes, 10),
            numProcess: numberToPaddedString(item.numProcess, 2),
            adminName: item.adminName,
            status: status,
            color: color,
            cost: this.changeSecondsToHours(item.updated - item.created),
            created: moment.unix(item.created).format('YYYY-MM-DD HH:mm:ss'),
            updated: moment.unix(item.updated).format('YYYY-MM-DD HH:mm:ss'),
            result: item.result
          }
        })
      })
      .catch(() => {
        this.$message({
          showClose: true,
          message: '获取历史记录失败',
          type: 'warning'
        })
      })

    return
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    onSubmit() {
      console.log('shishi')
      this.reportID = 0
      this.loading = true
      if (this.form.simID <= 0 || this.form === null) {
        this.$message({
          showClose: true,
          message: '请选择模板',
          type: 'warning'
        })
        this.loading = false
        return
      }
      if (this.form.playerCount <= 0 || this.form === null) {
        this.$message({
          showClose: true,
          message: '用户数必须大于0',
          type: 'warning'
        })
        this.loading = false
        return
      }
      if (this.form.numProcess <= 0 || this.form === null) {
        this.$message({
          showClose: true,
          message: 'CPU数量必须大于0',
          type: 'warning'
        })
        this.loading = false
        return
      }

      rtpSimulator(this.form)
        .then((response) => {
          this.showProcess = true
          this.reportID = response.data.reportID
          this.percentage = 0
          this.initSSE()
        })
        .catch(() => {
          this.loading = false
        })
    },
    initSSE() {
      this.cli = this.$sse.create({
        url: process.env.VUE_APP_BASE_API +
      `/sse/event?type=rtpSimulator&reportID=${this.reportID}`,
        // format: 'json',
        polyfill: true,
        polyfillOptions: {
          headers: {
            'X-ID': getAdminName(),
            'X-Token': getToken()
          }
        },
        forcePolyfill: true
        // withCredentials: true
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
          // this.fetchAll()
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
    close() {
      if (this.cli !== null) {
        this.cli.disconnect()
        this.cli = null
        this.loading = false
      }
    },
    changeSecondsToHours(value) {
      if (value > 86400) {
        return '大于1天'
      }
      const time = moment.duration(value, 'seconds')
      const hours = time.hours()
      const minutes = time.minutes()
      const seconds = time.seconds()

      const obj = moment({ h: hours, m: minutes, s: seconds })
      if (hours > 0) {
        return obj.format('HH小时mm分ss秒')
      }

      if (minutes > 0) {
        return obj.format('mm分ss秒')
      }

      if (seconds > 0) {
        return obj.format('ss秒')
      }
    }
  }
}
</script>

<style>
.table-container {
  text-align: left;
}

.el-input {
  width: 300px;
}

/* 可以根据需要自定义样式 */
.title-container span {
  margin-left: 50px; /* 可以根据需要自定义左右间距 */
}

form {
  margin-top: 20px;
  margin-left:400px;
}
</style>

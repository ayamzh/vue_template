<template>
  <div class="table-container">

    <div id="mazheng" />

    <el-form ref="form" class="myForm" :model="form" label-width="150px">
      <el-form-item label="模拟template">
        <el-select v-model.number="form.simID" style="width: 300px" placeholder="please select type" type="number">
          <el-option v-for="item in simOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户数量">
        <el-input v-model.number="form.playerCount" type="number" />
      </el-form-item>
      <el-form-item label="单个用户Spin次数">
        <el-input v-model.number="form.maxSpinTimes" type="number" />
      </el-form-item>
      <!-- <el-form-item label="使用服务器CPU数量">
        <el-input v-model.number="form.numProcess" :placeholder="cpuPlaceholder" type="number" />
      </el-form-item> -->

      <el-form-item label="使用服务器CPU数量">
        <template>
          <el-slider
            v-model="form.numProcess"
            :min="1"
            :max="cpuNum"
            style="width: 460px"
            show-input
          />
        </template>
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
        <el-collapse
          v-model="activeNames"
          v-infinite-scroll="load"
          infinite-scroll-disabled="disabled"
          accordion
          style="overflow:auto"
          @change="handleChange"
        >
          <el-collapse-item v-for="item in simList" :key="item.id" class="myCollapse" :name="item.id">
            <template slot="title">
              <div class="title-container">
                <span><b>ID：</b>{{ item.id }}</span>
                <span><b>模板：</b>{{ item.simID }}</span>
                <span><b>人数：</b>{{ item.times }}</span>
                <span><b>Spin次数：</b>{{ item.spinTimes }}</span>
                <span><b>进程数：</b>{{ item.numProcess }}</span>
                <span><b>耗时：</b>{{ item.cost }}</span>
                <span><b>状态：</b><b :style="{ color: item.color}">{{ item.status }}</b></span>
                <span><b>创建时间：</b>{{ item.created }}</span>
              </div>
            </template>
            <div style="text-align:center">
              <el-button style="margin-top:20px" type="danger" size="medium" @click="deleteReport(item.id)">删除记录</el-button>
            </div>
            <div class="download">
              <a
                v-for="(file,index) in item.result.Files"
                :key="index"
                target="_black"
                :href="[apiUrl + '/tools/report/download?id=' + item.id + '&index=' + index]"
              ><h3>{{ file.replace('./result/', '') }} <span class="el-icon-download" /></h3></a>
            </div>
            <el-descriptions style="margin-top:20px" :column="4" :size="size" border>
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
            <el-divider />
            <div :id="'bankruptcyPercent' + item.id" :ref="'bankruptcyPercent' + item.id" />
          </el-collapse-item>
        </el-collapse>
        <p v-if="loading" style="text-align: center">加载中...</p>
        <p v-if="noMore" style="text-align: center">没有更多了</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { rtpTemplates, rtpSimulator, rtpReports, deleteReport } from '@/api/tools'
import { getToken, getAdminName } from '@/utils/auth'
import moment from 'moment'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      form: {
        simID: null,
        playerCount: null,
        maxSpinTimes: null,
        numProcess: null
      },
      simOptions: [

      ],
      cpuNum: 0,
      loading: false,
      showProcess: false,
      reportID: 0,
      cli: null,
      percentage: 0,
      size: null,
      // 列表页用到的
      activeNames: '',
      simList: [],
      curPage: 0,
      pageSize: 10,
      totalPage: 0,
      listLoading: false,
      // 打开的模拟图表
      openItem: 0,
      chartList: []
    }
  },
  computed: {
    noMore() {
      return this.curPage > 0 && this.curPage >= this.totalPage
    },
    disabled() {
      return this.listLoading || this.noMore
    },
    cpuPlaceholder() {
      return '建议不超过' + this.cpuNum
    },
    apiUrl() {
      return process.env.VUE_APP_BASE_API
    }
  },
  watch: {
    reportID: function(newVal, oldVal) {
      if (newVal > 0 && newVal !== oldVal) {
        this.initSSE()
        this.showProcess = true
        this.loading = true
      }
    }
  },
  created() {
    rtpTemplates()
      .then((response) => {
        this.simOptions = response.data.options
        this.cpuNum = response.data.cpuNum
      })
      .catch(() => {
        this.$message({
          showClose: true,
          message: '获取模拟配置文件失败',
          type: 'warning'
        })
      })

    this.fetchAll(0)
    return
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    // 获取列表数据
    fetchAll(page) {
      this.listLoading = true
      // 页数没变化不重复拉取
      if (page > 0 && this.curPage === page) {
        this.listLoading = false
        return
      }
      // 超过上限不能在拉取
      if (page > this.totalPage) {
        this.listLoading = false
        return
      }

      rtpReports(page, this.pageSize)
        .then((response) => {
          this.reportID = response.data.reportID
          this.curPage = page > 0 ? page : 1
          this.totalPage = Math.ceil(response.data.totalResult / this.pageSize)
          console.log(response.data.totalResult)
          const tmpList = response.data.list.map((item) => {
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
              id: item.id,
              simID: item.simID,
              times: item.times,
              spinTimes: item.spinTimes,
              numProcess: item.numProcess,
              adminName: item.adminName,
              status: status,
              color: color,
              cost: this.changeSecondsToHours(item.updated - item.created),
              created: moment.unix(item.created).format('YYYY-MM-DD HH:mm:ss'),
              updated: moment.unix(item.updated).format('YYYY-MM-DD HH:mm:ss'),
              result: item.result
            }
          })

          // 拉取第一页重置
          if (this.curPage === 1) {
            this.simList = tmpList
          } else {
            this.simList.push(...tmpList)
          }
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '获取历史记录失败',
            type: 'warning'
          })
        })

      this.listLoading = false
    },
    //
    deleteReport(reportID) {
      deleteReport(reportID)
        .then((response) => {
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.fetchAll(0)
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '删除失败',
            type: 'warning'
          })
        })
    },
    // 开始模拟
    onSubmit() {
      if (this.reportID > 0) {
        this.$message({
          showClose: true,
          message: '有进行中的任务',
          type: 'warning'
        })
        this.loading = false
        return
      }

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
        })
        .catch(() => {
          this.loading = false
        })
    },
    // -------------sse相关
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
          this.fetchAll(0)
          this.close()
        }
      })
        .on('error', (err) => {
          console.error('Failed to parse or lost connection:', err)
          this.close()
        })
        .on('finish', (data) => {
          console.log('finish:', data)
          this.percentage = 100
          this.fetchAll(0)
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
    // ----------------通用方法
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
    },
    // -----------------------图表相关
    load() {
      if (this.curPage >= this.totalPage) {
        return
      }
      this.fetchAll(this.curPage + 1)
    },
    // 下拉开关
    handleChange(val) {
      if (val !== this.openItem) {
        for (const obj of this.chartList) {
          obj.dispose()
        }
        this.chartList = []
      }

      this.openItem = val
      let report = null

      // 找寻目标对象
      if (val > 0) {
        this.simList.forEach((obj) => {
          if (obj.id === val) {
            report = obj
            return
          }
        })
      }

      if (report === null) {
        return
      }

      // 获取屏幕宽度用于设置charts大小
      const titleContainers = document.querySelectorAll('.myCollapse')
      if (titleContainers.length > 0) {
        this.width = titleContainers[0].offsetWidth
      }

      if (report.result.BankruptcyPercent !== null && report.result.BankruptcyPercent.length > 0) {
        this.bankruptcyPercent(report.id, report.result.BankruptcyPercent)
      }
    },
    // [
    //     {
    //         "MinLevel": 14,
    //         "MaxLevel": 14,
    //         "Percent": 0.25,
    //         "PlayerNum": 1
    //     }
    // ]
    bankruptcyPercent(reportID, data) {
      const divDom = document.getElementById('bankruptcyPercent' + reportID)

      const nameArray = data.map((obj) => {
        if (obj.MinLevel === obj.MaxLevel) {
          return obj.MinLevel
        }
        return obj.MinLevel + '-' + obj.MaxLevel
      })

      const valueArray = data.map(obj => obj.Percent * 100)

      const width = this.width > 0 ? this.width / 2 - 100 : 600
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(divDom, null, {
        width: width,
        height: width * 3 / 4
      })
      // 绘制图表
      myChart.setOption({
        title: {
          text: '破产等级分布'
        },
        tooltip: {},
        xAxis: {
          data: nameArray
        },
        yAxis: {},
        series: [
          {
            name: '占比',
            type: 'bar',
            data: valueArray
          }
        ]
      })
      this.chartList.push(myChart)
      // end
    }
  }
}
</script>

<style scoped>
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

.myForm {
  margin-top: 20px;
  margin-left: 400px;
}

/* 设置 div 标签样式 */
.download {
  margin-bottom: 20px; /* 设置间距 */
}

/* 设置 a 标签样式 */
.download a {
  display: block;
  margin-top : 20px;
  margin-left: 20px; /* 设置 a 标签间距 */
}

</style>

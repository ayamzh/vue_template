<template>
  <div class="app-container">
    <el-form ref="formSearch" :inline="true" :model="formSearch" label-width="150px">
      <el-form-item label="查询账号">
        <el-input v-model.trim="formSearch.name" placeholder="please input passport" @change="onSearch" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="searchLoading" type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-divider />
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="FP账号">
        <el-input v-model="form.fpID" :disabled="true" />
      </el-form-item>
      <el-form-item label="Uid">
        <el-input v-model.number="form.uid" :disabled="true" required />
      </el-form-item>
      <el-form-item label="经验值">
        <el-input v-model.number="form.exp" type="number" placeholder="等级经验只需修改任意一项" />
      </el-form-item>
      <el-form-item label="等级">
        <el-input v-model.number="form.level" type="number" placeholder="等级经验只需修改任意一项" />
      </el-form-item>
      <el-form-item label="金币">
        <el-input v-model.number="form.coin" type="number" />
      </el-form-item>
      <el-form-item label="钻石">
        <el-input v-model.number="form.gem" type="number" />
      </el-form-item>
      <el-form-item label="累计登录次数">
        <el-input v-model.number="form.loginCount" type="number" />
      </el-form-item>
      <el-form-item label="最近一次登录时间">
        <el-date-picker v-model="form.loginTime" type="datetime" placeholder="Pick a date" style="width: 100%" />
      </el-form-item>
      <el-form-item label="用户自身时间">
        <el-date-picker v-model="form.systemTime" type="datetime" placeholder="只读属性" style="width: 100%"
          :disabled="true" />
      </el-form-item>
      <el-form-item label="时间偏移量">
        <el-input v-model="form.timeOffset" type="text" placeholder="例如 1d3h4m5s 或 -1d3h4m5s" />
      </el-form-item>
      <el-form-item label="PowerID">
        <el-input v-model.number="form.powerID" type="number" placeholder="powerid" />
      </el-form-item>
      <el-form-item label="是否付费用户">
        <el-switch v-model="form.paidUser" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="客户端版本号">
        <el-input v-model="form.clientVer" placeholder="请输入客户端版本号" />
      </el-form-item>
      <el-form-item label="最后一次下注倍数">
        <el-input v-model.number="form.lastBetMultiplier" type="number" placeholder="请输入最后一次下注倍数" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" @click="onSubmit">提交</el-button>
        <el-button :loading="deleting" type="danger" @click="onDelete">删除用户</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from "moment";
import { editPlayer, getPlayer, deletePlayer } from "@/api/player";
export default {
  data() {
    return {
      // localTimeOffset: null, // 本地和服务器时间差值
      formSearch: {
        name: "",
      },
      deleting: null,
      form: {
        fpID: "",
        uid: null,
        exp: null,
        level: null,
        coin: null,
        gem: null,
        loginCount: null,
        loginTime: null,
        loginTimestamp: null,
        timeOffset: null,
        timeOffsetInt: 0, // 转换后的整数（秒）
        systemTime: null,
        powerID: null,
        paidUser: false, // 付费用户
        clientVer: "",   // 客户端版本号
        lastBetMultiplier: 0 // 最后一次下注倍数
      },
      loading: false,
      searchLoading: false,
    };
  },
  watch: {
    "form.loginTime": function (val) {
      this.form.loginTimestamp = moment(val).unix();
    },
    "form.timeOffset": function (val) {
      this.updateSystemTime();
    }
  },
  methods: {
    onSubmit() {
      this.loading = true;
      if (this.form.name === "") {
        this.$message({
          showClose: true,
          message: "需要填写用户名",
          type: "warning",
        });
        this.loading = false;
        return;
      }

      // 在提交时确保 timeOffsetInt 是最新的
      this.updateTimeOffsetInt(); // 更新 timeOffsetInt

      editPlayer(this.form)
        .then((response) => {
          response.data.loginTime = moment(response.data.loginTimestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
          this.updateFormWithServerData(response.data); // 更新 form 数据
          this.loading = false;
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    onSearch() {
      this.searchLoading = true;
      getPlayer(this.formSearch.name)
        .then((response) => {
          response.data.loginTime = moment(response.data.loginTimestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
          this.updateFormWithServerData(response.data); // 更新 form 数据并计算 timeOffsetInt
          this.searchLoading = false;
        })
        .catch(() => {
          this.searchLoading = false;
        });
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    onDelete() {
      this.$confirm("确定要删除该用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleting = true;
          deletePlayer(this.form.uid)
            .then(() => {
              this.$message({
                type: "success",
                message: "用户删除成功!",
              });
              this.form = {
                fpID: "",
                uid: null,
                exp: null,
                level: null,
                coin: null,
                gem: null,
                loginCount: null,
                loginTime: null,
                loginTimestamp: null,
                timeOffset: "",
                timeOffsetInt: 0, // 重置为 0
                systemTime: null,
                powerID: null,
              };
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败!",
              });
            })
            .finally(() => {
              this.deleting = false;
            });
        })
        .catch(() => {
          // 用户点击取消时的处理
        });
    },
    // 编辑时间偏移量时，更新 systemTime 和 timeOffsetInt
    updateSystemTime() {
      this.updateTimeOffsetInt(); // 确保每次编辑时都更新
    },
    // 处理读取数据时更新 timeOffsetInt
    updateFormWithServerData(data) {
      // 更新 form 数据时，确保转换 timeOffset
      this.form = data;
      this.updateTimeOffsetInt();
    },

    // 更新 timeOffsetInt（秒数）的方法
    updateTimeOffsetInt() {
      const now = moment();
      let offsetInSeconds = 0;

      // 解析时间偏移量字符串（支持 1d2h3m4s 格式）
      const regex = /([+-]?\d+)(d|h|m|s)/g;
      let match;

      while ((match = regex.exec(this.form.timeOffset)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];

        if (unit === 'd') {
          offsetInSeconds += value * 86400; // 1 day = 86400 seconds
        } else if (unit === 'h') {
          offsetInSeconds += value * 3600; // 1 hour = 3600 seconds
        } else if (unit === 'm') {
          offsetInSeconds += value * 60; // 1 minute = 60 seconds
        } else if (unit === 's') {
          offsetInSeconds += value; // 1 second = 1 second
        }
      }



      // 更新 systemTime 和 timeOffsetInt
      const newTime = now.add(offsetInSeconds, 'seconds');
      this.form.systemTime = newTime.format('YYYY-MM-DD HH:mm:ss'); // 更新 systemTime
      this.form.timeOffsetInt = offsetInSeconds; // 更新 timeOffsetInt

      console.log(newTime.format('YYYY-MM-DD HH:mm:ss'));
      console.log(offsetInSeconds);
    }
  },
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

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
        <el-date-picker v-model="form.systemTime" type="datetime" placeholder="设置当前时间" style="width: 100%" />
      </el-form-item>
      <el-form-item label="时间偏移量">
        <el-input v-model.number="form.timeOffset" type="number" placeholder="正数表示从当前时间往后推" />
      </el-form-item>
      <el-form-item label="PowerID">
        <el-input v-model.number="form.powerID" type="number" placeholder="powerid" />
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
        timeOffset: 0,
        systemTime: null,
        systemTimestamp: null,
        powerID: null
      },
      loading: false,
      searchLoading: false,
    };
  },
  watch: {
    "form.loginTime": function (val) {
      this.form.loginTimestamp = moment(val).unix();
    },
    "form.systemTime": function (val) {
      this.form.systemTimestamp = moment(val).unix();
    },
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

      editPlayer(this.form)
        .then((response) => {
          response.data.loginTime = moment(
            response.data.loginTimestamp * 1000
          ).format("YYYY-MM-DD HH:mm:ss");
          this.form = response.data;
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
          response.data.loginTime = moment(
            response.data.loginTimestamp * 1000
          ).format("YYYY-MM-DD HH:mm:ss")
          this.form = response.data;
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
          // 调用删除接口（假设有 deletePlayer 方法）
          deletePlayer(this.form.uid)
            .then(() => {
              this.$message({
                type: "success",
                message: "用户删除成功!",
              });
              // 清空表单
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
                timeOffset: null,
                systemTime: null,
                systemTimestamp: null,
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
    }
  },
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

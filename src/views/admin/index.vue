<template>
  <div class="table-container">
    <el-table :data="tableDataComputed" border style="width: 100%">
      <el-table-column fixed prop="id" label="ID" width="200">
      </el-table-column>
      <el-table-column prop="name" label="账号" width="200"> </el-table-column>
      <el-table-column prop="enable" label="是否可用" width="200">
      </el-table-column>
      <el-table-column prop="userGroup" label="所属用户组" width="200">
      </el-table-column>
      <el-table-column prop="created" label="创建时间" width="200">
      </el-table-column>
      <el-table-column prop="updated" label="修改时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
            >查看</el-button
          >
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
import { userList } from "@/api/user";

export default {
  created() {
    userList()
      .then((response) => {
        this.tableData = response.data.list;
      })
      .catch(() => {
        this.$message("获取用户列表失败");
      });
    return;
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
  },
  computed: {
    tableDataComputed() {
      return this.tableData.map((item) => {
        return {
          id: item.id,
          name: item.name,
          userGroup: item.userGroup,
          enable: item.enable === true ? "是" : "否",
          created: moment.unix(item.created).format("YYYY-MM-DD HH:mm:ss"),
          updated: moment.unix(item.updated).format("YYYY-MM-DD HH:mm:ss"),
        };
      });
    },
  },

  data() {
    return {
      tableData: [],
    };
  },
};
</script>

<style>
.table-container {
  text-align: center;
}
</style>

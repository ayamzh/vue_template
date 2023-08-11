<template>
  <div class="exercise">
    <div class="code-editor">
      <codemirror
        v-model="codeSnippets"
        :options="cmOptions"
        style="width: 80%; height: 80%; border: 1px solid #000;"
      />
    </div>
    <div class="json-editor">
      <codemirror
        v-model="jsonSnippets"
        :options="jsonCmOptions"
        style="width: 80%; height: 80%; border: 1px solid #000;"
      />
    </div>
    <div class="submit-button">
      <el-row>
        <el-button type="primary" :loading="loading" style="width: 150px; height: 60px;" @click="test">测试</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
// 编辑器代码格式
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/javascript/javascript.js' // 添加 JSON 模式
import 'codemirror/addon/display/autorefresh'

import { getRideConfig, testRideRule } from '@/api/tools'

export default {
  data() {
    return {
      codeSnippets: '',
      jsonSnippets: '',
      cmOptions: {
        autorefresh: true,
        tabSize: 4,
        mode: 'text/x-c++src',
        theme: 'default',
        lineNumbers: true,
        viewportMargin: Infinity, // 处理高度自适应时搭配使用
        highlightDifferences: true,
        autofocus: true,
        indentUnit: 2,
        smartIndent: true,
        readOnly: false, // 只读
        showCursorWhenSelecting: true,
        // styleActiveLine: true, // 选中行高亮
        // matchBrackets: true, // 匹配括号
        // lineWrapping: true, // 自动换行
        firstLineNumber: 1
      },
      jsonCmOptions: {
        autorefresh: true,
        tabSize: 2, // 为 JSON 使用 2 个空格缩进
        mode: 'application/json', // 使用 JSON 模式
        theme: 'default',
        lineNumbers: true,
        viewportMargin: Infinity,
        readOnly: false,
        showCursorWhenSelecting: true,
        firstLineNumber: 1
      },
      loading: false
    }
  },
  created() {
    getRideConfig()
      .then((response) => {
        this.codeSnippets = response.data.codeSnippets
        this.jsonSnippets = response.data.jsonSnippets
      })
      .catch(() => {
        this.$message('获取基础配置失败')
      })
    return
  },
  methods: {
    test() {
      this.loading = true
      if (this.codeSnippets === '') {
        this.$message('no data')
        this.loading = false
        return
      }

      testRideRule(this.codeSnippets, this.jsonSnippets)
        .then((response) => {
          this.loading = false
          const result = '<h1>rideID = ' + response.data.rideID + '<br><br>  rtpLevel = ' + response.data.rtpLevel + '</h1>'
          this.$alert(result, '结果', { center: true, dangerouslyUseHTMLString: true })
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.CodeMirror {
  font-family: monospace;
  font-size: 20px;
  direction: ltr;
  height: 100%;
  width: 100%;
}

.code-editor,
.json-editor {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;
  width: 100%; /* 使宽度占满整个父容器 */
  border: 1px solid #ccc;
  margin: auto; /* 居中 */
}

.submit-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 其他样式保持不变 */
</style>

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
  </div>
</template>

<script>
// 编辑器代码格式
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/javascript/javascript.js' // 添加 JSON 模式
import 'codemirror/addon/display/autorefresh'

export default {
  data() {
    return {
      codeSnippets: `// please in put your code
// for example
const a = 10
if a === 10 {
  console.log("a is ten")
}
`,
      jsonSnippets: `{
    "OutputRideID": 0,             // 新RideID
    "OutputRtpLevel": 0,           // RTPLEVEL
    "InputRideID": 0,              // 旧RideID
    "Recommend": 0,                // 机台推荐度
    "EntryTimes": 0,               // 进入机台次数
    "Seq": 0,                      // 进入机台的顺序
    "Level": 0,                    // 用户等级
    "SpinTimes": 0,                // spin总次数
    "TotalRtp": 0.0,               // 总赢奖倍率
    "RegisterDay": 0,              // 注册天數
    "LastSpinTimes": 0,            // 上一个机台SPIN总次数
    "LastRtp": 0.0,                // 上一个机台总赢奖倍率
    "RemainNum": 0,                // 玩家进入机台前金币总额按照上个机台最后一次下注计算当前机台可下注次数
    "RideSegmentaion": 0,          // 用户分组
    "ThemeID": 0,                  // 本次机台ID
    "TodaySeq": 0,                 // 当日次序
    "RtpLowSpinTimes": 0,          // 93rtp的spin次数
    "RtpLowEntryTimes": 0,         // 93rtp的进入次数
    "Coin": 0,                     // 93rtp的金币余额
    "RechargeMoney": 0,            // 累计充值美分
    "ThemeType": 0,                // 机台类型
    "ABTag": "",                   // 用户abtag标签 a or b
    "LastRideTime": {},            // 上一次进入机台时间
    "Now": 0,                      //
    "AvgBet": 0                    // 平均下注
}
`,
      cmOptions: {
        autorefresh: true,
        tabSize: 4,
        mode: 'text/x-c++src',
        theme: 'default',
        line: true,
        viewportMargin: Infinity, // 处理高度自适应时搭配使用
        highlightDifferences: true,
        autofocus: true,
        indentUnit: 2,
        smartIndent: true,
        readOnly: false, // 只读
        showCursorWhenSelecting: true,
        firstLineNumber: 1
      },
      jsonCmOptions: {
        autorefresh: true,
        tabSize: 2, // 为 JSON 使用 2 个空格缩进
        mode: 'application/json', // 使用 JSON 模式
        theme: 'default',
        line: true,
        viewportMargin: Infinity,
        readOnly: false,
        showCursorWhenSelecting: true,
        firstLineNumber: 1
      }
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
  height: 60vh;
  width: 100%; /* 使宽度占满整个父容器 */
  border: 1px solid #ccc;
  margin: auto; /* 居中 */
}

/* 其他样式保持不变 */
</style>

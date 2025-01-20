#!/bin/bash

# 获取命令行参数 (env)
read -p "请输入环境（env）: " env

# 删除 env.zip 文件
echo "正在删除 ${env}.zip 文件..."
rm -f "${env}.zip"

# 执行 npm run build:env，根据用户输入的 env 执行
echo "正在执行 npm run build:${env}..."
npm run build:"${env}"

# 检查 dist 文件夹是否存在
if [ ! -d "dist" ]; then
  echo "错误: dist 文件夹不存在，构建失败!"
  exit 1
fi

# 压缩 dist 文件夹为 env.zip
echo "正在压缩 dist 文件夹为 ${env}.zip..."
tar -czf "${env}.zip" dist

# 提示脚本执行完成
echo "脚本执行完成！${env}.zip 已经生成。"
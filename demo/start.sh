#!/bin/bash

echo "================================================"
echo "表单导入系统 - 启动脚本"
echo "================================================"
echo ""

cd "$(dirname "$0")"

echo "[1/2] 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "依赖安装失败！"
        exit 1
    fi
else
    echo "依赖已安装"
fi

echo ""
echo "[2/2] 启动开发服务器..."
echo ""
echo "访问地址: http://localhost:3000"
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev

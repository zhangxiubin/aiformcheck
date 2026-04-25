@echo off
echo ================================================
echo 表单导入系统 - 启动脚本
echo ================================================
echo.

cd /d "%~dp0"

echo [1/2] 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo 依赖安装失败！
        pause
        exit /b 1
    )
) else (
    echo 依赖已安装
)

echo.
echo [2/2] 启动开发服务器...
echo.
echo 访问地址: http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev

pause

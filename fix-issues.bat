@echo off
REM 微信小程序签到管理系统 - Windows 快速修复脚本

echo.
echo 🔧 开始修复代码问题...
echo.

REM 1. 生成新的 JWT_SECRET
echo 📦 1. 生成新的 JWT_SECRET
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))" > temp_env.txt
set /p NEW_SECRET=<temp_env.txt
del temp_env.txt
echo ✅ 已生成新的 JWT_SECRET
echo.

REM 2. 更新 .env 文件
echo 📦 2. 更新 .env 文件
cd server

REM 备份原文件
if exist .env copy .env .env.backup

REM 读取 .env 文件并更新
powershell -Command "(Get-Content .env) -replace 'JWT_SECRET=.*','%NEW_SECRET%' | Set-Content .env"
echo ✅ 已更新 JWT_SECRET

echo.
echo 📦 3. 检查微信配置
findstr /C:"WECHAT_APP_ID=wx0000000000000000" .env >nul
if %errorlevel% equ 0 (
    echo ⚠️  警告：WECHAT_APP_ID 使用默认值，请手动更新
) else (
    echo ✅ WECHAT_APP_ID 已配置
)

findstr /C:"WECHAT_APP_SECRET=your_wechat_app_secret" .env >nul
if %errorlevel% equ 0 (
    echo ⚠️  警告：WECHAT_APP_SECRET 使用默认值，请手动更新
) else (
    echo ✅ WECHAT_APP_SECRET 已配置
)

echo.
echo 📦 4. 小程序配置提示
echo ⚠️  请手动更新 miniprogram/app.js 中的 baseUrl:
echo    baseUrl: 'https://your-railway-url.up.railway.app'
echo.

echo ✅ 修复完成！
echo.
echo 📋 下一步操作:
echo    1. 编辑 server\.env 文件，填入真实的微信 AppID 和 AppSecret
echo    2. 更新 miniprogram\app.js 中的 baseUrl 为 Railway 地址
echo    3. 推送代码到 GitHub
echo    4. 在 Railway 部署并初始化数据库
echo.

pause

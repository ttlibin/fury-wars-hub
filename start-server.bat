@echo off
echo ===================================
echo     启动 Fury Wars 网站服务器
echo ===================================
echo.

echo 检查可用的启动方式...
echo.

:: 尝试使用 Node.js http-server
echo 尝试使用 Node.js http-server...
npx http-server . -p 8000 -o --silent >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js http-server 启动成功！
    echo 🌐 网站地址: http://localhost:8000
    echo 💡 浏览器应该会自动打开
    echo.
    echo 按任意键关闭服务器...
    pause >nul
    exit /b 0
)

:: 尝试使用 Python 3
echo 尝试使用 Python 3...
python -m http.server 8000 >nul 2>&1 &
timeout /t 2 /nobreak >nul
netstat -an | findstr :8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python 服务器启动成功！
    echo 🌐 网站地址: http://localhost:8000
    start http://localhost:8000
    echo.
    echo 按任意键关闭服务器...
    pause >nul
    taskkill /f /im python.exe >nul 2>&1
    exit /b 0
)

:: 尝试使用 PHP
echo 尝试使用 PHP...
php -S localhost:8000 >nul 2>&1 &
timeout /t 2 /nobreak >nul
netstat -an | findstr :8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PHP 服务器启动成功！
    echo 🌐 网站地址: http://localhost:8000
    start http://localhost:8000
    echo.
    echo 按任意键关闭服务器...
    pause >nul
    taskkill /f /im php.exe >nul 2>&1
    exit /b 0
)

:: 如果都失败了，提供手动方法
echo ❌ 自动启动失败，请尝试手动方法：
echo.
echo 方法1 - 使用 Node.js:
echo   npx http-server . -p 8000 -o
echo.
echo 方法2 - 使用 Python:
echo   python -m http.server 8000
echo.
echo 方法3 - 直接打开文件:
echo   双击 index.html 文件
echo.
echo 按任意键退出...
pause >nul 
@echo off
::这部分是将批处理自动加入到启动项。
::reg add HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run /v DELJPG /t REG_SZ /d "%~f0" /f
title CommonLib 9000
echo 当前目录是%cd%
node %cd%\app.js
pause

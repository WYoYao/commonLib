@echo off
::�ⲿ���ǽ��������Զ����뵽�����
::reg add HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Run /v DELJPG /t REG_SZ /d "%~f0" /f
title CommonLib 9000
echo ��ǰĿ¼��%cd%
node %cd%\app.js
pause

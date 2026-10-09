@echo off
chcp 65001 >nul
setlocal
set "DIR=%~dp0"
echo ============================================================
echo   NBL Dashboard - auto update API snapshot (for iPad/mobile)
echo ============================================================
if exist "%DIR%gdc-token.txt" goto task
echo.
echo Paste GitHub fine-grained token (Contents: Read and write, this repo only)
set /p "TOK=Token: "
if "%TOK%"=="" ( echo No token. Snapshot will be saved locally only. & goto task )
>"%DIR%gdc-token.txt" echo %TOK%
:task
schtasks /Create /F /TN "NBL-Dashboard-Snapshot" /SC DAILY /ST 06:10 /RI 360 /DU 24:00 ^
  /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%DIR%gdc-snapshot.ps1\"" >nul
if errorlevel 1 ( echo Could not create scheduled task. & pause & exit /b 1 )
echo Scheduled: every 6 hours (06:10, 12:10, 18:10, 00:10)
echo Running first update now...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%DIR%gdc-snapshot.ps1"
echo.
echo Log: %DIR%gdc-snapshot.log
pause

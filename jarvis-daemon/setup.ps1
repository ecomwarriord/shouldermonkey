# setup.ps1 — Register Jarvis daemon as a Windows startup task
# Run once as Administrator: powershell -ExecutionPolicy Bypass -File setup.ps1

$DaemonPath = "$PSScriptRoot\daemon.py"
$PythonPath = (Get-Command python).Source
$TaskName = "JarvisDaemon"
$LogPath = "$PSScriptRoot\daemon.log"

# Remove existing task if present
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

$Action = New-ScheduledTaskAction `
    -Execute $PythonPath `
    -Argument $DaemonPath `
    -WorkingDirectory $PSScriptRoot

$Trigger = New-ScheduledTaskTrigger -AtLogOn

$Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit ([TimeSpan]::Zero) `
    -RestartCount 3 `
    -RestartInterval ([TimeSpan]::FromMinutes(1))

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -RunLevel Highest `
    -Description "Jarvis Mobile — executes code commands from Telegram"

Write-Host "Jarvis daemon registered. Will start at next login."
Write-Host "To start now: Start-ScheduledTask -TaskName '$TaskName'"

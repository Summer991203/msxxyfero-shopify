$ErrorActionPreference = 'Stop'
$watcherAction = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "D:\Codex\msxxyfero-shopify\scripts\start-watcher.ps1"' -WorkingDirectory 'D:\Codex\msxxyfero-shopify'
$watcherTriggers = @(New-ScheduledTaskTrigger -AtStartup; New-ScheduledTaskTrigger -AtLogOn -User ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name))
$watcherPrincipal = New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType S4U -RunLevel Limited
$watcherSettings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName 'Msxxyfero Repo Watcher' -Action $watcherAction -Trigger $watcherTriggers -Principal $watcherPrincipal -Settings $watcherSettings -Description 'Poll Summer991203/msxxyfero-shopify every five minutes; launch Codex only for new tasks or briefs.' -Force -ErrorAction Stop
Start-ScheduledTask -TaskName 'Msxxyfero Repo Watcher' -ErrorAction Stop

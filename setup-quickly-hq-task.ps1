Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$appRoot = if ($env:QUICKLY_HQ_APP_ROOT) { $env:QUICKLY_HQ_APP_ROOT } else { "C:\Inetpub\vhosts\quickly.host\hq.quickly.host" }
$runnerSource = if ($env:QUICKLY_HQ_RUNNER_SOURCE) { $env:QUICKLY_HQ_RUNNER_SOURCE } else { "C:\Users\deploy\run-quickly-hq.ps1" }
$taskName = if ($env:QUICKLY_HQ_TASK_NAME) { $env:QUICKLY_HQ_TASK_NAME } else { "QuicklyHQ" }
$runner = Join-Path $appRoot "run-quickly-hq.ps1"

Copy-Item -LiteralPath $runnerSource -Destination $runner -Force
New-Item -ItemType Directory -Force -Path (Join-Path $appRoot "logs") | Out-Null

if (Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
}

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$runner`""
$trigger = New-ScheduledTaskTrigger -AtStartup
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew
$principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal | Out-Null

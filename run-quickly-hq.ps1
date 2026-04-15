Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$appRoot = if ($env:QUICKLY_HQ_APP_ROOT) { $env:QUICKLY_HQ_APP_ROOT } else { "C:\Inetpub\vhosts\quickly.host\hq.quickly.host" }
$nodeExecutable = if ($env:QUICKLY_HQ_NODE_PATH) { $env:QUICKLY_HQ_NODE_PATH } else { "C:\Program Files\nodejs\node.exe" }
$logsDir = Join-Path $appRoot "logs"

Set-Location -LiteralPath $appRoot

$stdout = Join-Path $logsDir "quickly-hq.out.log"
$stderr = Join-Path $logsDir "quickly-hq.err.log"

New-Item -ItemType Directory -Force -Path $logsDir | Out-Null

& $nodeExecutable "dist\server.js" 1>> $stdout 2>> $stderr

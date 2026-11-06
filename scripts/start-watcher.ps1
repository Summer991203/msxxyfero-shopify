$ErrorActionPreference = 'Stop'
$env:PATH = "$env:LOCALAPPDATA\OpenAI\Codex\bin;C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd;" + $env:PATH
$codexExecutable = Get-ChildItem "$env:LOCALAPPDATA\OpenAI\Codex\bin" -Filter codex.exe -Recurse |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $codexExecutable) { throw 'Codex executable was not found.' }
$env:MSXXYFERO_CODEX_EXE = $codexExecutable.FullName
$env:MSXXYFERO_STATE_FILE = 'D:\Codex\msxxyfero-watcher\state.json'
$env:MSXXYFERO_LOG_FILE = 'D:\Codex\msxxyfero-watcher\watcher.log'
$env:PYTHONUTF8 = '1'
Set-Location 'D:\Codex\msxxyfero-shopify'
& 'D:\Codex\tools\python\cpython-3.14-windows-x86_64-none\python.exe' -B 'scripts/watch-repo.py'
exit $LASTEXITCODE

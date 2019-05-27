
@if not defined DENO_DIR (
	set DENO_DIR=%HOMEDRIVE%%HOMEPATH%\.deno
)

@deno run --allow-net --allow-read --allow-write --allow-run %DENO_DIR%/iGit/iGit.js %*

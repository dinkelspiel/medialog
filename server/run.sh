watchexec --verbose --wrap-process=session --stop-signal SIGTERM --debounce 500ms -w=../client/src -w=./src -r -e=gleam -- gleam run

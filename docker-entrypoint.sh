#!/bin/sh

set -e

# trap ctrl-c and call ctrl_c()

function ctrl_c() {
        echo "Shutting down ..."
        # kill $(ps -s $$ -o pid=)
        pkill -P $$
}

# trap ctrl_c SIGINT SIGTERM SIGHUP SIGKILL SIGQUIT EXIT
trap ctrl_c 1 2 3 6

# trap 'pkill -P $$; exit 1;' TERM INT
# trap 'pkill -P $$; exit 1;' TERM INT

exec "$@"

# exec "node" "dist/index.js"
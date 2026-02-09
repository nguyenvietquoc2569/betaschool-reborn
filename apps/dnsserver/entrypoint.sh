#!/usr/bin/env sh
# vim:sw=4:ts=4:et:
#
# This script launches nginx.
#

nginx_pid=0

_stop() {
    echo "=== stopping by $1" >&2
    if [ $nginx_pid -ne 0 ]; then
        echo "=== stopping nginx" >&2
        kill -QUIT $nginx_pid
        wait "$nginx_pid"
    fi
    exit 0
}

for sig in TERM QUIT INT; do
    trap "_stop $sig" $sig
done

echo "=== starting nginx" >&2
/usr/sbin/nginx -c /etc/nginx/nginx.conf -g 'daemon off;' &
nginx_pid="$!"

echo "=== nginx_pid=${nginx_pid}" >&2

wait "$nginx_pid"
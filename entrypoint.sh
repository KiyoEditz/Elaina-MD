#!/bin/bash
set -e

cd /home/container

# Make internal Docker IP address available to processes if iproute2 is available
if command -v ip >/dev/null 2>&1; then
    export INTERNAL_IP=$(ip route get 1 2>/dev/null | awk '{print $NF;exit}')
fi

# Print Node.js Version
echo "[Elaina-MD] Node.js Version: $(node -v)"
echo "[Elaina-MD] NPM Version: $(npm -v)"

# Ensure data, session, and tmp directories exist
mkdir -p /home/container/data /home/container/session /home/container/tmp

# Check if running under Pterodactyl Panel (STARTUP variable is set)
if [ -n "${STARTUP}" ]; then
    MODIFIED_STARTUP=$(echo -e "${STARTUP}" | sed -e 's/{{/${/g' -e 's/}}/}/g')
    echo ":/home/container$ ${MODIFIED_STARTUP}"
    eval "${MODIFIED_STARTUP}"
else
    # Standard Docker / Docker Compose / Heroku execution
    if [ $# -eq 0 ]; then
        exec node index.js
    else
        exec "$@"
    fi
fi

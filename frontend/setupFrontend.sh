#!/bin/bash
cd ./frontend
if [ ! -f /setupran ]; then
    echo "Running first time setup."

    npm i

    touch /setupran
fi

/usr/bin/node .

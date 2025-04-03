#!/bin/bash
cd ./frontend
if [ ! -f /setupran ]; then
    echo "File not found!"

    npm i

    touch /setupran
fi

/usr/bin/node .

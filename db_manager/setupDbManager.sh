#!/bin/bash
cd ./db_manager
if [ ! -f /setupran ]; then
    echo "File not found!"

    npm i

    touch /setupran
fi

/usr/bin/npm start

#!/bin/bash
cd ./db_manager
if [ ! -f /setupran ]; then
    echo "Running first time setup."

    npm i

    touch /setupran
fi

/usr/bin/npm start

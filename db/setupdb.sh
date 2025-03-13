#!/bin/bash

if [ ! -f /installran ]; then
    echo "File not found!"

    export DEBIAN_FRONTEND="noninteractive"
    debconf-set-selections <<< "mariadb-server mysql-server/root_password password $ROOTPASSWORD"
    debconf-set-selections <<< "mariadb-server mysql-server/root_password_again password $ROOTPASSWORD"

    apt-get install -y mariadb-server

    service mariadb start

    sleep 2

    if [ ! -f /var/lib/mysql/setupran ]; then 
        mariadb -u root -p$ROOTPASSWORD -e "CREATE USER '$DBUSER'@'%%' IDENTIFIED BY '$PASSWORD'; GRANT ALL PRIVILEGES ON *.* TO '$DBUSER'@'%%' identified by '$PASSWORD'; FLUSH PRIVILEGES;"

        mariadb -u root -p$ROOTPASSWORD -e "CREATE DATABASE IF NOT EXISTS $DATABASE"

        mariadb -u root -p$ROOTPASSWORD -e "GRANT ALL PRIVILEGES ON $DATABASE.* TO $DBUSER@'%%';"

        mysql -u $DBUSER -p$PASSWORD $DATABASE < ./init.sql

        touch /setupran
    fi

    service mariadb stop

    sleep 2

    sed -n -i '/bind-address/!p' /etc/mysql/mariadb.conf.d/50-server.cnf

    touch /installran
fi

/usr/bin/mysqld_safe

#!/bin/bash

if [ ! -f /installran ]; then
    echo "Running first time setup."

    export DEBIAN_FRONTEND="noninteractive"
    debconf-set-selections <<< "mariadb-server mysql-server/root_password password $ROOTPASSWORD"
    debconf-set-selections <<< "mariadb-server mysql-server/root_password_again password $ROOTPASSWORD"

    apt-get clean
    apt-get update --fix-missing 
    apt-get upgrade -y

    apt-get install -y mariadb-server

    service mariadb start

    sleep 2

    if [ ! -f /var/lib/mysql/setupran ]; then 
        mariadb -u root -p$DB_ROOT_PASSWORD -e "CREATE USER '$DB_USER'@'%%' IDENTIFIED BY '$DB_PASSWORD'; FLUSH PRIVILEGES;"

        mariadb -u root -p$DB_ROOT_PASSWORD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

        mariadb -u root -p$DB_ROOT_PASSWORD -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO $DB_USER@'%%';"

        mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME < ./init.sql

        touch /var/lib/mysql/setupran
    fi

    service mariadb stop

    sleep 2

    sed -n -i '/bind-address/!p' /etc/mysql/mariadb.conf.d/50-server.cnf

    touch /installran
fi

/usr/bin/mysqld_safe

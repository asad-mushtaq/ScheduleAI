FROM ubuntu:24.04

MAINTAINER Shayan Zahedanaraki <shayan.zahedana@gmail.com>

RUN apt-get clean
RUN apt-get update --fix-missing 
RUN apt-get upgrade -y



EXPOSE 3306

LABEL version="1.0"
LABEL description="ScheduleAI MariaDB Server."

COPY . .

RUN chmod o+rx ./setupdb.sh

HEALTHCHECK --start-period=5m \
  CMD mariadb -e 'SELECT @@datadir;' || exit 1

ENTRYPOINT ["./setupdb.sh"]
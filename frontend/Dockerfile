FROM ubuntu:24.04

MAINTAINER Shayan Zahedanaraki <shayan.zahedana@gmail.com>

RUN apt-get clean
RUN apt-get update --fix-missing 
RUN apt-get upgrade -y
RUN apt-get install nodejs -y
RUN apt-get install npm -y

RUN mkdir frontend

# EXPOSE 3000

LABEL version="1.0"
LABEL description="ScheduleAI Database Manager."

COPY . ./frontend

RUN chmod o+rx ./frontend/setupFrontend.sh

ENTRYPOINT ["./frontend/setupFrontend.sh"]

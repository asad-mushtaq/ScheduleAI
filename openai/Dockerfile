FROM ubuntu:24.04

RUN apt-get clean
RUN apt-get update --fix-missing 
RUN apt-get upgrade -y
RUN apt-get install nodejs -y
RUN apt-get install npm -y

RUN mkdir openai
WORKDIR /openai

LABEL version="1.0"
LABEL description="ScheduleAI AI Query."

COPY . .
RUN npm i

ENTRYPOINT ["npm", "start"]
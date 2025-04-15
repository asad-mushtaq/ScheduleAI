# ScheduleAI
## AI powered Scheduling web application to help busy students and professionals stay on top of their work and schedule.

## Steps to run this web application locally

0. Ensure you're using Linux or another Unix like OS, otherwise you have to ensure the .sh/shell files in each microservice folder use the LF end of line sequence format, and not CRLF.

1. Create local .env file with correct values set in the root directory of project (same directory as docker-compose.yml).
example .env file:
```
# Database env variables.
DB_HOST=schedule_ai_db
DB_PORT=3306
DB_USER=dbuser
DB_PASSWORD=pw
DB_NAME=schedule_ai_db
DB_ROOT_PASSWORD=rootpw

# Database manager env variables.
DB_MANAGER_PORT=3000
DB_MANAGER_HOST=schedule_ai_db_manager

# API Gateway env variables.
API_GATEWAY_HOST=schedule_ai_api_gateway
API_GATEWAY_PORT=8080
# https://www.baeldung.com/linux/nginx-config-environment-variables
# Remedy for nginx config compilation error. 
DOLLAR=$

# Frontend environment variables.
# Use host that appears in the URL of web browser for CORS.
FRONTEND_PORT=4000
FRONTEND_HOST=localhost
JWT_SECRET=<any random string of characters>

# OpenAI service environment variables.
OPENAI_HOST=schedule_ai_openai
OPENAI_PORT=6000
OPENAI_API_KEY=<Valid OpenAI API key>
```

2. Ensure you have docker and docker compose installed and running on your computer

3. Run `docker compose up` to start the project.

4. When "Example app on url: http://FRONTEND_HOST:FRONTEND_PORT" shows up in the console with the values, as set in the .env file, it means the application is ready, just go to that URL on web browser and the Web Application should just work.
Comp 7082 Project: Team 7

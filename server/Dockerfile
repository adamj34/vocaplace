FROM node:20.11.1-alpine3.18

WORKDIR /opt/app

COPY ./package*.json .

RUN npm install --production=false

COPY . .

CMD ["npm", "start"]

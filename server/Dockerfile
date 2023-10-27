FROM node:20.9.0-alpine3.18

WORKDIR /opt/app

COPY ./package*.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
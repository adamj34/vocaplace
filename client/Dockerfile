FROM node:20.9.0-alpine3.18

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]

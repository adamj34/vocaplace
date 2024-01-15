FROM node:20.9.0-alpine3.18

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

# testing purposes
RUN npm run build 

CMD ["npm", "start"]

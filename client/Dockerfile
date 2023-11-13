FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV REACT_APP_API_URL=http://localhost:8000

RUN npm run build

CMD ["npm", "start"]

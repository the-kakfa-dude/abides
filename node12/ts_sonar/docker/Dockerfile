FROM node:12

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
RUN npm install

COPY . /app

RUN npm run compile


FROM node:15.8 AS cevin-api

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install

COPY ./ ./

EXPOSE 3000

CMD ["npm", "start"]

# USE
# docker build -t cevin-api .
# docker run --name cevin-api --restart unless-stopped -d -p 5106:3000 cevin-api
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install --frozen-lockfile --production

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]

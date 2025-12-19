FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY .env .
COPY src/ src/

ENV NODE_ENV=production

CMD ["npm", "start"]


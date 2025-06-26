FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npm install -g nodemon
EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM node:22-alpine

WORKDIR /app


COPY package.json ./ 

COPY package-lock.json ./

COPY . . 

CMD ["npm","run","dev"]

EXPOSE 5173





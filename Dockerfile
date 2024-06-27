# Build stage

FROM node:18 as build

WORKDIR /usr/src/my-app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Production stage

FROM node:18 as prod

WORKDIR /usr/src/my-app

COPY --from=build ./usr/src/my-app/build ./build
COPY --from=build ./usr/src/my-app/package.json ./package.json
COPY --from=build ./usr/src/my-app/package-lock.json ./package-lock.json

RUN npm install --only=production

# CMD [ "npm", "run", "start" ] -> npm이 부모프로세스가 돼서 process.on() 안먹힘

CMD [ "node", "build/index.js" ]
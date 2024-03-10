## base #######################################################################
FROM node:hydrogen-alpine3.19 AS base

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./
RUN npm install

## dev ########################################################################
FROM base AS dev

COPY src/ ./src
COPY prisma/ ./prisma

EXPOSE 3000

CMD ["npm", "run", "dev"]

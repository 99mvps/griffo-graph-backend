FROM node:18 AS builder
WORKDIR /home/backend

COPY . ./

RUN npm install

RUN npm run build

FROM builder

WORKDIR /home/backend

COPY --from=builder /home/backend ./

CMD ["npm", "run", "start:dev"]
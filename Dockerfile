FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

CMD ["sh", "-c", "./wait-for-it.sh postgres:5432 -- npx prisma generate && npx prisma db push && npm run start:dev"]

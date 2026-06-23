FROM node:22.21.1-slim

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

ENV PORT=5051
EXPOSE 5051

CMD ["npm", "start"]

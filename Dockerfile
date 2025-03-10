FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Using --legacy-peer-deps to handle dependency conflicts
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
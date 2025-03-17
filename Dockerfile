FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Create a default .env file if none exists
COPY .env.example .env

EXPOSE 5173

# Use development mode by default
ENV NODE_ENV=development

# Modified command to ensure Vite binds to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Create uploads directory
RUN mkdir -p uploads logs

EXPOSE 5000

CMD ["node", "server.js"]

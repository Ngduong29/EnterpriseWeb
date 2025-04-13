FROM node:18-alpine

WORKDIR /app

# Cài đặt nodemon toàn cục
RUN npm install -g nodemon

# Copy và cài đặt dependencies trước
COPY package*.json ./
RUN npm install --only=production

# Sau đó mới copy source code
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
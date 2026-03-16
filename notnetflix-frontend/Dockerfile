# Dùng Node.js làm môi trường
FROM node:18-alpine
WORKDIR /app

# Copy file cấu hình và cài đặt thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ code frontend vào hộp
COPY . .

# Build dự án Next.js
RUN npm run build

# Mở cổng 3000
EXPOSE 3000

# Lệnh khởi động server
CMD ["npm", "start"]
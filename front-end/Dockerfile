# Giai đoạn build
FROM node:16-alpine AS build

WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng
RUN npm run build

# Expose cổng 5173
EXPOSE 5173

# Chạy nginx
CMD ["npm", "run", "dev"]
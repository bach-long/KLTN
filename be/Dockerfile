# Sử dụng node 14 làm base image
FROM node:16

# Thiết lập thư mục làm việc
WORKDIR /var/www/html/kltn/be

# Sao chép package.json và package-lock.json nếu có để cache dependencies
COPY package*.json .

# Cài đặt dependencies
RUN npm install

# Mở cổng 3000, cổng mặc định cho ứng dụng Express.js
EXPOSE 5000

# Chạy ứng dụng khi container được khởi chạy
CMD ["npm", "run", "dev"]

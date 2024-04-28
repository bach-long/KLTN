FROM python:3.10.12

# Thiết lập thư mục làm việc
WORKDIR /var/www/html/kltn/python

# Sao chép các tệp cần thiết vào thư mục làm việc trong container
COPY requirements.txt .

RUN apt-get update
RUN apt update
RUN apt-get install libcups2-dev -y
RUN apt install libdbus-1-3 libdbus-1-dev -y

# Cài đặt các gói phụ thuộc từ requirements.txt
RUN python3 -m pip install --no-cache-dir -r requirements.txt

# Mở cổng 8000, cổng mặc định của FastAPI
EXPOSE 8000

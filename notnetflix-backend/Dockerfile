# Bước 1: Mượn môi trường Maven và Java 17 để build code
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Đóng gói ra file .jar và bỏ qua các bài test để tăng tốc
RUN mvn clean package -DskipTests

# Bước 2: Tạo môi trường Java siêu nhẹ để chạy ứng dụng
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy file .jar đã đóng gói từ Bước 1 sang
COPY --from=build /app/target/*.jar app.jar
# Mở cổng 8080 cho Backend
EXPOSE 8080
# Lệnh khởi động Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
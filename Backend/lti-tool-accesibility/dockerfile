FROM eclipse-temurin:17-jdk-jammy
RUN apt-get update && apt-get install -y maven
COPY . .
RUN mvn clean install -DskipTests
CMD ["java", "-jar", "target/lti-accessibility-tool-0.0.1-SNAPSHOT.jar"]

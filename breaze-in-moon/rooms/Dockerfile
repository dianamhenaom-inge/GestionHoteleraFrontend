FROM amazoncorretto:25 AS build
RUN yum install -y tar gzip findutils
RUN curl -sL https://archive.apache.org/dist/maven/maven-3/3.9.14/binaries/apache-maven-3.9.14-bin.tar.gz | tar -xz -C /opt \
    && ln -s /opt/apache-maven-3.9.14 /opt/maven
ENV PATH=/opt/maven/bin:$PATH
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM amazoncorretto:25
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

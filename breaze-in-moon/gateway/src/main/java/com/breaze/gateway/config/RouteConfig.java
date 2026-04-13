package com.breaze.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.web.servlet.function.RequestPredicates.path;

@Configuration
public class RouteConfig {

    @Value("${AUTH_SERVICE_URL:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${ROOMS_SERVICE_URL:http://localhost:8082}")
    private String roomsServiceUrl;

    @Value("${BOOKS_SERVICE_URL:http://localhost:8083}")
    private String booksServiceUrl;

    @Value("${AUDIT_LAMBDA_URL:https://bfynoncfwl.execute-api.us-east-2.amazonaws.com/default/events}")
    private String auditLambdaUrl;

    @Bean
    public RouterFunction<ServerResponse> authRoute() {
        return GatewayRouterFunctions.route("auth-route")
                .route(path("/api/auth/**"), HandlerFunctions.http())
                .before(BeforeFilterFunctions.uri(authServiceUrl))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> roomsRoute() {
        return GatewayRouterFunctions.route("rooms-route")
                .route(path("/api/rooms/**").or(path("/api/rooms")), HandlerFunctions.http())
                .before(BeforeFilterFunctions.uri(roomsServiceUrl))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> booksRoute() {
        return GatewayRouterFunctions.route("books-route")
                .route(path("/api/books/**").or(path("/api/books")), HandlerFunctions.http())
                .before(BeforeFilterFunctions.uri(booksServiceUrl))
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> auditRoute() {
        return GatewayRouterFunctions.route("audit-route")
                .route(path("/api/audit/events"), HandlerFunctions.http())
                .before(BeforeFilterFunctions.uri(auditLambdaUrl))
                .build();
    }
}

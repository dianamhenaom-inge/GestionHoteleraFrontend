package com.breaze.auth.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuditClient {

    @Value("${audit.url}")
    private String auditUrl;

    private final RestTemplate restTemplate;

    @Async
    public void send(String event, String userId, Map<String, Object> data) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("event", event);
            payload.put("userId", userId);
            payload.put("data", data);
            payload.put("timestamp", Instant.now().toString());
            restTemplate.postForEntity(auditUrl, payload, Void.class);
        } catch (Exception e) {
            log.warn("Audit event could not be sent: {}", e.getMessage());
        }
    }
}

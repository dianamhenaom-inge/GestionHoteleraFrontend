package com.breaze.books.client;

import com.breaze.books.client.dto.RoomInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class RoomsClient {

    @Value("${rooms.service.url}")
    private String roomsServiceUrl;

    @Value("${service.secret}")
    private String serviceSecret;

    private final RestTemplate restTemplate;

    @SuppressWarnings("unchecked")
    public RoomInfo getRoom(Long id) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Service-Secret", serviceSecret);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                roomsServiceUrl + "/internal/" + id,
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
        return toRoomInfo(data);
    }

    public void updateRoomStatus(Long id, String status) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Service-Secret", serviceSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of("status", status);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        restTemplate.exchange(
                roomsServiceUrl + "/internal/" + id + "/status",
                HttpMethod.PATCH,
                entity,
                Map.class
        );
    }

    private RoomInfo toRoomInfo(Map<String, Object> data) {
        RoomInfo info = new RoomInfo();
        info.setId(data.get("id") != null ? Long.valueOf(data.get("id").toString()) : null);
        info.setNumber((String) data.get("number"));
        info.setType((String) data.get("type"));
        info.setDescription((String) data.get("description"));
        info.setCapacity(data.get("capacity") != null ? Integer.parseInt(data.get("capacity").toString()) : 0);
        info.setPrice(data.get("price") != null ? new BigDecimal(data.get("price").toString()) : null);
        info.setStatus((String) data.get("status"));
        return info;
    }
}

package com.breaze.rooms.controller;

import com.breaze.rooms.common.ApiResponse;
import com.breaze.rooms.dto.RoomResponse;
import com.breaze.rooms.dto.UpdateStatusRequest;
import com.breaze.rooms.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal")
@RequiredArgsConstructor
public class InternalRoomController {

    @Value("${service.secret}")
    private String serviceSecret;

    private final IRoomService roomService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoom(
            @PathVariable Long id,
            @RequestHeader(value = "X-Service-Secret", required = false) String secret) {
        if (!serviceSecret.equals(secret)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Forbidden"));
        }
        return ResponseEntity.ok(ApiResponse.success("Room found", roomService.findById(id)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RoomResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request,
            @RequestHeader(value = "X-Service-Secret", required = false) String secret) {
        if (!serviceSecret.equals(secret)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Forbidden"));
        }
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                roomService.updateStatus(id, request.getStatus())));
    }
}

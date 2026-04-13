package com.breaze.rooms.controller;

import com.breaze.rooms.common.ApiResponse;
import com.breaze.rooms.dto.RoomRequest;
import com.breaze.rooms.dto.RoomResponse;
import com.breaze.rooms.dto.UpdateStatusRequest;
import com.breaze.rooms.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final IRoomService roomService;

    @GetMapping({"", "/"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAll(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success("Rooms retrieved", roomService.findAll(status)));
    }

    @PostMapping({"", "/"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoomResponse>> create(@RequestBody RoomRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Room created", roomService.create(request)));
    }

    @GetMapping("/available")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ApiResponse<List<RoomResponse>>> getAvailable() {
        return ResponseEntity.ok(ApiResponse.success("Available rooms", roomService.findAvailable()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoomResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Room found", roomService.findById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoomResponse>> update(@PathVariable Long id,
                                                            @RequestBody RoomRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Room updated", roomService.update(id, request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RoomResponse>> updateStatus(@PathVariable Long id,
                                                                   @RequestBody UpdateStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", roomService.updateStatus(id, request.getStatus())));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(404).body(ApiResponse.error(ex.getMessage()));
    }
}

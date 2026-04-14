package com.breaze.rooms.service.impl;

import com.breaze.rooms.audit.AuditClient;
import com.breaze.rooms.dto.RoomRequest;
import com.breaze.rooms.dto.RoomResponse;
import com.breaze.rooms.entity.Room;
import com.breaze.rooms.entity.RoomStatus;
import com.breaze.rooms.repository.RoomRepository;
import com.breaze.rooms.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements IRoomService {

    private final RoomRepository roomRepository;
    private final AuditClient auditClient;

    @Override
    public List<RoomResponse> findAll(String status) {
        if (status != null && !status.isBlank()) {
            RoomStatus roomStatus = RoomStatus.valueOf(status.toUpperCase());
            return roomRepository.findByStatus(roomStatus).stream()
                    .map(this::toResponse)
                    .toList();
        }
        return roomRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public RoomResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    @Override
    public RoomResponse create(RoomRequest request) {
        Room room = new Room();
        room.setNumber(request.getNumber());
        room.setType(request.getType());
        room.setDescription(request.getDescription());
        room.setCapacity(request.getCapacity());
        room.setPrice(request.getPrice());
        room.setStatus(request.getStatus() != null
                ? RoomStatus.valueOf(request.getStatus().toUpperCase())
                : RoomStatus.AVAILABLE);
        return toResponse(roomRepository.save(room));
    }

    @Override
    public RoomResponse update(Long id, RoomRequest request) {
        Room room = getOrThrow(id);
        room.setNumber(request.getNumber());
        room.setType(request.getType());
        room.setDescription(request.getDescription());
        room.setCapacity(request.getCapacity());
        room.setPrice(request.getPrice());
        if (request.getStatus() != null) {
            room.setStatus(RoomStatus.valueOf(request.getStatus().toUpperCase()));
        }
        return toResponse(roomRepository.save(room));
    }

    @Override
    public RoomResponse updateStatus(Long id, String status) {
        Room room = getOrThrow(id);
        RoomStatus newStatus = RoomStatus.valueOf(status.toUpperCase());
        room.setStatus(newStatus);
        RoomResponse response = toResponse(roomRepository.save(room));
        auditClient.send("ROOM_STATUS_CHANGED", "system",
                Map.of("roomId", id, "newStatus", status));
        return response;
    }

    @Override
    public List<RoomResponse> findAvailable() {
        return roomRepository.findByStatus(RoomStatus.AVAILABLE).stream()
                .map(this::toResponse)
                .toList();
    }

    private Room getOrThrow(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found: " + id));
    }

    private RoomResponse toResponse(Room room) {
        RoomResponse dto = new RoomResponse();
        dto.setId(room.getId());
        dto.setNumber(room.getNumber());
        dto.setType(room.getType());
        dto.setDescription(room.getDescription());
        dto.setCapacity(room.getCapacity());
        dto.setPrice(room.getPrice());
        dto.setStatus(room.getStatus().name());
        return dto;
    }
}

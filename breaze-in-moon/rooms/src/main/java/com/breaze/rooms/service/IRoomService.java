package com.breaze.rooms.service;

import com.breaze.rooms.dto.RoomRequest;
import com.breaze.rooms.dto.RoomResponse;

import java.util.List;

public interface IRoomService {
    List<RoomResponse> findAll(String status);
    RoomResponse findById(Long id);
    RoomResponse create(RoomRequest request);
    RoomResponse update(Long id, RoomRequest request);
    RoomResponse updateStatus(Long id, String status);
    List<RoomResponse> findAvailable();
}

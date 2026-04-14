package com.breaze.rooms.repository;

import com.breaze.rooms.entity.Room;
import com.breaze.rooms.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(RoomStatus status);
}

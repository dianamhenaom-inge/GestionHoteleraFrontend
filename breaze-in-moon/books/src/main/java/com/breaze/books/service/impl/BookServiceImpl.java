package com.breaze.books.service.impl;

import com.breaze.books.audit.AuditClient;
import com.breaze.books.client.RoomsClient;
import com.breaze.books.client.dto.RoomInfo;
import com.breaze.books.dto.BookRequest;
import com.breaze.books.dto.BookResponse;
import com.breaze.books.dto.UpdateBookRequest;
import com.breaze.books.entity.Book;
import com.breaze.books.entity.BookStatus;
import com.breaze.books.repository.BookRepository;
import com.breaze.books.service.IBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements IBookService {

    private final BookRepository bookRepository;
    private final RoomsClient roomsClient;
    private final AuditClient auditClient;

    @Override
    public List<BookResponse> findAll() {
        return bookRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public BookResponse findById(Long id) {
        return toResponse(getOrThrow(id));
    }

    @Override
    @Transactional
    public BookResponse create(BookRequest request, String userId) {
        RoomInfo room = roomsClient.getRoom(request.getRoomId());
        if (!"AVAILABLE".equals(room.getStatus())) {
            throw new IllegalStateException("Room is not available: " + request.getRoomId());
        }

        Book book = new Book();
        book.setRoomId(request.getRoomId());
        book.setUserId(userId);
        book.setStartDate(LocalDate.now());
        book.setEndDate(LocalDate.now());
        book.setStatus(BookStatus.ACTIVE);
        bookRepository.save(book);

        roomsClient.updateRoomStatus(request.getRoomId(), "OCCUPIED");

        auditClient.send("BOOKING_CREATED", userId,
                Map.of("bookingId", book.getId(), "roomId", request.getRoomId()));

        return toResponse(book);
    }

    @Override
    @Transactional
    public BookResponse update(Long id, UpdateBookRequest request, String userId, boolean isAdmin) {
        Book book = getOrThrow(id);

        if (!isAdmin && !book.getUserId().equals(userId)) {
            throw new IllegalStateException("You can only modify your own bookings");
        }

        BookStatus newStatus = BookStatus.valueOf(request.getStatus().toUpperCase());
        book.setStatus(newStatus);
        bookRepository.save(book);

        if (newStatus == BookStatus.CANCELLED) {
            roomsClient.updateRoomStatus(book.getRoomId(), "AVAILABLE");
            auditClient.send("BOOKING_CANCELLED", userId,
                    Map.of("bookingId", id, "roomId", book.getRoomId()));
        }

        return toResponse(book);
    }

    @Override
    public List<BookResponse> findByUser(String userId) {
        return bookRepository.findByUserId(userId).stream().map(this::toResponse).toList();
    }

    private Book getOrThrow(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
    }

    private BookResponse toResponse(Book book) {
        BookResponse dto = new BookResponse();
        dto.setId(book.getId());
        dto.setRoomId(book.getRoomId());
        dto.setUserId(book.getUserId());
        dto.setStartDate(book.getStartDate());
        dto.setEndDate(book.getEndDate());
        dto.setStatus(book.getStatus().name());
        dto.setCreatedAt(book.getCreatedAt());
        return dto;
    }
}

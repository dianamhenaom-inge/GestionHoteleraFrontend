package com.breaze.books.controller;

import com.breaze.books.common.ApiResponse;
import com.breaze.books.dto.BookRequest;
import com.breaze.books.dto.BookResponse;
import com.breaze.books.dto.UpdateBookRequest;
import com.breaze.books.service.IBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final IBookService bookService;

    @GetMapping({"", "/"})
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookService.findAll()));
    }

    @PostMapping({"", "/"})
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ApiResponse<BookResponse>> create(@RequestBody BookRequest request,
                                                            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Booking created",
                bookService.create(request, authentication.getName())));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ApiResponse<List<BookResponse>>> myBookings(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Your bookings",
                bookService.findByUser(authentication.getName())));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Booking found", bookService.findById(id)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ApiResponse<BookResponse>> update(@PathVariable Long id,
                                                            @RequestBody UpdateBookRequest request,
                                                            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(ApiResponse.success("Booking updated",
                bookService.update(id, request, authentication.getName(), isAdmin)));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Void>> handleConflict(IllegalStateException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(RuntimeException ex) {
        return ResponseEntity.status(404).body(ApiResponse.error(ex.getMessage()));
    }
}

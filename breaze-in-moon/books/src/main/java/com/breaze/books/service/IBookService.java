package com.breaze.books.service;

import com.breaze.books.dto.BookRequest;
import com.breaze.books.dto.BookResponse;
import com.breaze.books.dto.UpdateBookRequest;

import java.util.List;

public interface IBookService {
    List<BookResponse> findAll();
    BookResponse findById(Long id);
    BookResponse create(BookRequest request, String userId);
    BookResponse update(Long id, UpdateBookRequest request, String userId, boolean isAdmin);
    List<BookResponse> findByUser(String userId);
}

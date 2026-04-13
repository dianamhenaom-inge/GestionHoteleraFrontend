package com.breaze.books.client.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomInfo {
    private Long id;
    private String number;
    private String type;
    private String description;
    private int capacity;
    private BigDecimal price;
    private String status;
}

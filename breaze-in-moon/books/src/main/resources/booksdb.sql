CREATE TABLE IF NOT EXISTS books (
    id         BIGINT      AUTO_INCREMENT PRIMARY KEY,
    room_id    BIGINT      NOT NULL,
    user_id    VARCHAR(100) NOT NULL,
    start_date DATE        NOT NULL,
    end_date   DATE        NOT NULL,
    status     VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP            DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
    id          BIGINT         AUTO_INCREMENT PRIMARY KEY,
    number      VARCHAR(20)    NOT NULL UNIQUE,
    type        VARCHAR(50)    NOT NULL,
    description TEXT,
    capacity    INT            NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,
    status      VARCHAR(20)    NOT NULL DEFAULT 'AVAILABLE'
);

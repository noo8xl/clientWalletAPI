
DROP DATABASE IF EXISTS wallet;
CREATE DATABASE IF NOT EXISTS wallet;
USE wallet;

DROP TABLE IF EXISTS wallet_details;
DROP TABLE IF EXISTS wallet_params;
DROP TABLE IF EXISTS wallet_list;

DROP TABLE IF EXISTS customer_details;
DROP TABLE IF EXISTS customer_base;

DROP PROCEDURE IF EXISTS update_wallet_balance;


CREATE TABLE IF NOT EXISTS customer_base (
    id INT NOT NULL AUTO_INCREMENT,
    name varchar(30) NOT NULL,
    email varchar(250) NOT NULL,
    password varchar(30) NOT NULL,

    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS customer_details (
    id INT NOT NULL AUTO_INCREMENT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    is_banned Boolean NOT NULL DEFAULT 0,
    role varchar(10) NOT NULL DEFAULT 'USER',
    customer_id INT NOT NULL,

    FOREIGN KEY (customer_id) REFERENCES customer_base (id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS wallet_list (
    id INT NOT NULL AUTO_INCREMENT,
    coin_name VARCHAR(20) NOT NULL,
    address VARCHAR(200) NOT NULL,
    balance FLOAT NOT NULL DEFAULT(0),
    customer_id INT NOT NULL,

    FOREIGN KEY (customer_id) REFERENCES customer_base (id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS wallet_details (
    id INT NOT NULL AUTO_INCREMENT,
    private_key VARCHAR(500) NOT NULL,
    public_key VARCHAR(500) NOT NULL,
    seed_phrase VARCHAR(500),
    mnemonic VARCHAR(500),
    wallet_id int NOT NULL,

    FOREIGN KEY (wallet_id) REFERENCES wallet_list (id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS wallet_params (
    id int NOT NULL AUTO_INCREMENT,
    is_used BOOL DEFAULT(0),
    is_checked BOOL DEFAULT(0),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    wallet_id int NOT NULL,

    FOREIGN KEY(wallet_id) REFERENCES wallet_list (id),
    PRIMARY KEY (id)
);

DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS update_wallet_balance(
    IN walletId INT,
    IN newBalance FLOAT
)
BEGIN

    UPDATE wallet_list
        SET balance=newBalance
        WHERE id=walletId;

    UPDATE wallet_params
        SET is_checked=true, updated_at=CURRENT_TIMESTAMP()
        WHERE wallet_id=walletId;

    COMMIT ;

END $$
DELIMITER ;

CALL update_wallet_balance(1,0.332);


CREATE VIEW get_parser_statistics AS
    SELECT COUNT(id) AS checked_wallets
    FROM wallet_params
    WHERE is_checked=true

# is checked count, is used count, coins found, coins sent




-- create tables -> 

-- create table WalletList (
--   id int PRIMARY KEY AUTO_INCREMENT, coinName VARCHAR(20) NOT NULL, address VARCHAR(200) NOT NULL, 
--   privateKey VARCHAR(500) NOT NULL, publicKey VARCHAR(500) NOT NULL, seedPhrase VARCHAR(500), 
--   mnemonic VARCHAR(500), isUsed BOOL DEFAULT(0), isChecked BOOL DEFAULT(0), 
--   balance FLOAT NOT NULL DEFAULT(0), userId VARCHAR(100) NOT NULL );


create table WalletList (
  id int PRIMARY KEY AUTO_INCREMENT, coinName VARCHAR(20) NOT NULL, 
  address VARCHAR(200) NOT NULL, balance FLOAT NOT NULL DEFAULT(0), userId VARCHAR(100) NOT NULL 
);

create table WalletDetails (
  id int PRIMARY KEY AUTO_INCREMENT, privateKey VARCHAR(500) NOT NULL, publicKey VARCHAR(500) NOT NULL, 
  seedPhrase VARCHAR(500), mnemonic VARCHAR(500), walletId int NOT NULL, FOREIGN_KEY(walletId) 
);

create table WalletParams (
  id int PRIMARY KEY AUTO_INCREMENT, isUsed BOOL DEFAULT(0), isChecked BOOL DEFAULT(0), 
  createdAt TIMESTAMP NOT NULL, updatedAt TIMESTAMP NOT NULL, 
  walletId int NOT NULL, FOREIGN_KEY(walletId)
);




# create tables -> 

create table WalletList (
  id int PRIMARY KEY AUTO_INCREMENT, coinName VARCHAR(20) NOT NULL, address VARCHAR(200) NOT NULL, 
  privateKey VARCHAR(500) NOT NULL, publicKey VARCHAR(500) NOT NULL, seedPhrase VARCHAR(500), 
  mnemonic VARCHAR(500), balance FLOAT NOT NULL DEFAULT(0), userId VARCHAR(100) NOT NULL );

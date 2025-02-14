CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    username varchar(20),
    email varchar(40) NOT NULL,
    password varchar(100) NOT NULL,
    PRIMARY KEY (id)
);


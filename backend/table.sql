create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
)

INSERT INTO user (name, contactNumber, email, password, status, role)
VALUES ('Admin', '1234567890', 'admin@gmail.com', 'admin', 'true', 'admin');


create table category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
)
create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

INSERT INTO user (name, contactNumber, email, password, status, role)
VALUES ('Admin', '0701234567', 'admin@gmail.com', 'admin', 'true', 'admin');


create table category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
);



create table product(
    id int not null AUTO_INCREMENT,
    name varchar(255) not NULL,
    categoryId int NOT NULL,
    description varchar(255),
    price int,
    status varchar(20),
    primary key(id)
);

create table bill(
    id int not null AUTO_INCREMENT,
    uuid varchar(200) NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(20) not null,
    paymentMethod varchar(50) NOT NULL,
    total int NOT NULL,
    productDetails JSON default NULL,
    createdBy varchar(255) NOT NULL,
    primary key(id)
);
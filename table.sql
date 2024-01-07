create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(20),
    status varchar(20),
    role varchar(20),
    UNIQUE (email),
    
);

insert into user(name, contactNumber, email, password, status, role) values('Admin', '123456789', 'kibfsd@gmail.com', '123456', 'true', 'admin'); 
insert into user(name, contactNumber, email, password, status, role) values('Admin2', '123456789', 'admin2@gmail.com', '123456', 'true', 'admin'); 

create table category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(250) NOT NULL,
    primary key (id)
);

create table product(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(250) NOT NULL,
    categoryId integer NOT NULL,
    description varchar(20),
    price decimal(10,2),
    status varchar(20),
    primary key (id),
);


DROP DATABASE IF EXISTS duelApp_db;

CREATE DATABASE duelApp_db;

USE duelApp_db;

CREATE TABLE characters(
    id int primary key,
    name varchar(50),
    health varchar(50),
    stats varchar(75)
);

CREATE TABLE user(

    id int primary key,
    name varchar(50),
    username VARCHAR(50),
    email varchar(75),
    characterid_fk int,
    foreign key (characterid_fk) references characters(id)
);
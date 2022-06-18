CREATE TABLE users (
	userId varchar(255) PRIMARY KEY NOT NULL,
	email varchar(max) NOT NULL,
	firstname varchar(max) NOT NULL,
	lastname varchar(max) NOT NULL,
	userType int NOT NULL,
	password varchar(max) NOT NULL,
	isDeleted varchar(max) NOT NULL DEFAULT '0',
	CONSTRAINT FK_USER_TYPE FOREIGN KEY (userType) REFERENCES roles(id)
)
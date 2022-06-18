CREATE TABLE permissions (
	id varchar(255) PRIMARY KEY NOT NULL,
	role_id int NOT NULL,
	operation_id int NOT NULL,
	CONSTRAINT FK_ROLE FOREIGN KEY (role_id) REFERENCES roles(id),
	CONSTRAINT FK_OPERATION FOREIGN KEY (operation_id) REFERENCES operations(id)
)
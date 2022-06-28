CREATE TABLE columns (
	 columnId varchar(255) PRIMARY KEY NOT NULL,
	 name varchar(max) NOT NULL,
	 description varchar(max),
	 datatype varchar(max),
	 owner varchar(255),
	 CONSTRAINT FK_COLUMN_TABLE FOREIGN KEY (owner) REFERENCES tables(tableId) ON DELETE CASCADE
)
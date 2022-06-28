CREATE TABLE tableRelationships (
	relationshipId varchar(255) PRIMARY KEY NOT NULL,
	column1 varchar(255) NOT NULL,
	column2 varchar(255) NOT NULL,
	CONSTRAINT FK_COLUMN1 FOREIGN KEY (column1) REFERENCES columns(columnId) ON DELETE CASCADE,
	CONSTRAINT FK_COLUMN2 FOREIGN KEY (column2) REFERENCES columns(columnId),
)
CREATE TABLE tableRelationships (
	relationshipId varchar(255) PRIMARY KEY NOT NULL,
	table1 varchar(255) NOT NULL,
	table2 varchar(255) NOT NULL,
	relationshipType int NOT NULL,
	CONSTRAINT FK_TABLE1 FOREIGN KEY (table1) REFERENCES tables(tableId),
	CONSTRAINT FK_TABLE2 FOREIGN KEY (table2) REFERENCES tables(tableId),
	CONSTRAINT FK_RELATIONSHIP_TYPE FOREIGN KEY (relationshipType) REFERENCES tableRelationshipTypes(typeId)
)
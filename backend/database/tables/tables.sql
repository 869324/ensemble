CREATE TABLE tables (
	tableId varchar(255) PRIMARY KEY NOT NULL,
	name varchar(max) NOT NULL,
	description varchar(max) NOT NULL,
	project varchar(255) NOT NULL,
	CONSTRAINT FK_PROJECT_TABLE FOREIGN KEY (project) REFERENCES projects(projectId) ON DELETE CASCADE
)
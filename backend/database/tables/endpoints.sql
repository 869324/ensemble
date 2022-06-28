CREATE TABLE endpoints (
	endpointId varchar(255) PRIMARY KEY NOT NULL,
	name varchar(max) NOT NULL,
	description varchar(max),
	project varchar(255),
	CONSTRAINT FK_ENDPOINT_PROJECT FOREIGN KEY (project) REFERENCES projects(projectId) ON DELETE CASCADE
)
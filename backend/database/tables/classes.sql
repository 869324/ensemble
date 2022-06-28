CREATE TABLE classes (
	classId varchar(255) PRIMARY KEY NOT NULL,
	name varchar(max) NOT NULL,
	description varchar(max),
	parent varchar(255),
	project varchar(255),
	CONSTRAINT FK_CLASS_PARENT FOREIGN KEY (parent) REFERENCES classes(classId),
	CONSTRAINT FK_CLASS_PROJECT FOREIGN KEY (project) REFERENCES projects(projectId) ON DELETE CASCADE
)
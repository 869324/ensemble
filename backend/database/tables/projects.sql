CREATE TABLE projects (
	projectId varchar(255) PRIMARY KEY NOT NULL,
	name varchar(max) NOT NULL,
	team varchar(255) NOT NULL,
	budget float NOT NULL default 0,
	progress float NOT NULL default 0,
	CONSTRAINT FK_TEAM_PROJECT FOREIGN KEY (team) REFERENCES teams(teamId) ON DELETE CASCADE
)
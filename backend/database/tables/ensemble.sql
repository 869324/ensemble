-- DROP SCHEMA dbo;

CREATE SCHEMA dbo;
-- ensemble.dbo.roles definition

-- Drop table

-- DROP TABLE ensemble.dbo.roles;

CREATE TABLE ensemble.dbo.roles (
	id int IDENTITY(1,1) NOT NULL,
	name varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__roles__3213E83FA778AED2 PRIMARY KEY (id)
);


-- ensemble.dbo.teams definition

-- Drop table

-- DROP TABLE ensemble.dbo.teams;

CREATE TABLE ensemble.dbo.teams (
	teamId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__teams__5ED7536A3A02D296 PRIMARY KEY (teamId)
);


-- ensemble.dbo.meetings definition

-- Drop table

-- DROP TABLE ensemble.dbo.meetings;

CREATE TABLE ensemble.dbo.meetings (
	meetingId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	subject varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	team varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	startTime datetime NULL,
	endTime datetime NULL,
	CONSTRAINT PK__meetings__5C5E6E04C39B7B8E PRIMARY KEY (meetingId),
	CONSTRAINT FK_MEETING_TEAM FOREIGN KEY (team) REFERENCES ensemble.dbo.teams(teamId) ON DELETE CASCADE
);


-- ensemble.dbo.projects definition

-- Drop table

-- DROP TABLE ensemble.dbo.projects;

CREATE TABLE ensemble.dbo.projects (
	projectId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	team varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	budget float DEFAULT 0 NOT NULL,
	progress float DEFAULT 0 NOT NULL,
	CONSTRAINT PK__projects__11F14DA511C78BC0 PRIMARY KEY (projectId),
	CONSTRAINT FK_TEAM_PROJECT FOREIGN KEY (team) REFERENCES ensemble.dbo.teams(teamId) ON DELETE CASCADE
);


-- ensemble.dbo.tables definition

-- Drop table

-- DROP TABLE ensemble.dbo.tables;

CREATE TABLE ensemble.dbo.tables (
	tableId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	description varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	project varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__tables__5408AD9ADBBE0FFE PRIMARY KEY (tableId),
	CONSTRAINT FK_PROJECT_TABLE FOREIGN KEY (project) REFERENCES ensemble.dbo.projects(projectId) ON DELETE CASCADE
);


-- ensemble.dbo.users definition

-- Drop table

-- DROP TABLE ensemble.dbo.users;

CREATE TABLE ensemble.dbo.users (
	userId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	email varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	firstname varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	lastname varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	userType int NOT NULL,
	password varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	isDeleted int DEFAULT 0 NOT NULL,
	configuredPassword int DEFAULT 0 NOT NULL,
	CONSTRAINT PK__users__CB9A1CFF22ADF110 PRIMARY KEY (userId),
	CONSTRAINT FK_USER_TYPE FOREIGN KEY (userType) REFERENCES ensemble.dbo.roles(id)
);


-- ensemble.dbo.classes definition

-- Drop table

-- DROP TABLE ensemble.dbo.classes;

CREATE TABLE ensemble.dbo.classes (
	classId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	description varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	parent varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	project varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__classes__7577347EFC9179C3 PRIMARY KEY (classId),
	CONSTRAINT FK_CLASS_PARENT FOREIGN KEY (parent) REFERENCES ensemble.dbo.classes(classId),
	CONSTRAINT FK_CLASS_PROJECT FOREIGN KEY (project) REFERENCES ensemble.dbo.projects(projectId) ON DELETE CASCADE
);


-- ensemble.dbo.columns definition

-- Drop table

-- DROP TABLE ensemble.dbo.columns;

CREATE TABLE ensemble.dbo.columns (
	columnId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	description varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	datatype varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	owner varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__columns__16A73020142C607F PRIMARY KEY (columnId),
	CONSTRAINT FK_COLUMN_TABLE FOREIGN KEY (owner) REFERENCES ensemble.dbo.tables(tableId) ON DELETE CASCADE
);


-- ensemble.dbo.endpoints definition

-- Drop table

-- DROP TABLE ensemble.dbo.endpoints;

CREATE TABLE ensemble.dbo.endpoints (
	endpointId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	description varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	project varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	url varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__endpoint__5FF6331408AF4099 PRIMARY KEY (endpointId),
	CONSTRAINT FK_ENDPOINT_PROJECT FOREIGN KEY (project) REFERENCES ensemble.dbo.projects(projectId) ON DELETE CASCADE
);


-- ensemble.dbo.messages definition

-- Drop table

-- DROP TABLE ensemble.dbo.messages;

CREATE TABLE ensemble.dbo.messages (
	messageId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[text] text COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	sender varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	team varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	[time] datetime NULL,
	CONSTRAINT PK__messages__4808B993C382EE88 PRIMARY KEY (messageId),
	CONSTRAINT FK_MESSAGE_SENDER FOREIGN KEY (sender) REFERENCES ensemble.dbo.users(userId),
	CONSTRAINT FK_MESSAGE_TEAM FOREIGN KEY (team) REFERENCES ensemble.dbo.teams(teamId) ON DELETE CASCADE
);


-- ensemble.dbo.notes definition

-- Drop table

-- DROP TABLE ensemble.dbo.notes;

CREATE TABLE ensemble.dbo.notes (
	noteId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[text] text COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	parent varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	project varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__notes__03C97EFDCE24C791 PRIMARY KEY (noteId),
	CONSTRAINT FK_NOTE_PARENT FOREIGN KEY (parent) REFERENCES ensemble.dbo.notes(noteId),
	CONSTRAINT FK_NOTE_PROJECT FOREIGN KEY (project) REFERENCES ensemble.dbo.projects(projectId) ON DELETE CASCADE
);


-- ensemble.dbo.tableRelationships definition

-- Drop table

-- DROP TABLE ensemble.dbo.tableRelationships;

CREATE TABLE ensemble.dbo.tableRelationships (
	relationshipId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	column1 varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	column2 varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	owner varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
	CONSTRAINT PK__tableRel__4BCCCED7190A471C PRIMARY KEY (relationshipId),
	CONSTRAINT FK_COLUMN1 FOREIGN KEY (column1) REFERENCES ensemble.dbo.columns(columnId) ON DELETE CASCADE,
	CONSTRAINT FK_COLUMN2 FOREIGN KEY (column2) REFERENCES ensemble.dbo.columns(columnId)
);


-- ensemble.dbo.teamMembers definition

-- Drop table

-- DROP TABLE ensemble.dbo.teamMembers;

CREATE TABLE ensemble.dbo.teamMembers (
	membershipId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	team varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	[member] varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__teamMemb__86AA3B17BDEE95FA PRIMARY KEY (membershipId),
	CONSTRAINT FK_MEMBER FOREIGN KEY ([member]) REFERENCES ensemble.dbo.users(userId) ON DELETE CASCADE,
	CONSTRAINT FK_TEAM FOREIGN KEY (team) REFERENCES ensemble.dbo.teams(teamId) ON DELETE CASCADE
);


-- ensemble.dbo.[attributes] definition

-- Drop table

-- DROP TABLE ensemble.dbo.[attributes];

CREATE TABLE ensemble.dbo.[attributes] (
	attributeId varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	name varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	datatype varchar(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	owner varchar(255) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
	CONSTRAINT PK__attribut__03B803F0B77A03AD PRIMARY KEY (attributeId),
	CONSTRAINT FK_ATTRIBUTE_OWNER FOREIGN KEY (owner) REFERENCES ensemble.dbo.classes(classId) ON DELETE CASCADE
);

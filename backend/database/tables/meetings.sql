CREATE TABLE meetings (
	meetingId varchar(255) PRIMARY KEY NOT NULL,
	subject varchar(255) NOT NULL,
	team varchar(255),
	startTime datetime,
	endTime datetime,
	CONSTRAINT FK_MEETING_TEAM FOREIGN KEY (team) REFERENCES teams(teamId) ON DELETE CASCADE
)
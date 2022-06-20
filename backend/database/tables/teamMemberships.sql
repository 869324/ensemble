CREATE TABLE teamMembers (
	membershipId varchar(255) PRIMARY KEY NOT NULL,
	team varchar(255) NOT NULL,
	member varchar(255) NOT NULL,
	CONSTRAINT FK_TEAM FOREIGN KEY (team) REFERENCES teams(teamId),
	CONSTRAINT FK_MEMBER FOREIGN KEY (member) REFERENCES users(userId),
)
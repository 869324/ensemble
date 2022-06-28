CREATE TABLE messages (
	messageId varchar(255) PRIMARY KEY NOT NULL,
	text TEXT NOT NULL,
	sender varchar(255),
	team varchar(255),
	time datetime,
	CONSTRAINT FK_MESSAGE_SENDER FOREIGN KEY (sender) REFERENCES users(userId),
	CONSTRAINT FK_MESSAGE_TEAM FOREIGN KEY (team) REFERENCES teams(teamId) ON DELETE CASCADE
)
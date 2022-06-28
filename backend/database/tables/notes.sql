CREATE TABLE notes (
	noteId varchar(255) PRIMARY KEY NOT NULL,
	name varchar(max) NOT NULL,
	text text,
	parent varchar(255),
	project varchar(255),
	CONSTRAINT FK_NOTE_PARENT FOREIGN KEY (parent) REFERENCES noteS(noteId),
	CONSTRAINT FK_NOTE_PROJECT FOREIGN KEY (project) REFERENCES projects(projectId) ON DELETE CASCADE
)
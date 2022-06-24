CREATE PROC addProject @projectId varchar(255), @name varchar(max), @team varchar(max), @progress float, @budget float

AS

INSERT INTO projects (projectId, name, team, progress, budget) VALUES (@projectId, @name, @team, @progress, @budget);
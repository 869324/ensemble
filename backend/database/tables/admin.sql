INSERT INTO ensemble.dbo.roles (name) VALUES
	 (N'Admin'),
	 (N'Project Manager'),
	 (N'Team Member');


INSERT INTO ensemble.dbo.users
(userId, email, firstname, lastname, userType, password, isDeleted, configuredPassword)
VALUES('7fbbfca0-7aff-4f79-bf31-5fc56aa750ae', 'deepthi.vangapandu@gmail.com', 'Deepthi', 'Vangapandu', 1, '$2a$10$173S84jNPqHolwfWg7GX1.XDs/DK31woEK9h4NVovnKo/Zz7Dqk9q', 0, 1);

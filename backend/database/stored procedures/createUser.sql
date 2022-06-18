CREATE PROC createUser @userId varchar(max), @email varchar(max), @firstname varchar(max), 
@lastname varchar(max), @userType int, @password varchar(max)

AS

INSERT INTO users (userId, email, firstname, lastname, userType, password)
VALUES (@userId, @email, @firstname, @lastname, @userType, @password);
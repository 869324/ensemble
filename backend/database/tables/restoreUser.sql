CREATE PROC restoreUser @userId varchar(max), @email varchar(max), @firstname varchar(max), 
@lastname varchar(max), @password varchar(max), @userType int

AS

update users set firstname = @firstname, lastname = @lastname, password = @password, userType = @userType, isDeleted = 0, configuredPassword = 0
WHERE userId  = @userId;
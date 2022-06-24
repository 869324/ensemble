CREATE PROC getUsers @userId varchar(255) = null, @name varchar(max) = null, @page int = 1, @size int = 10, 
@order varchar(max) = 'NAME_ASC', @count int output

AS

SELECT userId, email, firstname, lastname

FROM users

WHERE (@userId is null or userId = @userId) AND (@name is null or (email like '%' +@name+ '%' or firstname like '%' +@name+ '%' or lastname like '%' +@name+ '%'))

ORDER BY 
	CASE WHEN @order = 'NAME_ASC' THEN CONCAT(firstname, lastname) END ASC,
	CASE WHEN @order = 'NAME_DESC' THEN CONCAT(firstname, lastname) END DESC

OFFSET (@page - 1) * @size ROWS

FETCH NEXT @size ROWS ONLY

SELECT @count = COUNT(*) from users
WHERE (@userId is null or userId = @userId) AND (@name is null or (email like '%' +@name+ '%' or firstname like '%' +@name+ '%' or lastname like '%' +@name+ '%'));

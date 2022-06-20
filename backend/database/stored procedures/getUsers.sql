CREATE PROC getUsers @userId varchar(255) = null, @name varchar(max) = null, @page int = 1, @size int = 10, 
@order varchar(max) = 'NAME_ASC'

AS

SELECT userId, email, firstname, lastname

FROM users

WHERE (@userId is null or userId = @userId) AND (@name is null or (email like '%' +@name+ '%' or firstname like '%' +@name+ '%' or lastname like '%' +@name+ '%'))

ORDER BY 
	CASE WHEN @order = 'NAME_ASC' THEN firstname END ASC,
	CASE WHEN @order = 'NAME_DESC' THEN firstname END DESC

OFFSET (@page - 1) * @size ROWS

FETCH NEXT @size ROWS ONLY;

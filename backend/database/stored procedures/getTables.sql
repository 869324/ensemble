CREATE PROC getTables @tableId varchar(255) = null, @name varchar(max) = null, @project varchar(255),
@page int = 1, @size int = 10, @order varchar(max) = 'NAME_ASC', @count int output

AS

SELECT * FROM tables

WHERE (@tableId is null or tableId = @tableId) AND (@project is null or project = @project) AND (@name is null or (name like '%' +@name+ '%' or description like '%' +@name+ '%'))

ORDER BY 
	CASE WHEN @order = 'NAME_ASC' THEN name END ASC,
	CASE WHEN @order = 'NAME_DESC' THEN name END DESC

OFFSET (@page - 1) * @size ROWS

FETCH NEXT @size ROWS ONLY

SELECT @count = COUNT(*) from tables 
WHERE (@tableId is null or tableId = @tableId) AND (@project is null or project = @project) AND (@name is null or (name like '%' +@name+ '%' or description like '%' +@name+ '%'))

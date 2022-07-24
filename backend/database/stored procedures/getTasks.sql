CREATE PROC getTasks @taskId varchar(255) = null, @name varchar(max) = null, @project varchar(255),
@page int = 1, @size int = 10, @order varchar(max) = 'NAME_ASC'

AS

SELECT t.*, CONCAT(u.firstname, CONCAT(' ', u.lastname)) as asigneeName FROM tasks t

INNER JOIN users u ON t.asignee = u.userId

WHERE (@taskId is null or taskId = @taskId) AND (@project is null or project = @project) AND (@name is null or (name like '%' +@name+ '%' or description like '%' +@name+ '%'))

ORDER BY done DESC,
	CASE WHEN @order = 'NAME_ASC' THEN name END ASC,
	CASE WHEN @order = 'NAME_DESC' THEN name END DESC

OFFSET (@page - 1) * @size ROWS

FETCH NEXT @size ROWS ONLY

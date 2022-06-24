CREATE PROC getProjects @projectId varchar(255) = null, @name varchar(max) = null, @page int = 1, @size int = 10, 
@order varchar(max) = 'NAME_ASC', @count int output

AS

SELECT * FROM projects

WHERE (@projectId is null or projectId = @projectId) AND (@name is null or name like '%' +@name+ '%')

ORDER BY 
	CASE WHEN @order = 'NAME_ASC' THEN name END ASC,
	CASE WHEN @order = 'NAME_DESC' THEN name END DESC,
	CASE WHEN @order = 'BUDGET_ASC' THEN budget END ASC,
	CASE WHEN @order = 'BUDGET_DESC' THEN budget END DESC,
	CASE WHEN @order = 'PROGRESS_ASC' THEN progress END ASC,
	CASE WHEN @order = 'PROGRESS_DESC' THEN progress END DESC

OFFSET (@page - 1) * @size ROWS

FETCH NEXT @size ROWS ONLY

SELECT @count = COUNT(*) from projects 
WHERE (@projectId is null or projectId = @projectId) AND (@name is null or name like '%' +@name+ '%');

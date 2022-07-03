CREATE PROC getUserProjects @userId varchar(255) = null, @name varchar(max) = null, @page int = 1, @size int = 10, 
@order varchar(max) = 'NAME_ASC'

AS

SELECT p.*, t.name as teamName FROM projects p INNER JOIN teams t ON p.team = t.teamId INNER JOIN teamMembers tm ON t.teamId = tm.team 

WHERE  (@name is null or p.name like '%' +@name+ '%') AND tm.member = @userId

ORDER BY 
	CASE WHEN @order = 'NAME_ASC' THEN p.name END ASC,
	CASE WHEN @order = 'NAME_DESC' THEN p.name END DESC,
	CASE WHEN @order = 'BUDGET_ASC' THEN p.budget END ASC,
	CASE WHEN @order = 'BUDGET_DESC' THEN p.budget END DESC,
	CASE WHEN @order = 'PROGRESS_ASC' THEN p.progress END ASC,
	CASE WHEN @order = 'PROGRESS_DESC' THEN p.progress END DESC

OFFSET (@page - 1) * @size ROWS

FETCH NEXT @size ROWS ONLY



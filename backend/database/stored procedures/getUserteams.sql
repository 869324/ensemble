CREATE PROC getUserTeams @userId varchar(255), @name varchar(max) = null, @page int = 1, @size int = 10, 
@order varchar(max) = 'NAME_ASC'

AS

SELECT t.*, (SELECT  COUNT(*) FROM teamMembers WHERE team = teamId) AS teamSize

FROM teams t INNER JOIN teamMembers tm on t.teamId = tm.team 

WHERE tm.member = @userId AND (@name is null or t.name like '%' +@name+ '%')

ORDER BY 
	CASE WHEN @order = 'NAME_ASC' THEN name END ASC,
	CASE WHEN @order = 'NAME_DESC' THEN name END DESC,
	CASE WHEN @order = 'SIZE_ASC' THEN 1 END ASC,
	CASE WHEN @order = 'SIZE_DESC' THEN 1 END DESC

OFFSET (@page - 1) * @size ROWS

FETCH NEXT @size ROWS ONLY

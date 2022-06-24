CREATE PROC getTeams @teamId varchar(255) = null, @name varchar(max) = null, @page int = 1, @size int = 10, 
@order varchar(max) = 'NAME_ASC', @count int output

AS

SELECT teamId, name, (SELECT  COUNT(*) FROM teamMembers WHERE team = teamId) AS size

FROM teams

WHERE (@teamId is null or teamId = @teamId) AND (@name is null or name like '%' +@name+ '%')

ORDER BY 
	CASE WHEN @order = 'NAME_ASC' THEN name END ASC,
	CASE WHEN @order = 'NAME_DESC' THEN name END DESC

OFFSET (@page - 1) * @size ROWS

FETCH NEXT @size ROWS ONLY

SELECT @count = COUNT(*) from teams WHERE (@teamId is null or teamId = @teamId) AND (@name is null or name like '%' +@name+ '%');

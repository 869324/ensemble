CREATE PROC getNotes @noteId varchar(255) = null, @name varchar(max) = null, @project varchar(255),
@page int = 1, @size int = 10, @order varchar(max) = 'NAME_ASC'

AS

SELECT n.*, p.name as parentName FROM notes n LEFT JOIN notes p

ON n.parent = p.noteId

WHERE (@noteId is null or n.noteId = @noteId) AND (@project is null or n.project = @project) AND (@name is null or (n.name like '%' +@name+ '%' or n.text like '%' +@name+ '%'))

ORDER BY 
	CASE WHEN @order = 'NAME_ASC' THEN n.name END ASC,
	CASE WHEN @order = 'NAME_DESC' THEN n.name END DESC

OFFSET (@page - 1) * @size ROWS

FETCH NEXT @size ROWS ONLY

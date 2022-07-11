package com.ensemble.app.controllers;

import com.ensemble.app.classes.Project;
import com.ensemble.app.classes.Table;
import com.ensemble.app.utils.StoredProcedureCaller;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Controller
@RequestMapping("tables")
@ResponseBody
public class TablesController {

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    StoredProcedureCaller storedProcedureCaller;


    @PostMapping(value = "create",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})

    public Object create(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        Map<String, Object> table = (Map<String, Object>) map.get("table");
        List<Map<String, Object>> columns = (List<Map<String, Object>>)map.get("columns");

        List<Map<String, Object>> existingTables = jdbcTemplate.queryForList("select * from tables where name = '" + table.get("name") +"'" );
        if (existingTables.size() > 0) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            Map<String, Object> res = new HashMap<>();
            res.put("error", "Name already in use!");
            return res;
        }
        else {
            table.put("tableId", UUID.randomUUID().toString());
            int result  = jdbcTemplate.update("insert into tables (tableId, name, description, project) values (?, ? ,? , ?)", table.get("tableId"), table.get("name"), table.get("description"), table.get("project"));
            if (result > 0) {
                for (Map<String, Object> column : columns) {
                    column.put("columnId", UUID.randomUUID().toString());
                    jdbcTemplate.update("insert into columns (columnId, name, description, datatype, owner) values (?, ?, ?, ?, ?)", column.get("columnId"), column.get("name"), column.get("description"), column.get("dataType"), table.get("tableId"));
                }

                response.setStatus(HttpStatus.OK.value());

            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());

            }

        }
        return null;
    }



    @DeleteMapping(value = "delete/{tableId}")
    public Object deleteTable(@PathVariable(value = "tableId") String tableId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from tables where tableId = ?", tableId);

        if (result > 0) {
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }


    @PostMapping(value = "get")
    public Object getTables(@RequestBody Map<String, Object> table, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getTables", table);

        if (!map.isEmpty()){
            return map.get("#result-set-1");
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }

    @PostMapping(value = "getColumns")
    public Object getColumns(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        List<Map<String, Object>> columns = jdbcTemplate.queryForList("select * from columns where owner = ?", map.get("tableId"));

        return  columns;
    }

    @PostMapping(value = "getRelationships")
    public Object getRelationships(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        String query = "select r.relationshipId, r.column1 as sourceColumn, t.name as referenceTable, r.column2 as targetColumn, c.name as targetName from tableRelationships r "+
                "inner join columns c on r.column2 = c.columnId inner join tables t on t.tableId = c.owner "+
                "where r.owner like '%"+map.get("tableId")+"%'";
        List<Map<String, Object>> columns = jdbcTemplate.queryForList(query);

        return  columns;
    }

    @PostMapping(value = "addColumn")
    public Object addColumn(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        String query = "insert into columns (columnId, name, description, datatype, owner) values (?, ?, ?, ?, ?)";
        int result = jdbcTemplate.update(query, UUID.randomUUID().toString(), map.get("name"), map.get("description"), map.get("dataType"), map.get("owner"));
        if (result == 0) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }

    @PostMapping(value = "addRelationship")
    public Object addRelationship(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        String query = "insert into tableRelationships (relationshipId, column1, column2, owner) values (?, ?, ?, ?)";
        String table1 = map.get("tableId").toString();
        String table2 = map.get("referenceTable").toString();
        int result = jdbcTemplate.update(query, UUID.randomUUID().toString(), map.get("sourceColumn"), map.get("targetColumn"), table1+"_"+table2);
        if (result == 0) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }

    @DeleteMapping(value = "deleteColumn/{columnId}")
    public Map<String, Object> deleteColumn(@PathVariable(value = "columnId") String columnId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from columns where columnId = ?", columnId);

        if (result < 1) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }

    @DeleteMapping(value = "deleteRelationship/{relationshipId}")
    public Map<String, Object> deleteRelationship(@PathVariable(value = "relationshipId") String relationshipId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from tableRelationships where relationshipId = ?", relationshipId);

        if (result < 1) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }

    @PutMapping(value = "update")
    public Map<String, Object> update(@RequestBody Table table, HttpServletResponse response) {
        List<Map<String, Object>> existingTables = jdbcTemplate.queryForList("select * from tables where name = '" + table.getName() +"'" );
        if (existingTables.size() > 0 && !existingTables.get(0).get("tableId").toString().equals(table.getTableId()) ) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("Error", "Name is already in use!");
        }
        else {
            int result = jdbcTemplate.update("update tables set name = ?, description = ?, project = ? where tableId = ?", table.getName(), table.getDescription(), table.getProject(), table.getTableId());
            if (result > 0) {
                response.setStatus(HttpStatus.OK.value());
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
            return null;
        }
    }
}

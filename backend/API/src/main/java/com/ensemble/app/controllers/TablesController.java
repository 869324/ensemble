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

    public Map<String, Object> create(@RequestBody Table table, HttpServletResponse response) {
        List<Map<String, Object>> existingTables = jdbcTemplate.queryForList("select * from projects where name = '" + table.getName() +"'" );
        if (existingTables.size() > 0) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            Map<String, Object> res = new HashMap<>();
            res.put("Error", "Name already in use!");
            return res;
        }
        else {
            table.setTableId(UUID.randomUUID().toString());

            Map<String, Object> tableObject = table.getMap();
            int result  = jdbcTemplate.update("insert into tables (tableId, name, description, project) values (?, ? ,? , ?", table.getTableId(), table.getName(), table.getDescription(), table.getProject());
            if (result > 01) {
                return tableObject;
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                return null;
            }

        }
    }



    @DeleteMapping(value = "delete")
    public Map<String, Object> deleteProject(@RequestParam String tableId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from tables where tableId = ?", tableId);

        if (result < 1) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }



    @PostMapping(value = "get")
    public Map<String, Object> getTables(@RequestBody Map<String, Object> table, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getTables", table);

        if (!map.isEmpty()){
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  map;
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

package com.ensemble.app.controllers;

import com.ensemble.app.classes.Table;
import com.ensemble.app.utils.StoredProcedureCaller;
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
@RequestMapping("classes")
@ResponseBody
public class classController {

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    StoredProcedureCaller storedProcedureCaller;


    @PostMapping(value = "create",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})

    public Object create(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        Map<String, Object> classData = (Map<String, Object>) map.get("classData");
        List<Map<String, Object>> attributes = (List<Map<String, Object>>)map.get("attributes");

        List<Map<String, Object>> existingClasses = jdbcTemplate.queryForList("select * from classes where name = '" + classData.get("name") +"'" );
        if (existingClasses.size() > 0) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            Map<String, Object> res = new HashMap<>();
            res.put("error", "Name already in use!");
            return res;
        }
        else {
            classData.put("classId", UUID.randomUUID().toString());
            int result;
            if (classData.get("parent").equals("")){
                result = jdbcTemplate.update("insert into classes (classId, name, description, project) values (?, ? ,? ,? )", classData.get("classId"), classData.get("name"), classData.get("description"), classData.get("project"));
            }else {
                result = jdbcTemplate.update("insert into classes (classId, name, description, parent, project) values (?, ? ,? ,? , ?)", classData.get("classId"), classData.get("name"), classData.get("description"),classData.get("parent"), classData.get("project"));
            }
            if (result > 0) {
                for (Map<String, Object> attribute : attributes) {
                    attribute.put("attributeId", UUID.randomUUID().toString());
                    jdbcTemplate.update("insert into attributes (attributeId, name, datatype, owner) values ( ?, ?, ?, ?)", attribute.get("attributeId"), attribute.get("name"), attribute.get("dataType"), classData.get("classId"));
                }

                response.setStatus(HttpStatus.OK.value());

            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());

            }

        }
        return null;
    }



    @DeleteMapping(value = "delete/{classId}")
    public Object deleteTable(@PathVariable(value = "classId") String classId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from classes where classId = ?", classId);

        if (result > 0) {
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }


    @PostMapping(value = "get")
    public Object getClasses(@RequestBody Map<String, Object> table, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getClasses", table);

        if (!map.isEmpty()){
            return map.get("#result-set-1");
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }

    @PostMapping(value = "getAttributes")
    public Object getAttributes(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        List<Map<String, Object>> attributes = jdbcTemplate.queryForList("select * from attributes where owner = ?", map.get("classId"));

        return  attributes;
    }

    @GetMapping(value = "getChildren/{classId}")
    public Object getChildren(@PathVariable(value = "classId") String classId, HttpServletResponse response) {
        List<Map<String, Object>> children = jdbcTemplate.queryForList("select * from classes where parent = ?", classId);

        return  children;
    }

    @PutMapping(value = "removeChild/{classId}")
    public Object removeChild(@PathVariable(value = "classId") String classId, HttpServletResponse response) {
        int result = jdbcTemplate.update("update classes set parent = ? where classId = ?", null, classId);
        if (result == 0) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }

    @PostMapping(value = "addAttribute")
    public Object addAttribute(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        String query = "insert into attributes (attributeId, name, datatype, owner) values ( ?, ?, ?, ?)";
        int result = jdbcTemplate.update(query, UUID.randomUUID().toString(), map.get("name"), map.get("dataType"), map.get("owner"));
        if (result == 0) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }


    @DeleteMapping(value = "deleteAttribute/{attributeId}")
    public Map<String, Object> deleteAttribute(@PathVariable(value = "attributeId") String attributeId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from attributes where attributeId = ?", attributeId);

        if (result < 1) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }


    @PutMapping(value = "update")
    public Map<String, Object> update(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        List<Map<String, Object>> existingClasses = jdbcTemplate.queryForList("select * from classes where name = ?", map.get("name") );
        if (existingClasses.size() > 0 && !existingClasses.get(0).get("classId").toString().equals(map.get("classId")) ) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("Error", "Name is already in use!");
        }
        else {
            int result = jdbcTemplate.update("update classes set name = ?, description = ?, project = ? where classId = ?", map.get("name"), map.get("description"), map.get("project"), map.get("classId"));
            if (result > 0) {
                response.setStatus(HttpStatus.OK.value());
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
            return null;
        }
    }
}


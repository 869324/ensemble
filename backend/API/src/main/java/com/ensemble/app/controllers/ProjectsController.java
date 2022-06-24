package com.ensemble.app.controllers;

import com.ensemble.app.classes.Project;
import com.ensemble.app.classes.StoredProcedureCaller;
import com.ensemble.app.classes.Team;
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
@RequestMapping("projects")
@ResponseBody
public class ProjectsController {
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    StoredProcedureCaller storedProcedureCaller;
    @Autowired
    ObjectMapper objectMapper;


    @PostMapping(value = "create",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})

    public Map<String, Object> create(@RequestBody Project project, HttpServletResponse response) {
        List<Map<String, Object>> existingProjects = jdbcTemplate.queryForList("select * from projects where name = '" + project.getName() +"'" );
        if (existingProjects.size() > 0) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            Map<String, Object> res = new HashMap<>();
            res.put("Error", "Name already in use!");
            return res;
        }
        else {
            project.setProjectId(UUID.randomUUID().toString());

            Map<String, Object> projectObject = project.getMap();
            Map<String, Object> result  = storedProcedureCaller.call("addProject", projectObject);
            if (result.containsKey("#update-count-1") && (int) result.get("#update-count-1") == 1) {
                return projectObject;
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                return null;
            }

        }
    }



    @DeleteMapping(value = "delete")
    public Map<String, Object> deleteProject(@RequestParam String projectId, HttpServletResponse response) {
        List<Map<String, Object>> existingTables = jdbcTemplate.queryForList("select * from tables where project= ?", projectId);
        List<Map<String, Object>> existingEndpoints = jdbcTemplate.queryForList("select * from endpoints where project= ?", projectId);
        List<Map<String, Object>> existingClasses = jdbcTemplate.queryForList("select * from classes where project= ?", projectId);
        List<Map<String, Object>> existingNotes = jdbcTemplate.queryForList("select * from notes where project= ?", projectId);

        for (Map<String, Object> table : existingTables) {
            Map<String, Object> result = storedProcedureCaller.call("deleteTable", Map.of("tableId", table.get("tableId")));
        }

        for (Map<String, Object> endpoint : existingEndpoints) {
            Map<String, Object> result = storedProcedureCaller.call("deleteEndpoint", Map.of("endpointId", endpoint.get("endpointId")));
        }

        for (Map<String, Object> myClass : existingClasses) {
            Map<String, Object> result = storedProcedureCaller.call("deleteClass", Map.of("classId", myClass.get("classId")));
        }

        for (Map<String, Object> note : existingNotes) {
            Map<String, Object> result = storedProcedureCaller.call("deleteNote", Map.of("noteId", note.get("noteId")));
        }

        int result = jdbcTemplate.update("delete from projects where projectId = ?", projectId);

        if (result < 1) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }



    @PostMapping(value = "get")
    public Map<String, Object> getProjects(@RequestBody Map<String, Object> project, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getProjects", project);

        if (!map.isEmpty()){
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  map;
    }


    @PutMapping(value = "update")
    public Map<String, Object> update(@RequestBody Project project, HttpServletResponse response) {
        List<Map<String, Object>> existingProjects = jdbcTemplate.queryForList("select * from projects where name = '" + project.getName() +"'" );
        if (existingProjects.size() > 0 && !existingProjects.get(0).get("projectId").toString().equals(project.getProjectId()) ) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("Error", "Name is already in use!");
        }
        else {
            int result = jdbcTemplate.update("update teams set name = ?, team = ?, budget = ?, progress = ? where projectId = ?", project.getName(), project.getTeam(), project.getBudget(), project.getProgress(), project.getProjectId());
            if (result > 0) {
                response.setStatus(HttpStatus.OK.value());
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
            return null;
        }
    }


}

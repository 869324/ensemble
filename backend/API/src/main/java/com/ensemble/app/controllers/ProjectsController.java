package com.ensemble.app.controllers;

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

    public Map<String, Object> create(@RequestBody Team team, HttpServletResponse response) {
        List<Map<String, Object>> existingTeams = jdbcTemplate.queryForList("select * from teams where name = '" + team.getName() +"'" );
        if (existingTeams.size() > 0) {
            System.out.println(existingTeams.get(0).get("teamId").toString());
            System.out.println(team.getTeamId());
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            Map<String, Object> res = new HashMap<>();
            res.put("Error", "Name already in use!");
            return res;
        }
        else {
            team.setTeamId(UUID.randomUUID().toString());

            Map<String, Object> teamObject = team.getMap();
            int result = jdbcTemplate.update("insert into teams (teamId, name) values (?, ?)", team.getTeamId(), team.getName());
            if (result > 0) {
                return teamObject;
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                return null;
            }

        }
    }



    @DeleteMapping(value = "delete")
    public Map<String, Object> deleteTeam(@RequestParam String teamId, HttpServletResponse response) {
        int result1 = jdbcTemplate.update("delete from projects where team = ?", teamId);
        int result2 = jdbcTemplate.update("delete from teamMembers where team = ?", teamId);
        int result3 = jdbcTemplate.update("delete from teams where teamId = ?", teamId);

        if (result3 > 0){
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }



    @PostMapping(value = "get")
    public Map<String, Object> getTeams(@RequestBody Map<String, Object> team, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getTeams", team);

        if (!map.isEmpty()){
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  map;
    }


    @PutMapping(value = "update")
    public Map<String, Object> update(@RequestBody Team team, HttpServletResponse response) {
        List<Map<String, Object>> existingTeams = jdbcTemplate.queryForList("select * from teams where name = '" + team.getName() +"'" );
        if (existingTeams.size() > 0 && !existingTeams.get(0).get("teamId").toString().equals(team.getTeamId()) ) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("Error", "Name is already in use!");
        }
        else {
            int result = jdbcTemplate.update("update teams set name = ? where teamId = ?", team.getName(), team.getTeamId());
            if (result > 0) {
                response.setStatus(HttpStatus.OK.value());
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
            return null;
        }
    }


}

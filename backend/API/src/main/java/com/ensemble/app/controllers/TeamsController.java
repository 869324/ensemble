package com.ensemble.app.controllers;

import com.ensemble.app.utils.StoredProcedureCaller;
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
@RequestMapping("teams")
@ResponseBody
public class TeamsController {

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
        List<Map<String, Object>> existingProjects = jdbcTemplate.queryForList("select * from projects where team = ?",teamId);
        if (existingProjects.size() > 0) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("Error", "This team has active projects!");
        }
        else {
            int result = jdbcTemplate.update("delete from teams where teamId = ?", teamId);

            if (result > 0) {
                response.setStatus(HttpStatus.OK.value());
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }


        }
        return null;

    }



    @PostMapping(value = "get")
    public Object getTeams(@RequestBody Map<String, Object> team, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getTeams", team);

        if (!map.isEmpty()){
            return  map.get("#result-set-1");
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }

    @PostMapping(value = "getByUser")
    public Object getUserTeams(@RequestBody Map<String, Object> team, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getUserTeams", team);

        if (!map.isEmpty()){
            return  map.get("#result-set-1");
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
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


    @PostMapping(value = "addMember")
    public Map<String, Object> addMember(@RequestBody Map<String, String> map, HttpServletResponse response) {
        String teamId = map.get("teamId");
        String userId = map.get("userId");

        List<Map<String, Object>> existingMembers = jdbcTemplate.queryForList("select * from teamMembers where membershipId = ?", teamId.concat(userId));
        if (existingMembers.size() > 0) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("Error", "User is already a member!");
        }
        else {
            int result = jdbcTemplate.update("insert into teamMembers (membershipId, team, member) values (?, ?, ?)", teamId.concat(userId), teamId, userId);
            if (result > 0) {
                response.setStatus(HttpStatus.OK.value());
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        }


    return null;
    }

}

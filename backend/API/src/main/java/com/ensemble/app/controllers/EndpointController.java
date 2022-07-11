package com.ensemble.app.controllers;

import com.ensemble.app.classes.Endpoint;
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
@RequestMapping("endpoints")
@ResponseBody
public class EndpointController {

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    StoredProcedureCaller storedProcedureCaller;


    @PostMapping(value = "create",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})

    public Object create(@RequestBody Endpoint endpoint, HttpServletResponse response) {
        List<Map<String, Object>> existingEndpoints = jdbcTemplate.queryForList("select * from endpoints where name = ?", endpoint.getName());

        if (existingEndpoints.size() > 0) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            Map<String, Object> res = new HashMap<>();
            res.put("error", "Name already in use!");
            return res;
        }
        else {

            endpoint.setEndpointId( UUID.randomUUID().toString());
            int result = jdbcTemplate.update("insert into endpoints (endpointId, name, description, url, project) values (?, ? ,? ,?, ? )", endpoint.getEndpointId(), endpoint.getName(), endpoint.getDescription(), endpoint.getUrl(), endpoint.getProject());

            if (result == 0) {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());

            }

        }
        return null;
    }



    @DeleteMapping(value = "delete/{endpointId}")
    public Object deleteEndpoint(@PathVariable(value = "endpointId") String endpointId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from endpoints where endpointId = ?", endpointId);

        if (result == 0) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }


    @PostMapping(value = "get")
    public Object getEndpoints(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        Map<String, Object> data = storedProcedureCaller.call("getEndpoints", map);

        if (!data.isEmpty()){
            return data.get("#result-set-1");
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }

    @PutMapping(value = "update")
    public Map<String, Object> update(@RequestBody Endpoint endpoint, HttpServletResponse response) {
        List<Map<String, Object>> existingEndpoints = jdbcTemplate.queryForList("select * from endpoints where name = ?", endpoint.getName() );
        if (existingEndpoints.size() > 0 && !existingEndpoints.get(0).get("endpointId").toString().equals(endpoint.getEndpointId()) ) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("Error", "Name is already in use!");
        }
        else {
            int result = jdbcTemplate.update("update endpoints set name = ?, description = ?, url = ? where endpointId = ?", endpoint.getName(), endpoint.getDescription(), endpoint.getUrl(), endpoint.getEndpointId());
            if (result < 1) {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
            return null;
        }
    }
}

package com.ensemble.app.controllers;


import com.ensemble.app.classes.Task;
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
@RequestMapping("tasks")
@ResponseBody
public class TasksController {
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    StoredProcedureCaller storedProcedureCaller;


    @PostMapping(value = "create",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})

    public Object create(@RequestBody Task task, HttpServletResponse response) {
        List<Map<String, Object>> existingTasks = jdbcTemplate.queryForList("select * from tasks where name = ?" , task.getName() );
        if (existingTasks.size() > 0) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            Map<String, Object> res = new HashMap<>();
            res.put("error", "Name already in use!");
            return res;
        }
        else {
            task.setTaskId(UUID.randomUUID().toString());
            int result = jdbcTemplate.update("insert into tasks (taskId, name, description, project, asignee, deadline) values (?, ?, ?, ?, ?, ?)", task.getTaskId(), task.getName(), task.getDescription(), task.getProject(), task.getAsignee(), task.getDeadline());

            if (result == 0) {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        }
        return null;
    }


    @DeleteMapping(value = "delete/{taskId}")
    public Object deleteTask(@PathVariable(value = "taskId") String taskId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from tasks where taskId = ?", taskId);

        if (result == 0) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }


    @PostMapping(value = "get")
    public Object getTasks(@RequestBody Map<String, Object> task, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getTasks", task);

        if (!map.isEmpty()){
            return map.get("#result-set-1");
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }


    @PutMapping(value = "update")
    public Map<String, Object> update(@RequestBody Task task, HttpServletResponse response) {
        List<Map<String, Object>> existingTasks = jdbcTemplate.queryForList("select * from tasks where name = ?", task.getName() );
        if (existingTasks.size() > 0 && !existingTasks.get(0).get("taskId").toString().equals(task.getTaskId()) ) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("Error", "Name is already in use!");
        }
        else {
            int result = jdbcTemplate.update("update tasks set name = ?, description = ?, asignee = ?, deadline = ?, done = ? where taskId = ?", task.getName(), task.getDescription(), task.getAsignee(), task.getDeadline(), task.getDone(), task.getTaskId());
            if (result == 0) {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
            return null;
        }
    }

    @PostMapping(value = "askExtension")
    public Object askExtension(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        int result = jdbcTemplate.update("insert into deadlineExtensions (task, time) values (?, ?)", map.get("task"), map.get("deadline"));

        if (result == 0) {
            response.setStatus(HttpStatus.INSUFFICIENT_STORAGE.value());
        }
        return  null;
    }

    @PutMapping(value = "denyExtension")
    public Object denyExtension(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from deadlineExtensions where extensionId = ?", map.get("extensionId"));

        if (result == 0) {
            response.setStatus(HttpStatus.INSUFFICIENT_STORAGE.value());
        }
        return  null;
    }

    @PutMapping(value = "approveExtension")
    public Object approveExtension(@RequestBody Map<String, Object> map, HttpServletResponse response) {
        System.out.println(map);
        int result = jdbcTemplate.update("update tasks set deadline = ? where taskId = ?", map.get("time"), map.get("task"));


        if (result ==0) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        else {
            int result1 = jdbcTemplate.update("delete from deadlineExtensions where extensionId = ?", map.get("extensionId"));
        }
        return  null;
    }

    @GetMapping(value = "getExtensions/{taskId}")
    public Object getExtensions(@PathVariable(value = "taskId") String taskId, HttpServletResponse response) {
        List<Map<String, Object>> exts = jdbcTemplate.queryForList("select * from deadlineExtensions where task = ? and status is null", taskId);
        return  exts;
    }

    @DeleteMapping(value = "deleteExtension/{extId}")
    public Object deleteExtension(@PathVariable(value = "extId") String extId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from deadlineExtensions where extensionId = ?", extId);

        if (result == 0) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }

}

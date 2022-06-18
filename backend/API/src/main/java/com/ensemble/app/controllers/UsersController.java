package com.ensemble.app.controllers;

import com.ensemble.app.classes.StoredProcedureCaller;
import com.ensemble.app.classes.User;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

@Controller
@RequestMapping("users")
@ResponseBody
public class UsersController {

    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    StoredProcedureCaller storedProcedureCaller;

    @GetMapping("login")
    public String login() {
        return "Log";
    }

    @PostMapping(value = "create",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})

    public Map<String, Object> create(@RequestBody User user, HttpServletResponse response) {
        List<Map<String, Object>> existingUsers = jdbcTemplate.queryForList("select * from users where email = '" + user.getEmail() +"'" );
         if (existingUsers.size() > 0) {
             response.setStatus(HttpStatus.BAD_REQUEST.value());
             Map<String, Object> res = new HashMap<>();
             res.put("Error", "Username already in use!");
             return res;
         }
         else {
             user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
             user.setUserId(UUID.randomUUID().toString());
             Map<String, Object> result = storedProcedureCaller.call("createUser", user.getMap());
             if (result.containsKey("#update-count-1") && (int) result.get("#update-count-1") == 1) {
                 user.setPassword("");
                 return user.getMap();
             } else {
                 response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                 return null;
             }
         }
    }
}

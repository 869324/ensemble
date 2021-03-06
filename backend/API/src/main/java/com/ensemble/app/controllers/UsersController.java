package com.ensemble.app.controllers;

import com.ensemble.app.utils.StoredProcedureCaller;
import com.ensemble.app.classes.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("users")
@ResponseBody
public class UsersController {


    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    StoredProcedureCaller storedProcedureCaller;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    JavaMailSender javaMailSender;



    @PostMapping(value = "login",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})

    public Map<String, Object> login(@RequestBody User user, HttpServletResponse response) {
        List<Map<String, Object>> users = jdbcTemplate.queryForList("select * from users where email = ?",user.getEmail());
        if (users.size() < 1){
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            Map<String, Object> res = new HashMap<>();
            res.put("error", "Invalid email!");
            return res;
        }
        else {
            Map<String, Object> existingUser = users.get(0);
            boolean matches = bCryptPasswordEncoder.matches(user.getPassword(), existingUser.get("password").toString());
            if (matches) {
                existingUser.remove("password");
                existingUser.remove("isDeleted");
                return  existingUser;
            }
            else {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                Map<String, Object> res = new HashMap<>();
                res.put("error", "Password is incorrect!");
                return res;
            }
        }
    }


    @PostMapping(value = "create",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})

    public Map<String, Object> create(@RequestBody User user, HttpServletResponse response) {
        List<Map<String, Object>> existingUsers = jdbcTemplate.queryForList("select * from users where email = '" + user.getEmail() +"'" );
         if (existingUsers.size() > 0) {
             response.setStatus(HttpStatus.BAD_REQUEST.value());
             Map<String, Object> res = new HashMap<>();
             res.put("error", "Email already in use!");
             return res;
         }
         else {
             String password = RandomStringUtils.randomAscii(8);
             user.setPassword(bCryptPasswordEncoder.encode(password));
             user.setUserId(UUID.randomUUID().toString());

             Map<String, Object> userObject = user.getMap();
             Map<String, Object> result = storedProcedureCaller.call("createUser", userObject);
             if (result.containsKey("#update-count-1") && (int) result.get("#update-count-1") == 1) {
                  sendSetupEmail(password, user);

                  userObject.remove("password");
                 return userObject;
             } else {
                 response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                 return null;
             }

         }
    }


    @PostMapping(value = "get")
    public Map<String, Object> getUsers(@RequestBody Map<String, Object> user, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getUsers", user);

        if (!map.isEmpty()){
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  map;
    }



    @PutMapping(value = "resetPassword",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public Map<String, Object> resetPassword(@RequestBody User user, HttpServletResponse response) {
        List<Map<String, Object>> users = jdbcTemplate.queryForList("select * from users where email = '"+user.getEmail()+"'");
        if (users.size() < 1){
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            Map<String, Object> res = new HashMap<>();
            res.put("error", "There is no account with such username!");
            return res;
        }
        else {
            String rawPassword = RandomStringUtils.randomAscii(8);
            String password = bCryptPasswordEncoder.encode(rawPassword);
            int result = jdbcTemplate.update("update users set password = ?, configuredPassword = 0 where email = ?", password, user.getEmail());
            if (result > 0) {
                response.setStatus(HttpStatus.OK.value());
                sendResetEmail(rawPassword, user);

            }else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
            return null;
        }
    }


    @PutMapping(value = "configurePassword",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public Map<String, Object> configurePassword(@RequestBody Map<String, Object> user, HttpServletResponse response) {
        List<Map<String, Object>> users = jdbcTemplate.queryForList("select * from users where userId = '"+user.get("userId").toString()+"'");

        Map<String, Object> existingUser = users.get(0);
        if((int) existingUser.get("configuredPassword") == 1){
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("error", "Password already configured");
        }
        else {
            boolean matches = bCryptPasswordEncoder.matches(user.get("oldPassword").toString(), existingUser.get("password").toString());
            if (matches) {
                String password = bCryptPasswordEncoder.encode(user.get("newPassword").toString());
                int result = jdbcTemplate.update("update users set password = ?, configuredPassword = '1' where userId = ?", password, user.get("userId"));
                if (result > 0) {
                    response.setStatus(HttpStatus.OK.value());
                } else {
                    response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                }
                return null;
            } else {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                Map<String, Object> res = new HashMap<>();
                res.put("error", "The old password is incorrect!");
                return res;
            }
        }
    }



    @DeleteMapping(value = "delete/{userId}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public Map<String, Object> deleteUser(@PathVariable(value = "userId") String userId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from users where userId = ?", userId);
        if (result > 0) {
            response.setStatus(HttpStatus.OK.value());
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }



    @PutMapping(value = "update", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public Map<String, Object> update(@RequestBody User user, HttpServletResponse response) {
        List<Map<String, Object>> existingUsers = jdbcTemplate.queryForList("select * from users where email = '" + user.getEmail() +"'" );
        if (existingUsers.size() > 0 && !existingUsers.get(0).get("userId").toString().equals(user.getUserId())) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("error", "Email is already in use!");
        }
        else {
            int result = jdbcTemplate.update("update users set email = ?, firstname = ?, lastname = ?, userType = ? where userId = ?", user.getEmail(), user.getFirstname(), user.getLastname(), user.getUserType(), user.getUserId());
            if (result > 0) {
                response.setStatus(HttpStatus.OK.value());
            } else {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
            return null;
        }
    }



    public void sendSetupEmail(String password, User user) {
        simpleMailMessage.setFrom("Ensemble_Manager");
        simpleMailMessage.setTo(user.getEmail());
        simpleMailMessage.setSubject("Account setup");
        simpleMailMessage.setText(MessageFormat.format("Hello {0} welcome to Ensemble Manager\nYour account has been created; use these credentials to login:\nUsername:  {1}\nPassword:  {2}\nYou will be required to configure your password to your choice once you login.", user.getFirstname(), user.getEmail(), password));
        javaMailSender.send(simpleMailMessage);
    }

    public void sendResetEmail(String password, User user) {
        simpleMailMessage.setFrom("Ensemble_Manager");
        simpleMailMessage.setTo(user.getEmail());
        simpleMailMessage.setSubject("Account password reset");
        simpleMailMessage.setText(MessageFormat.format("Your password for Ensemble Manager has been reset to: {0}\nYou will be required to configure your password to your choice once you login.", password));
        javaMailSender.send(simpleMailMessage);
    }
}



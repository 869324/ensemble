package com.ensemble.app.classes;


import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class User {

    private String userId, email, firstname, lastname, password;
    private int userType, isDeleted, configuredPassword;

    public User(){}

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }

    public int getUserType() {
        return userType;
    }

    public void setUserType(int userType) {
        this.userType = userType;
    }

    public int getConfiguredPassword() {
        return configuredPassword;
    }

    public void setConfiguredPassword(int configuredPassword) {
        this.configuredPassword = configuredPassword;
    }

    public Map<String, Object> getMap() {
        Map<String, Object> map = new HashMap<>();

        map.put("userId", userId);
        map.put("email", email);
        map.put("firstname", firstname);
        map.put("lastname", lastname);
        map.put("userType", userType);
        map.put("password", password);

        return map;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId='" + userId + '\'' +
                ", email='" + email + '\'' +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", password='" + password + '\'' +
                ", isDeleted='" + isDeleted + '\'' +
                ", userType=" + userType +
                '}';
    }
}

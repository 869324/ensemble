package com.ensemble.app.classes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class StoredProcedureCaller {

    @Autowired
    JdbcTemplate jdbcTemplate;
    public StoredProcedureCaller(){}

    public Map<String, Object> call(String procedure, Map<String, Object> inputs) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate).withProcedureName(procedure);

        SqlParameterSource params = new MapSqlParameterSource(inputs);

        return simpleJdbcCall.execute(params);
    }


}

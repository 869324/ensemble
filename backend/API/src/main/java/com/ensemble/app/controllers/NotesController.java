package com.ensemble.app.controllers;

import com.ensemble.app.classes.Note;
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
@RequestMapping("notes")
@ResponseBody
public class NotesController {

    @Autowired
    JdbcTemplate jdbcTemplate;
    @Autowired
    StoredProcedureCaller storedProcedureCaller;


    @PostMapping(value = "create",
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})

    public Object create(@RequestBody Note note, HttpServletResponse response) {
        List<Map<String, Object>> existingNotes = jdbcTemplate.queryForList("select * from notes where name = ?" , note.getName() );
        if (existingNotes.size() > 0) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            Map<String, Object> res = new HashMap<>();
            res.put("error", "Name already in use!");
            return res;
        }
        else {
            note.setNoteId(UUID.randomUUID().toString());
            int result;
            if (note.getParent().equals("")){
                result = jdbcTemplate.update("insert into notes (noteId, name, text, project) values (?, ? ,? ,? )", note.getNoteId(), note.getName(), note.getText(), note.getProject());
            }else {
                result = jdbcTemplate.update("insert into notes (noteId, name, text, parent, project) values (?, ?, ?, ?, ?)", note.getNoteId(), note.getName(), note.getText(), note.getParent(), note.getProject());
            }
            if (result == 0) {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
        }
        return null;
    }


    @DeleteMapping(value = "delete/{noteId}")
    public Object deleteNote(@PathVariable(value = "noteId") String noteId, HttpServletResponse response) {
        int result = jdbcTemplate.update("delete from notes where noteId = ?", noteId);

        if (result == 0) {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return null;
    }


    @PostMapping(value = "get")
    public Object getNotes(@RequestBody Map<String, Object> note, HttpServletResponse response) {
        Map<String, Object> map = storedProcedureCaller.call("getNotes", note);

        if (!map.isEmpty()){
            return map.get("#result-set-1");
        } else {
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
        }
        return  null;
    }


    @PutMapping(value = "update")
    public Map<String, Object> update(@RequestBody Note note, HttpServletResponse response) {
        List<Map<String, Object>> existingNotes = jdbcTemplate.queryForList("select * from notes where name = ?", note.getName() );
        if (existingNotes.size() > 0 && !existingNotes.get(0).get("noteId").toString().equals(note.getNoteId()) ) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            return Map.of("Error", "Name is already in use!");
        }
        else {
            String parent = note.getParent() == null ? null : note.getParent().equals("") ? null : note.getParent();
            int result = jdbcTemplate.update("update notes set name = ?, text = ?, parent = ? where noteId = ?", note.getName(), note.getText(), parent, note.getNoteId());
            if (result == 0) {
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            }
            return null;
        }
    }
}

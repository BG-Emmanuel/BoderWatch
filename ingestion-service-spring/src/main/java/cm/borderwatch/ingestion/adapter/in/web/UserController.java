package cm.borderwatch.ingestion.adapter.in.web;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/v1/users") @RequiredArgsConstructor
public class UserController {
    private final JdbcTemplate    jdbc;
    private final PasswordEncoder encoder;

    @Data public static class CreateUserRequest {
        private String username,email,password,fullName,role;
    }

    @GetMapping @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> list() {
        return ResponseEntity.ok(Map.of("users",jdbc.queryForList("SELECT id,username,email,full_name,role,is_active,last_login,created_at FROM users ORDER BY created_at DESC")));
    }

    @PostMapping @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody CreateUserRequest req) {
        try {
            String id=UUID.randomUUID().toString();
            jdbc.update("INSERT INTO users(id,username,email,password_hash,full_name,role) VALUES(?,?,?,?,?,?)",
                id,req.getUsername(),req.getEmail(),encoder.encode(req.getPassword()),req.getFullName(),req.getRole());
            return ResponseEntity.status(201).body(Map.of("id",id,"username",req.getUsername()));
        } catch(Exception e){ return ResponseEntity.status(400).body(Map.of("error",e.getMessage())); }
    }

    @PutMapping("/{id}/deactivate") @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivate(@PathVariable String id) {
        jdbc.update("UPDATE users SET is_active=FALSE WHERE id=?",id);
        return ResponseEntity.ok(Map.of("message","User deactivated"));
    }

    @PutMapping("/{id}/activate") @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activate(@PathVariable String id) {
        jdbc.update("UPDATE users SET is_active=TRUE WHERE id=?",id);
        return ResponseEntity.ok(Map.of("message","User activated"));
    }
}

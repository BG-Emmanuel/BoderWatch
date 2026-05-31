package cm.borderwatch.ingestion.adapter.in.web;
import cm.borderwatch.ingestion.config.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;

@RestController @RequestMapping("/api/v1/auth") @RequiredArgsConstructor @Slf4j
public class AuthController {
    private final JwtUtils        jwt;
    private final JdbcTemplate    jdbc;
    private final PasswordEncoder encoder;

    @Data public static class LoginRequest { private String username; private String password; }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            var rows = jdbc.queryForList("SELECT id,username,password_hash,role,full_name,is_active FROM users WHERE username=?",req.getUsername());
            if (rows.isEmpty()) return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
            var u = rows.get(0);
            if (!(Boolean)u.get("is_active")) return ResponseEntity.status(403).body(Map.of("error","Account disabled"));
            if (!encoder.matches(req.getPassword(),(String)u.get("password_hash"))) return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
            String id=(String)u.get("id"), username=(String)u.get("username"), role=(String)u.get("role"), name=(String)u.get("full_name");
            String token = jwt.generateToken(username,role,id);
            jdbc.update("UPDATE users SET last_login=NOW() WHERE id=?",id);
            log.info("Login: user={} role={}",username,role);
            return ResponseEntity.ok(Map.of("accessToken",token,"tokenType","Bearer","expiresIn",86400,"user",Map.of("id",id,"username",username,"fullName",name,"role",role)));
        } catch(Exception e){ log.error("Login error: {}",e.getMessage()); return ResponseEntity.status(500).body(Map.of("error","Authentication error")); }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        if (h==null||!h.startsWith("Bearer ")) return ResponseEntity.status(401).body(Map.of("error","No token"));
        try {
            String username = jwt.extractUsername(h.substring(7));
            var rows = jdbc.queryForList("SELECT id,username,email,full_name,role,last_login,created_at FROM users WHERE username=?",username);
            return rows.isEmpty()?ResponseEntity.status(404).body(Map.of("error","Not found")):ResponseEntity.ok(rows.get(0));
        } catch(Exception e){ return ResponseEntity.status(401).body(Map.of("error","Invalid token")); }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody(required=false) Map<String,String> body) {
        return ResponseEntity.ok(Map.of("message","Logged out"));
    }
}

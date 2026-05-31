package cm.borderwatch.ingestion.config;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {
    @Value("${jwt.secret:borderwatch-secret-key-change-in-production-min-256-bits}") private String secret;
    @Value("${jwt.expiration-ms:86400000}") private long expirationMs;
    private SecretKey key() { return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }
    public String generateToken(String user, String role, String uid) {
        return Jwts.builder().subject(user).claim("role",role).claim("userId",uid)
            .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+expirationMs))
            .signWith(key()).compact();
    }
    public Claims validateToken(String token) { return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload(); }
    public String extractUsername(String token) { return validateToken(token).getSubject(); }
}

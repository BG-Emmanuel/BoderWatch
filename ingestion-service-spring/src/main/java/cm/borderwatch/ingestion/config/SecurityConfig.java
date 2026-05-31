package cm.borderwatch.ingestion.config;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Configuration @EnableWebSecurity @EnableMethodSecurity @RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;

    @Bean public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(c->c.disable())
            .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a->a
                .requestMatchers("/health","/actuator/health").permitAll()
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/api/v1/telemetry","/api/v1/telemetry/batch").hasAnyRole("BEACON","ADMIN","OFFICER")
                .requestMatchers("/api/v1/trucks/**").hasAnyRole("OFFICER","DIRECTOR","ADMIN","OPS")
                .requestMatchers("/api/v1/users/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(12); }
    @Bean public AuthenticationManager authManager(AuthenticationConfiguration c) throws Exception { return c.getAuthenticationManager(); }
}

@Component @RequiredArgsConstructor @Slf4j
class JwtFilter extends OncePerRequestFilter {
    private final JwtUtils jwtUtils;
    @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws java.io.IOException, jakarta.servlet.ServletException {
        String apiKey=req.getHeader("X-API-Key");
        if (apiKey!=null&&!apiKey.isBlank()) {
            var auth=new UsernamePasswordAuthenticationToken("beacon",null,List.of(new SimpleGrantedAuthority("ROLE_BEACON")));
            SecurityContextHolder.getContext().setAuthentication(auth);
            chain.doFilter(req,res); return;
        }
        String h=req.getHeader("Authorization");
        if (h!=null&&h.startsWith("Bearer ")) {
            try {
                var claims=jwtUtils.validateToken(h.substring(7));
                var auth=new UsernamePasswordAuthenticationToken(claims.getSubject(),null,
                    List.of(new SimpleGrantedAuthority((String)claims.get("role"))));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch(JwtException e) {
                res.setStatus(401); res.setContentType("application/json");
                res.getWriter().write("{\"error\":\"Invalid or expired token\"}"); return;
            }
        }
        chain.doFilter(req,res);
    }
}

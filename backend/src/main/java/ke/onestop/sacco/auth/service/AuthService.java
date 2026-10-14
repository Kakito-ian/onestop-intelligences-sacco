package ke.onestop.sacco.auth.service;

import ke.onestop.sacco.auth.dto.AuthResponse;
import ke.onestop.sacco.auth.dto.LoginRequest;
import ke.onestop.sacco.auth.entity.User;
import ke.onestop.sacco.auth.repository.UserRepository;
import ke.onestop.sacco.common.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    /**
     * Authenticate staff credentials and return JWT tokens.
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Throws BadCredentialsException (handled globally) if invalid
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(), request.password()));

        User user = userRepository.findByUsername(request.username())
                .orElseThrow();   // Already passed auth — safe to call

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        return buildResponse(user);
    }

    /**
     * Issue a new access token from a valid refresh token.
     */
    @Transactional(readOnly = true)
    public AuthResponse refresh(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (jwtService.isTokenExpired(refreshToken)) {
            throw new IllegalArgumentException("Refresh token has expired. Please sign in again.");
        }

        return buildResponse(user);
    }

    // ─────────────────────────────────────────────────────────────────────────

    private AuthResponse buildResponse(User user) {
        String access  = jwtService.generateToken(user);
        String refresh = jwtService.generateRefreshToken(user);

        return new AuthResponse(
                access,
                refresh,
                new AuthResponse.UserInfo(
                        user.getId(),
                        user.getUsername(),
                        user.getFullName(),
                        user.getRole(),
                        user.getTenantId()
                )
        );
    }
}

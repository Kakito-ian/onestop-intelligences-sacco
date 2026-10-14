package ke.onestop.sacco.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ke.onestop.sacco.auth.dto.AuthResponse;
import ke.onestop.sacco.auth.dto.LoginRequest;
import ke.onestop.sacco.auth.dto.RefreshRequest;
import ke.onestop.sacco.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Login and token refresh for staff users")
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/login
     * Accepts member number or username + password.
     * Returns access token (1 h) and refresh token (7 d).
     */
    @Operation(summary = "Staff login — returns JWT access and refresh tokens")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * POST /api/auth/refresh
     * Returns a new access token when the refresh token is still valid.
     */
    @Operation(summary = "Refresh access token using a valid refresh token")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request.refreshToken()));
    }
}

package ke.onestop.sacco.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** Request body for POST /auth/login */
public record LoginRequest(
        @NotBlank(message = "Username is required")
        String username,

        @NotBlank(message = "Password is required")
        String password
) {}

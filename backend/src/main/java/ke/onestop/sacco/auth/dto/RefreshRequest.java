package ke.onestop.sacco.auth.dto;

import jakarta.validation.constraints.NotBlank;

/** Request body for POST /auth/refresh */
public record RefreshRequest(
        @NotBlank(message = "Refresh token is required")
        String refreshToken
) {}

package ke.onestop.sacco.auth.dto;

import ke.onestop.sacco.auth.entity.Role;

import java.util.UUID;

/** Response body for successful login or token refresh */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserInfo user
) {
    public record UserInfo(
            UUID   id,
            String username,
            String fullName,
            Role   role,
            String tenantId
    ) {}
}

package ke.onestop.sacco.common.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * JWT configuration properties.
 * Values are bound from the {@code onestop.jwt.*} namespace in application.yml.
 *
 * The secret must be a Base64-encoded string of at least 256 bits.
 * Generate one with:  {@code openssl rand -base64 64}
 */
@Data
@ConfigurationProperties(prefix = "onestop.jwt")
public class JwtProperties {

    /** Base64-encoded HMAC-SHA signing secret. Required. */
    private String secret;

    /** How long an access token lives, in minutes. Default: 60 */
    private long expiryMinutes = 60;

    /** How long a refresh token lives, in days. Default: 7 */
    private long refreshExpiryDays = 7;
}

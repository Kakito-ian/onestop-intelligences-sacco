package ke.onestop.sacco.common.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "onestop.cors")
public class OnestopCorsProperties {
    private String allowedOrigins = "http://localhost:3000";
}

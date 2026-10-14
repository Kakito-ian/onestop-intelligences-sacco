package ke.onestop.sacco.auth.repository;

import ke.onestop.sacco.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /** Used by Spring Security to load a user by username (any tenant). */
    Optional<User> findByUsername(String username);

    /** Tenant-scoped lookup — prefer this in application code. */
    Optional<User> findByTenantIdAndUsername(String tenantId, String username);

    Optional<User> findByTenantIdAndEmail(String tenantId, String email);

    boolean existsByTenantIdAndUsername(String tenantId, String username);

    boolean existsByTenantIdAndEmail(String tenantId, String email);
}

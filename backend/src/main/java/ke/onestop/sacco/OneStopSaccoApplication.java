package ke.onestop.sacco;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * OneStop Intelligent SACCO — backend entry point.
 *
 * Package layout:
 *   ke.onestop.sacco.auth            – JWT auth, user management
 *   ke.onestop.sacco.member          – member records
 *   ke.onestop.sacco.banking         – savings, shares, ledger, transactions
 *   ke.onestop.sacco.loans           – loan lifecycle, guarantors, repayments
 *   ke.onestop.sacco.reconciliation  – import, matching, exception queue
 *   ke.onestop.sacco.crm             – cases, tasks, interaction history
 *   ke.onestop.sacco.insurance       – policy register, renewals, claims
 *   ke.onestop.sacco.admin           – tenants, roles, branches, config
 *   ke.onestop.sacco.notification    – SMS / email
 *   ke.onestop.sacco.reporting       – dashboards, exports
 *   ke.onestop.sacco.common          – security, audit, exceptions, utils
 */
@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
@EnableScheduling
@ConfigurationPropertiesScan
public class OneStopSaccoApplication {

    public static void main(String[] args) {
        SpringApplication.run(OneStopSaccoApplication.class, args);
    }
}

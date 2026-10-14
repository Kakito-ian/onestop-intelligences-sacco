package ke.onestop.sacco.auth.entity;

/**
 * Staff roles in the OneStop SACCO platform.
 * Maps to the {@code role} column in the {@code users} table.
 */
public enum Role {

    /** Full system access — can manage users, tenants, and all modules */
    ADMIN,

    /** Branch or department manager — approve loans, view all reports */
    MANAGER,

    /** Handles loan applications, guarantor decisions, repayment schedules */
    LOAN_OFFICER,

    /** Handles counter transactions, deposits, and withdrawals */
    TELLER,

    /** Posts reconciled entries, manages ledger, runs reports */
    ACCOUNTANT,

    /** Read-only access to reports and audit trails */
    AUDITOR
}

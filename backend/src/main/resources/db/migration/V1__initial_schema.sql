-- ============================================================================
-- V1__initial_schema.sql
-- OneStop Intelligent SACCO — initial database schema
-- ============================================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Tenants (SACCO organisations) ────────────────────────────────────────────
CREATE TABLE tenants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(30)  NOT NULL UNIQUE,
    name        VARCHAR(200) NOT NULL,
    country     VARCHAR(3)   NOT NULL DEFAULT 'KE',
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Users (staff who log in) ──────────────────────────────────────────────────
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID         NOT NULL REFERENCES tenants(id),
    username        VARCHAR(100) NOT NULL,
    email           VARCHAR(200) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(200) NOT NULL,
    role            VARCHAR(50)  NOT NULL,   -- ADMIN | MANAGER | LOAN_OFFICER | TELLER | ACCOUNTANT | AUDITOR
    active          BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100),
    UNIQUE (tenant_id, username),
    UNIQUE (tenant_id, email)
);

-- ── Members ───────────────────────────────────────────────────────────────────
CREATE TABLE members (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID         NOT NULL REFERENCES tenants(id),
    member_number       VARCHAR(30)  NOT NULL,
    full_name           VARCHAR(200) NOT NULL,
    id_number           VARCHAR(50),
    phone               VARCHAR(20),
    email               VARCHAR(200),
    date_of_birth       DATE,
    gender              VARCHAR(10),
    status              VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',   -- ACTIVE | INACTIVE | SUSPENDED
    join_date           DATE         NOT NULL DEFAULT CURRENT_DATE,
    branch_id           UUID,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    UNIQUE (tenant_id, member_number)
);

-- ── Accounts ──────────────────────────────────────────────────────────────────
CREATE TABLE accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    member_id       UUID            NOT NULL REFERENCES members(id),
    account_number  VARCHAR(30)     NOT NULL,
    account_type    VARCHAR(20)     NOT NULL,   -- SAVINGS | SHARES
    balance         NUMERIC(18,2)   NOT NULL DEFAULT 0,
    currency        VARCHAR(3)      NOT NULL DEFAULT 'KES',
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',
    opened_date     DATE            NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100),
    UNIQUE (tenant_id, account_number)
);

-- ── Ledger entries (double-entry, immutable) ──────────────────────────────────
CREATE TABLE ledger_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    entry_date      DATE            NOT NULL,
    description     VARCHAR(500)    NOT NULL,
    reference       VARCHAR(100),
    debit_account   VARCHAR(30)     NOT NULL,
    credit_account  VARCHAR(30)     NOT NULL,
    amount          NUMERIC(18,2)   NOT NULL CHECK (amount > 0),
    posted_by       VARCHAR(100)    NOT NULL,
    reversal_of     UUID            REFERENCES ledger_entries(id),
    reversed_by     UUID            REFERENCES ledger_entries(id),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Transactions (member-facing view of ledger) ───────────────────────────────
CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    account_id      UUID            NOT NULL REFERENCES accounts(id),
    ledger_entry_id UUID            NOT NULL REFERENCES ledger_entries(id),
    txn_type        VARCHAR(30)     NOT NULL,   -- DEPOSIT | WITHDRAWAL | DIVIDEND | FEE | TRANSFER
    amount          NUMERIC(18,2)   NOT NULL,   -- positive = credit, negative = debit
    balance_after   NUMERIC(18,2)   NOT NULL,
    description     VARCHAR(500),
    reference       VARCHAR(100),
    mpesa_ref       VARCHAR(50),
    txn_date        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Loans ─────────────────────────────────────────────────────────────────────
CREATE TABLE loans (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID            NOT NULL REFERENCES tenants(id),
    member_id           UUID            NOT NULL REFERENCES members(id),
    loan_number         VARCHAR(30)     NOT NULL,
    purpose             VARCHAR(200),
    principal           NUMERIC(18,2)   NOT NULL CHECK (principal > 0),
    term_months         INTEGER         NOT NULL,
    annual_rate         NUMERIC(6,4)    NOT NULL,
    disbursed_amount    NUMERIC(18,2),
    outstanding_balance NUMERIC(18,2)   NOT NULL DEFAULT 0,
    status              VARCHAR(30)     NOT NULL DEFAULT 'PENDING',
    -- PENDING | UNDER_REVIEW | APPROVED | DISBURSED | ACTIVE | CLOSED | REJECTED | WRITTEN_OFF
    applied_date        DATE            NOT NULL DEFAULT CURRENT_DATE,
    approved_date       DATE,
    disbursed_date      DATE,
    closed_date         DATE,
    next_due_date       DATE,
    approved_by         VARCHAR(100),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_by          VARCHAR(100),
    updated_by          VARCHAR(100),
    UNIQUE (tenant_id, loan_number)
);

-- ── Guarantors ────────────────────────────────────────────────────────────────
CREATE TABLE loan_guarantors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    loan_id         UUID            NOT NULL REFERENCES loans(id),
    guarantor_id    UUID            NOT NULL REFERENCES members(id),
    guarantee_amount NUMERIC(18,2)  NOT NULL,
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDING',  -- PENDING | APPROVED | DECLINED
    decided_at      TIMESTAMPTZ,
    decided_by      VARCHAR(100),
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Loan repayment schedule ───────────────────────────────────────────────────
CREATE TABLE repayment_schedule (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    loan_id         UUID            NOT NULL REFERENCES loans(id),
    instalment_no   INTEGER         NOT NULL,
    due_date        DATE            NOT NULL,
    principal_due   NUMERIC(18,2)   NOT NULL,
    interest_due    NUMERIC(18,2)   NOT NULL,
    total_due       NUMERIC(18,2)   NOT NULL,
    paid_amount     NUMERIC(18,2)   NOT NULL DEFAULT 0,
    status          VARCHAR(20)     NOT NULL DEFAULT 'PENDING',  -- PENDING | PAID | PARTIAL | OVERDUE
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Reconciliation imports ────────────────────────────────────────────────────
CREATE TABLE recon_imports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    file_name       VARCHAR(300)    NOT NULL,
    source          VARCHAR(50)     NOT NULL,   -- MPESA | BANK | MANUAL
    imported_by     VARCHAR(100)    NOT NULL,
    imported_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    total_rows      INTEGER         NOT NULL DEFAULT 0,
    matched_rows    INTEGER         NOT NULL DEFAULT 0,
    exception_rows  INTEGER         NOT NULL DEFAULT 0,
    status          VARCHAR(20)     NOT NULL DEFAULT 'PROCESSING'
);

-- ── Reconciliation rows ───────────────────────────────────────────────────────
CREATE TABLE recon_rows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    import_id       UUID            NOT NULL REFERENCES recon_imports(id),
    external_ref    VARCHAR(100),
    amount          NUMERIC(18,2)   NOT NULL,
    txn_date        DATE            NOT NULL,
    description     VARCHAR(500),
    status          VARCHAR(20)     NOT NULL DEFAULT 'UNMATCHED', -- MATCHED | UNMATCHED | EXCEPTION | RESOLVED | DUPLICATE
    matched_txn_id  UUID            REFERENCES transactions(id),
    exception_reason VARCHAR(500),
    owner           VARCHAR(100),
    resolved_by     VARCHAR(100),
    resolved_at     TIMESTAMPTZ,
    resolution_note TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── CRM: Cases ────────────────────────────────────────────────────────────────
CREATE TABLE crm_cases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    case_number     VARCHAR(30)     NOT NULL,
    member_id       UUID            REFERENCES members(id),
    category        VARCHAR(50)     NOT NULL,   -- COMPLAINT | INQUIRY | SERVICE_REQUEST | FEEDBACK
    subject         VARCHAR(300)    NOT NULL,
    description     TEXT,
    priority        VARCHAR(20)     NOT NULL DEFAULT 'NORMAL',  -- LOW | NORMAL | HIGH | URGENT
    status          VARCHAR(30)     NOT NULL DEFAULT 'OPEN',    -- OPEN | IN_PROGRESS | PENDING_MEMBER | RESOLVED | CLOSED
    owner           VARCHAR(100),
    due_date        DATE,
    resolved_at     TIMESTAMPTZ,
    resolution_note TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100),
    UNIQUE (tenant_id, case_number)
);

-- ── CRM: Case actions (audit trail) ──────────────────────────────────────────
CREATE TABLE crm_case_actions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID            NOT NULL REFERENCES tenants(id),
    case_id     UUID            NOT NULL REFERENCES crm_cases(id),
    action_type VARCHAR(50)     NOT NULL,
    note        TEXT,
    actor       VARCHAR(100)    NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Insurance: Policies ───────────────────────────────────────────────────────
CREATE TABLE insurance_policies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    member_id       UUID            NOT NULL REFERENCES members(id),
    loan_id         UUID            REFERENCES loans(id),
    policy_ref      VARCHAR(100)    NOT NULL,
    insurer         VARCHAR(200)    NOT NULL,
    cover_type      VARCHAR(100)    NOT NULL,
    start_date      DATE            NOT NULL,
    end_date        DATE            NOT NULL,
    premium_amount  NUMERIC(18,2),
    status          VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE | LAPSED | CANCELLED | CLAIMED
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    created_by      VARCHAR(100),
    updated_by      VARCHAR(100)
);

-- ── Insurance: Claims ─────────────────────────────────────────────────────────
CREATE TABLE insurance_claims (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID            NOT NULL REFERENCES tenants(id),
    policy_id       UUID            NOT NULL REFERENCES insurance_policies(id),
    claim_ref       VARCHAR(100),
    submitted_date  DATE            NOT NULL,
    status          VARCHAR(30)     NOT NULL DEFAULT 'SUBMITTED',
    -- SUBMITTED | UNDER_REVIEW | APPROVED | REJECTED | PAID
    amount_claimed  NUMERIC(18,2),
    amount_paid     NUMERIC(18,2),
    notes           TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX idx_members_tenant         ON members(tenant_id);
CREATE INDEX idx_accounts_member        ON accounts(member_id);
CREATE INDEX idx_transactions_account   ON transactions(account_id);
CREATE INDEX idx_loans_member           ON loans(member_id);
CREATE INDEX idx_loans_status           ON loans(status);
CREATE INDEX idx_recon_rows_import      ON recon_rows(import_id);
CREATE INDEX idx_recon_rows_status      ON recon_rows(status);
CREATE INDEX idx_crm_cases_member       ON crm_cases(member_id);
CREATE INDEX idx_crm_cases_status       ON crm_cases(status);
CREATE INDEX idx_insurance_member       ON insurance_policies(member_id);
CREATE INDEX idx_insurance_end_date     ON insurance_policies(end_date);

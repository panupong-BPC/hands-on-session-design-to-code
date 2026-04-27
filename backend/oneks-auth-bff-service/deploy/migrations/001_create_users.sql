-- Create USERS table for authentication
CREATE TABLE IF NOT EXISTS "USERS" (
    "ID"            BIGSERIAL       PRIMARY KEY,
    "USER_ID"       VARCHAR(50)     NOT NULL UNIQUE,
    "PASSWORD_HASH" VARCHAR(255)    NOT NULL,
    "FULL_NAME"     VARCHAR(200)    NOT NULL,
    "ROLE"          VARCHAR(50)     NOT NULL DEFAULT 'user',
    "BRANCH_CODE"   VARCHAR(20)     NOT NULL DEFAULT '',
    "BRANCH_NAME"   VARCHAR(200)    NOT NULL DEFAULT '',
    "IS_ACTIVE"     BOOLEAN         NOT NULL DEFAULT TRUE,
    "CREATED_AT"    TIMESTAMP       NOT NULL DEFAULT NOW(),
    "UPDATED_AT"    TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by USER_ID
CREATE INDEX IF NOT EXISTS idx_users_user_id ON "USERS" ("USER_ID");

-- Seed a test user (password: "password123" hashed with bcrypt)
-- Generate with: echo -n "password123" | htpasswd -bnBC 10 "" - | tr -d ':\n' | sed 's/$2y/$2a/'
INSERT INTO "USERS" ("USER_ID", "PASSWORD_HASH", "FULL_NAME", "ROLE", "BRANCH_CODE", "BRANCH_NAME")
VALUES (
    'admin',
    'admin',
    'System Administrator',
    'admin',
    'HQ001',
    'Head Office'
) ON CONFLICT ("USER_ID") DO NOTHING;

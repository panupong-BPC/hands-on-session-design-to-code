package model

import "time"

// UserEntity represents a user record in the database.
type UserEntity struct {
	ID           int64     `db:"ID"`
	UserID       string    `db:"USER_ID"`
	PasswordHash string    `db:"PASSWORD_HASH"`
	FullName     string    `db:"FULL_NAME"`
	Role         string    `db:"ROLE"`
	BranchCode   string    `db:"BRANCH_CODE"`
	BranchName   string    `db:"BRANCH_NAME"`
	IsActive     bool      `db:"IS_ACTIVE"`
	CreatedAt    time.Time `db:"CREATED_AT"`
	UpdatedAt    time.Time `db:"UPDATED_AT"`
}

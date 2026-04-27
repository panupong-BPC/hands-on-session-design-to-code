package repository

import (
	"context"
	"database/sql"

	"oneks-auth-bff-service/internal/model"
)

type UserRepository interface {
	FindByUserID(ctx context.Context, userID string) (*model.UserEntity, error)
}

type userRepo struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepo{db: db}
}

func (r *userRepo) FindByUserID(ctx context.Context, userID string) (*model.UserEntity, error) {
	var e model.UserEntity
	err := r.db.QueryRowContext(ctx,
		`SELECT "ID", "USER_ID", "PASSWORD_HASH", "FULL_NAME", "ROLE",
		        "BRANCH_CODE", "BRANCH_NAME", "IS_ACTIVE", "CREATED_AT", "UPDATED_AT"
		 FROM "USERS"
		 WHERE "USER_ID" = $1`, userID).
		Scan(&e.ID, &e.UserID, &e.PasswordHash, &e.FullName, &e.Role,
			&e.BranchCode, &e.BranchName, &e.IsActive, &e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

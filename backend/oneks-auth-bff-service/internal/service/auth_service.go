package service

import (
	"context"
	"database/sql"
	"log/slog"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"oneks-auth-bff-service/internal/constant"
	"oneks-auth-bff-service/internal/model"
	"oneks-auth-bff-service/internal/repository"
	"oneks-auth-bff-service/pkg/apperror"
)

const logPrefix = constant.LogPrefix

type AuthService struct {
	repo      repository.UserRepository
	jwtSecret []byte
	jwtExpiry time.Duration
}

func NewAuthService(repo repository.UserRepository, jwtSecret string, jwtExpiry time.Duration) *AuthService {
	return &AuthService{
		repo:      repo,
		jwtSecret: []byte(jwtSecret),
		jwtExpiry: jwtExpiry,
	}
}

func (s *AuthService) Login(ctx context.Context, req model.LoginRequest) (*model.LoginResponse, error) {
	slog.InfoContext(ctx, logPrefix+" Login started", "userId", req.UserID)

	user, err := s.repo.FindByUserID(ctx, req.UserID)
	if err != nil {
		if err == sql.ErrNoRows {
			slog.WarnContext(ctx, logPrefix+" Login user not found", "userId", req.UserID)
			return nil, apperror.Unauthorized(constant.ErrInvalidCredentials.Message)
		}
		slog.ErrorContext(ctx, logPrefix+" Login repo error", "error", err)
		return nil, apperror.Internal("failed to query user")
	}

	if !user.IsActive {
		slog.WarnContext(ctx, logPrefix+" Login account locked", "userId", req.UserID)
		return nil, apperror.Unauthorized(constant.ErrAccountLocked.Message)
	}

	if user.PasswordHash != req.Password {
		slog.WarnContext(ctx, logPrefix+" Login invalid password", "userId", req.UserID)
		return nil, apperror.Unauthorized(constant.ErrInvalidCredentials.Message)
	}

	expiresAt := time.Now().Add(s.jwtExpiry)

	token, err := s.generateToken(user, expiresAt)
	if err != nil {
		slog.ErrorContext(ctx, logPrefix+" Login token generation failed", "error", err)
		return nil, apperror.Internal("failed to generate token")
	}

	slog.InfoContext(ctx, logPrefix+" Login completed", "userId", req.UserID)

	return &model.LoginResponse{
		Token:     token,
		ExpiresAt: expiresAt.Format(time.RFC3339),
		User: model.UserResponse{
			UserID:     user.UserID,
			FullName:   user.FullName,
			Role:       user.Role,
			BranchCode: user.BranchCode,
			BranchName: user.BranchName,
		},
	}, nil
}

func (s *AuthService) generateToken(user *model.UserEntity, expiresAt time.Time) (string, error) {
	claims := jwt.MapClaims{
		"sub":        user.UserID,
		"fullName":   user.FullName,
		"role":       user.Role,
		"branchCode": user.BranchCode,
		"iat":        time.Now().Unix(),
		"exp":        expiresAt.Unix(),
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString(s.jwtSecret)
}

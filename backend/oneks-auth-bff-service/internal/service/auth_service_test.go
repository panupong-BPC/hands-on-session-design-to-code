package service_test

import (
	"context"
	"database/sql"
	"fmt"
	"testing"

	"golang.org/x/crypto/bcrypt"

	"oneks-auth-bff-service/internal/model"
	"oneks-auth-bff-service/internal/service"
	"time"
)

// Mock repository
type mockUserRepo struct {
	user *model.UserEntity
	err  error
}

func (m *mockUserRepo) FindByUserID(ctx context.Context, userID string) (*model.UserEntity, error) {
	if m.err != nil {
		return nil, m.err
	}
	if m.user != nil && m.user.UserID == userID {
		return m.user, nil
	}
	return nil, sql.ErrNoRows
}

func hashedPassword(plain string) string {
	h, _ := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.DefaultCost)
	return string(h)
}

func TestLogin_Success(t *testing.T) {
	repo := &mockUserRepo{
		user: &model.UserEntity{
			ID:           1,
			UserID:       "admin",
			PasswordHash: hashedPassword("password123"),
			FullName:     "System Administrator",
			Role:         "admin",
			BranchCode:   "HQ001",
			BranchName:   "Head Office",
			IsActive:     true,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		},
	}
	svc := service.NewAuthService(repo, "test-secret", 24*time.Hour)

	result, err := svc.Login(context.Background(), model.LoginRequest{
		UserID:   "admin",
		Password: "password123",
	})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if result.Token == "" {
		t.Error("expected non-empty token")
	}
	if result.User.UserID != "admin" {
		t.Errorf("expected userId 'admin', got '%s'", result.User.UserID)
	}
	if result.User.FullName != "System Administrator" {
		t.Errorf("expected fullName 'System Administrator', got '%s'", result.User.FullName)
	}
}

func TestLogin_InvalidPassword(t *testing.T) {
	repo := &mockUserRepo{
		user: &model.UserEntity{
			ID:           1,
			UserID:       "admin",
			PasswordHash: hashedPassword("password123"),
			IsActive:     true,
		},
	}
	svc := service.NewAuthService(repo, "test-secret", 24*time.Hour)

	_, err := svc.Login(context.Background(), model.LoginRequest{
		UserID:   "admin",
		Password: "wrongpassword",
	})
	if err == nil {
		t.Fatal("expected error for invalid password, got nil")
	}
}

func TestLogin_UserNotFound(t *testing.T) {
	repo := &mockUserRepo{
		err: sql.ErrNoRows,
	}
	svc := service.NewAuthService(repo, "test-secret", 24*time.Hour)

	_, err := svc.Login(context.Background(), model.LoginRequest{
		UserID:   "nonexistent",
		Password: "password123",
	})
	if err == nil {
		t.Fatal("expected error for user not found, got nil")
	}
}

func TestLogin_AccountLocked(t *testing.T) {
	repo := &mockUserRepo{
		user: &model.UserEntity{
			ID:           1,
			UserID:       "locked",
			PasswordHash: hashedPassword("password123"),
			IsActive:     false,
		},
	}
	svc := service.NewAuthService(repo, "test-secret", 24*time.Hour)

	_, err := svc.Login(context.Background(), model.LoginRequest{
		UserID:   "locked",
		Password: "password123",
	})
	if err == nil {
		t.Fatal("expected error for locked account, got nil")
	}
}

func TestLogin_RepoError(t *testing.T) {
	repo := &mockUserRepo{
		err: fmt.Errorf("db connection failed"),
	}
	svc := service.NewAuthService(repo, "test-secret", 24*time.Hour)

	_, err := svc.Login(context.Background(), model.LoginRequest{
		UserID:   "admin",
		Password: "password123",
	})
	if err == nil {
		t.Fatal("expected error, got nil")
	}
}

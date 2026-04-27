package model

// LoginRequest represents the login request body.
type LoginRequest struct {
	UserID   string `json:"userId" validate:"required"`
	Password string `json:"password" validate:"required"`
}

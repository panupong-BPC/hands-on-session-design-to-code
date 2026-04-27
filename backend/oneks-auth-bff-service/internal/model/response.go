package model

// LoginResponse holds the token and user profile returned after successful login.
type LoginResponse struct {
	Token     string       `json:"token"`
	ExpiresAt string       `json:"expiresAt"`
	User      UserResponse `json:"user"`
}

// UserResponse is the public user profile.
type UserResponse struct {
	UserID     string `json:"userId"`
	FullName   string `json:"fullName"`
	Role       string `json:"role"`
	BranchCode string `json:"branchCode"`
	BranchName string `json:"branchName"`
}

// APIResponse is the standard API response wrapper.
type APIResponse struct {
	Status  string `json:"status"`
	Data    any    `json:"data,omitempty"`
	Message string `json:"message"`
}

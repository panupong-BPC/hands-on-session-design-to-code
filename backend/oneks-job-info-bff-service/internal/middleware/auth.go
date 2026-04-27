package middleware

import (
	"encoding/json"
	"net/http"
	"strings"
)

// authResponse is a minimal error envelope used by the Auth middleware.
type authResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

// Auth enforces that a non-empty Bearer token is present in the Authorization header.
// Full JWT signature validation should be wired here when the signing key is available.
func Auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			writeUnauthorized(w, "Authorization header is required")
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || strings.TrimSpace(parts[1]) == "" {
			writeUnauthorized(w, "Invalid or missing Bearer token")
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeUnauthorized(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	json.NewEncoder(w).Encode(authResponse{Status: "error", Message: message})
}

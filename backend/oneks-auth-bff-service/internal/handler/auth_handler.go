package handler

import (
	"encoding/json"
	"net/http"

	"oneks-auth-bff-service/internal/model"
	"oneks-auth-bff-service/internal/service"
	"oneks-auth-bff-service/pkg/apperror"
)

type AuthHandler struct {
	svc *service.AuthService
}

func NewAuthHandler(svc *service.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

// Login handles POST /rest/api/v1/auth/login
func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req model.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.UserID == "" {
		writeError(w, http.StatusBadRequest, "userId is required")
		return
	}
	if req.Password == "" {
		writeError(w, http.StatusBadRequest, "password is required")
		return
	}

	result, err := h.svc.Login(r.Context(), req)
	if err != nil {
		if appErr, ok := err.(*apperror.AppError); ok {
			writeJSON(w, appErr.StatusCode, model.APIResponse{
				Status:  "error",
				Message: appErr.Message,
			})
			return
		}
		writeError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	writeJSON(w, http.StatusOK, model.APIResponse{
		Status:  "success",
		Data:    result,
		Message: "OK",
	})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, model.APIResponse{
		Status:  "error",
		Message: message,
	})
}

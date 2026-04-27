package apperror

import "net/http"

type AppError struct {
	StatusCode int    `json:"-"`
	Code       string `json:"code"`
	Title      string `json:"title"`
	Message    string `json:"message"`
}

func (e *AppError) Error() string {
	return e.Message
}

func NotFound(message string) *AppError {
	return &AppError{StatusCode: http.StatusNotFound, Code: "E404", Title: "Not Found", Message: message}
}

func BadRequest(message string) *AppError {
	return &AppError{StatusCode: http.StatusBadRequest, Code: "E400", Title: "Bad Request", Message: message}
}

func Unauthorized(message string) *AppError {
	return &AppError{StatusCode: http.StatusUnauthorized, Code: "I401", Title: "Unauthorized", Message: message}
}

func Internal(message string) *AppError {
	return &AppError{StatusCode: http.StatusInternalServerError, Code: "B087", Title: "Backend Error", Message: message}
}

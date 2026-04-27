package constant

type ErrorCode struct {
	Code    string
	Title   string
	Message string
}

var (
	ErrInvalidCredentials = ErrorCode{Code: "A001", Title: "Authentication Failed", Message: "Invalid user ID or password"}
	ErrUserNotFound       = ErrorCode{Code: "A002", Title: "User Not Found", Message: "User does not exist"}
	ErrAccountLocked      = ErrorCode{Code: "A003", Title: "Account Locked", Message: "Account is locked. Please contact administrator"}
	ErrUnauthorized       = ErrorCode{Code: "I401", Title: "Unauthorized", Message: "Missing or invalid authorization"}
	ErrBadRequest         = ErrorCode{Code: "E400", Title: "Bad Request", Message: "Invalid request: %s"}
	ErrBackend            = ErrorCode{Code: "B087", Title: "Backend Error", Message: "Backend error: %s"}
)

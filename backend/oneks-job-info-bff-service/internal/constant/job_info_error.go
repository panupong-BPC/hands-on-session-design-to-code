package constant

// ErrorCode holds structured error information returned in API responses.
type ErrorCode struct {
	Code    string
	Title   string
	Message string
}

var (
	ErrJobNotFound      = ErrorCode{Code: "J001", Title: "Job Not Found", Message: "The requested job does not exist"}
	ErrContractNotFound = ErrorCode{Code: "J002", Title: "Contract Not Found", Message: "The requested contract does not exist for this job"}
	ErrUnauthorized     = ErrorCode{Code: "I401", Title: "Unauthorized", Message: "Missing or invalid authorization token"}
	ErrBadRequest       = ErrorCode{Code: "E400", Title: "Bad Request", Message: "Invalid request parameters"}
	ErrBackend          = ErrorCode{Code: "B089", Title: "Backend Error", Message: "An unexpected backend error occurred"}
)

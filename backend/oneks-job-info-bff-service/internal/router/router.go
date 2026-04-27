package router

import (
	"net/http"

	"oneks-job-info-bff-service/internal/handler"
	"oneks-job-info-bff-service/internal/middleware"
)

// New builds and returns the HTTP handler with all routes and middleware wired.
func New(h *handler.JobInfoHandler) http.Handler {
	mux := http.NewServeMux()

	// Health check — unauthenticated
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"UP"}`))
	})

	// Job-info routes — protected by Bearer token auth
	const prefix = "/rest/api/v1/backendForFrontends/workflow/jobs"

	// List jobs (supports ?tab= query param)
	mux.Handle("GET "+prefix,
		middleware.Auth(http.HandlerFunc(h.GetJobsList)))

	mux.Handle("GET "+prefix+"/{jobId}",
		middleware.Auth(http.HandlerFunc(h.GetJobInfo)))

	mux.Handle("PUT "+prefix+"/{jobId}",
		middleware.Auth(http.HandlerFunc(h.UpdateJobInfo)))

	mux.Handle("GET "+prefix+"/{jobId}/contracts",
		middleware.Auth(http.HandlerFunc(h.GetJobContracts)))

	mux.Handle("PATCH "+prefix+"/{jobId}/contracts/{contractId}/review",
		middleware.Auth(http.HandlerFunc(h.ReviewContract)))

	// Apply logging and CORS to the whole mux
	var chain http.Handler = mux
	chain = middleware.Logging(chain)
	chain = middleware.CORS(chain)

	return chain
}

package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"oneks-job-info-bff-service/internal/model"
	"oneks-job-info-bff-service/internal/service"
	"oneks-job-info-bff-service/pkg/apperror"
)

// JobInfoHandler handles HTTP requests for the job-info endpoints.
type JobInfoHandler struct {
	svc *service.JobInfoService
}

// NewJobInfoHandler creates a new JobInfoHandler.
func NewJobInfoHandler(svc *service.JobInfoService) *JobInfoHandler {
	return &JobInfoHandler{svc: svc}
}

// GetJobsList handles GET /rest/api/v1/backendForFrontends/workflow/jobs?tab=MY_JOBS
func (h *JobInfoHandler) GetJobsList(w http.ResponseWriter, r *http.Request) {
	tab := strings.TrimSpace(r.URL.Query().Get("tab"))

	items, err := h.svc.ListJobs(r.Context(), tab)
	if err != nil {
		handleServiceError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, model.APIResponse{
		Status:  "success",
		Data:    map[string]any{"jobs": items},
		Message: "OK",
	})
}

// GetJobInfo handles GET /rest/api/v1/backendForFrontends/workflow/jobs/{jobId}
func (h *JobInfoHandler) GetJobInfo(w http.ResponseWriter, r *http.Request) {
	jobID := strings.TrimSpace(r.PathValue("jobId"))
	if jobID == "" {
		writeError(w, http.StatusBadRequest, "jobId path parameter is required")
		return
	}

	result, err := h.svc.GetJobInfo(r.Context(), jobID)
	if err != nil {
		handleServiceError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, model.APIResponse{
		Status:  "success",
		Data:    result,
		Message: "OK",
	})
}

// UpdateJobInfo handles PUT /rest/api/v1/backendForFrontends/job-info/{jobId}
func (h *JobInfoHandler) UpdateJobInfo(w http.ResponseWriter, r *http.Request) {
	jobID := strings.TrimSpace(r.PathValue("jobId"))
	if jobID == "" {
		writeError(w, http.StatusBadRequest, "jobId path parameter is required")
		return
	}

	var req model.UpdateJobInfoRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if err := h.svc.UpdateJobInfo(r.Context(), jobID, req); err != nil {
		handleServiceError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, model.APIResponse{
		Status:  "success",
		Message: "Job information updated successfully",
	})
}

// GetJobContracts handles GET /rest/api/v1/backendForFrontends/job-info/{jobId}/contracts
func (h *JobInfoHandler) GetJobContracts(w http.ResponseWriter, r *http.Request) {
	jobID := strings.TrimSpace(r.PathValue("jobId"))
	if jobID == "" {
		writeError(w, http.StatusBadRequest, "jobId path parameter is required")
		return
	}

	contracts, err := h.svc.GetJobContracts(r.Context(), jobID)
	if err != nil {
		handleServiceError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, model.APIResponse{
		Status:  "success",
		Data:    contracts,
		Message: "OK",
	})
}

// ReviewContract handles PATCH /rest/api/v1/backendForFrontends/job-info/{jobId}/contracts/{contractId}/review
func (h *JobInfoHandler) ReviewContract(w http.ResponseWriter, r *http.Request) {
	jobID := strings.TrimSpace(r.PathValue("jobId"))
	contractID := strings.TrimSpace(r.PathValue("contractId"))

	if jobID == "" {
		writeError(w, http.StatusBadRequest, "jobId path parameter is required")
		return
	}
	if contractID == "" {
		writeError(w, http.StatusBadRequest, "contractId path parameter is required")
		return
	}

	if err := h.svc.ReviewContract(r.Context(), jobID, contractID); err != nil {
		handleServiceError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, model.APIResponse{
		Status:  "success",
		Message: "Contract marked as reviewed",
	})
}

// handleServiceError maps apperror.AppError to the correct HTTP status code.
func handleServiceError(w http.ResponseWriter, err error) {
	if appErr, ok := err.(*apperror.AppError); ok {
		writeJSON(w, appErr.StatusCode, model.APIResponse{
			Status:  "error",
			Message: appErr.Message,
		})
		return
	}
	writeError(w, http.StatusInternalServerError, "internal server error")
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

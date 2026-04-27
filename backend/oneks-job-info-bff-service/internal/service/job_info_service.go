package service

import (
	"context"
	"database/sql"
	"encoding/json"
	"log/slog"

	"oneks-job-info-bff-service/internal/constant"
	"oneks-job-info-bff-service/internal/model"
	"oneks-job-info-bff-service/internal/repository"
	"oneks-job-info-bff-service/pkg/apperror"
)

const logPrefix = constant.LogPrefix

// JobInfoService implements the business logic for the job-info feature.
type JobInfoService struct {
	repo repository.JobInfoRepository
}

// NewJobInfoService creates a new JobInfoService with the given repository.
func NewJobInfoService(repo repository.JobInfoRepository) *JobInfoService {
	return &JobInfoService{repo: repo}
}

// GetJobInfo returns the full job information for a given jobID.
func (s *JobInfoService) GetJobInfo(ctx context.Context, jobID string) (*model.JobInfoResponse, error) {
	slog.InfoContext(ctx, logPrefix+" GetJobInfo started", "jobId", jobID)

	job, err := s.repo.FindJobByJobID(ctx, jobID)
	if err != nil {
		if err == sql.ErrNoRows {
			slog.WarnContext(ctx, logPrefix+" GetJobInfo job not found", "jobId", jobID)
			return nil, apperror.NotFound(constant.ErrJobNotFound.Message)
		}
		slog.ErrorContext(ctx, logPrefix+" GetJobInfo repo error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}

	statusBadges := unmarshalStringSlice(job.StatusBadges)

	generalInfoResp := model.GeneralInfoResponse{}
	gi, err := s.repo.FindGeneralInfoByJobID(ctx, jobID)
	if err != nil && err != sql.ErrNoRows {
		slog.ErrorContext(ctx, logPrefix+" GetJobInfo generalInfo error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}
	if err == nil {
		generalInfoResp = toGeneralInfoResponse(gi)
	}

	cfaInfoResp := model.CfaInfoResponse{}
	ci, err := s.repo.FindCfaInfoByJobID(ctx, jobID)
	if err != nil && err != sql.ErrNoRows {
		slog.ErrorContext(ctx, logPrefix+" GetJobInfo cfaInfo error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}
	if err == nil {
		cfaInfoResp = toCfaInfoResponse(ci)
	}

	applicantEntities, err := s.repo.FindLoanApplicantsByJobID(ctx, jobID)
	if err != nil {
		slog.ErrorContext(ctx, logPrefix+" GetJobInfo loanApplicants error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}

	loanDetailEntities, err := s.repo.FindLoanDetailsByJobID(ctx, jobID)
	if err != nil {
		slog.ErrorContext(ctx, logPrefix+" GetJobInfo loanDetails error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}

	collateralEntities, err := s.repo.FindCollateralsByJobID(ctx, jobID)
	if err != nil {
		slog.ErrorContext(ctx, logPrefix+" GetJobInfo collaterals error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}

	contractEntities, err := s.repo.FindContractsByJobID(ctx, jobID)
	if err != nil {
		slog.ErrorContext(ctx, logPrefix+" GetJobInfo contracts error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}

	slog.InfoContext(ctx, logPrefix+" GetJobInfo completed", "jobId", jobID)

	return &model.JobInfoResponse{
		JobID:          job.JobID,
		StatusBadges:   statusBadges,
		GeneralInfo:    generalInfoResp,
		CfaInfo:        cfaInfoResp,
		LoanApplicants: toLoanApplicantResponses(applicantEntities),
		LoanDetails:    toLoanDetailResponses(loanDetailEntities),
		CollateralInfo: model.CollateralInfo{
			Items: toCollateralResponses(collateralEntities),
		},
		Contracts: toContractResponses(contractEntities),
	}, nil
}

// UpdateJobInfo performs a partial update of a job's generalInfo and/or cfaInfo sections.
func (s *JobInfoService) UpdateJobInfo(ctx context.Context, jobID string, req model.UpdateJobInfoRequest) error {
	slog.InfoContext(ctx, logPrefix+" UpdateJobInfo started", "jobId", jobID)

	_, err := s.repo.FindJobByJobID(ctx, jobID)
	if err != nil {
		if err == sql.ErrNoRows {
			slog.WarnContext(ctx, logPrefix+" UpdateJobInfo job not found", "jobId", jobID)
			return apperror.NotFound(constant.ErrJobNotFound.Message)
		}
		slog.ErrorContext(ctx, logPrefix+" UpdateJobInfo repo error", "error", err)
		return apperror.Internal(constant.ErrBackend.Message)
	}

	if req.GeneralInfo != nil {
		if err := s.repo.UpsertGeneralInfo(ctx, jobID, *req.GeneralInfo); err != nil {
			slog.ErrorContext(ctx, logPrefix+" UpdateJobInfo upsertGeneralInfo error", "error", err)
			return apperror.Internal(constant.ErrBackend.Message)
		}
	}

	if req.CfaInfo != nil {
		if err := s.repo.UpsertCfaInfo(ctx, jobID, *req.CfaInfo); err != nil {
			slog.ErrorContext(ctx, logPrefix+" UpdateJobInfo upsertCfaInfo error", "error", err)
			return apperror.Internal(constant.ErrBackend.Message)
		}
	}

	slog.InfoContext(ctx, logPrefix+" UpdateJobInfo completed", "jobId", jobID)
	return nil
}

// GetJobContracts returns the contracts associated with a job.
func (s *JobInfoService) GetJobContracts(ctx context.Context, jobID string) ([]model.ContractResponse, error) {
	slog.InfoContext(ctx, logPrefix+" GetJobContracts started", "jobId", jobID)

	_, err := s.repo.FindJobByJobID(ctx, jobID)
	if err != nil {
		if err == sql.ErrNoRows {
			slog.WarnContext(ctx, logPrefix+" GetJobContracts job not found", "jobId", jobID)
			return nil, apperror.NotFound(constant.ErrJobNotFound.Message)
		}
		slog.ErrorContext(ctx, logPrefix+" GetJobContracts repo error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}

	contracts, err := s.repo.FindContractsByJobID(ctx, jobID)
	if err != nil {
		slog.ErrorContext(ctx, logPrefix+" GetJobContracts contracts error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}

	slog.InfoContext(ctx, logPrefix+" GetJobContracts completed", "jobId", jobID)
	return toContractResponses(contracts), nil
}

// ReviewContract marks the given contract as reviewed, verifying it belongs to the job.
func (s *JobInfoService) ReviewContract(ctx context.Context, jobID, contractID string) error {
	slog.InfoContext(ctx, logPrefix+" ReviewContract started", "jobId", jobID, "contractId", contractID)

	_, err := s.repo.FindContractByContractID(ctx, jobID, contractID)
	if err != nil {
		if err == sql.ErrNoRows {
			slog.WarnContext(ctx, logPrefix+" ReviewContract contract not found", "jobId", jobID, "contractId", contractID)
			return apperror.NotFound(constant.ErrContractNotFound.Message)
		}
		slog.ErrorContext(ctx, logPrefix+" ReviewContract repo error", "error", err)
		return apperror.Internal(constant.ErrBackend.Message)
	}

	if err := s.repo.MarkContractReviewed(ctx, jobID, contractID); err != nil {
		slog.ErrorContext(ctx, logPrefix+" ReviewContract markReviewed error", "error", err)
		return apperror.Internal(constant.ErrBackend.Message)
	}

	slog.InfoContext(ctx, logPrefix+" ReviewContract completed", "jobId", jobID, "contractId", contractID)
	return nil
}

// ListJobs returns all jobs filtered by the given tab type.
// tabType maps to the TAB_TYPE column; an empty string returns all jobs.
func (s *JobInfoService) ListJobs(ctx context.Context, tabType string) ([]model.WorkflowJobListItem, error) {
	slog.InfoContext(ctx, logPrefix+" ListJobs started", "tabType", tabType)

	items, err := s.repo.FindAllJobsByTab(ctx, tabType)
	if err != nil {
		slog.ErrorContext(ctx, logPrefix+" ListJobs repo error", "error", err)
		return nil, apperror.Internal(constant.ErrBackend.Message)
	}

	slog.InfoContext(ctx, logPrefix+" ListJobs completed", "count", len(items))
	return items, nil
}

// --- mapping helpers ---

func toGeneralInfoResponse(e *model.GeneralInfoEntity) model.GeneralInfoResponse {
	return model.GeneralInfoResponse{
		Branch:                e.Branch.String,
		LoanContractDate:      e.LoanContractDate.String,
		SpouseConsentDate:     e.SpouseConsentDate.String,
		GuaranteeContractDate: e.GuaranteeContractDate.String,
		MortgageDate:          e.MortgageDate.String,
		AppraisalPrice:        e.AppraisalPrice.Float64,
		SalePrice:             e.SalePrice.Float64,
	}
}

func toCfaInfoResponse(e *model.CfaInfoEntity) model.CfaInfoResponse {
	return model.CfaInfoResponse{
		TotalCreditOld:  e.TotalCreditOld.Float64,
		TotalCreditNew:  e.TotalCreditNew.Float64,
		CreditChange:    e.CreditChange.Float64,
		CfaOldDate:      e.CfaOldDate.String,
		CfaCurrentRound: int(e.CfaCurrentRound.Int64),
		DebtPeriodOld:   int(e.DebtPeriodOld.Int64),
		DebtPeriodNew:   int(e.DebtPeriodNew.Int64),
	}
}

func toLoanApplicantResponses(entities []model.LoanApplicantEntity) []model.LoanApplicantResponse {
	result := make([]model.LoanApplicantResponse, 0, len(entities))
	for _, e := range entities {
		result = append(result, model.LoanApplicantResponse{
			FullName:        e.FullName,
			NationalID:      e.NationalID.String,
			Age:             int(e.Age.Int64),
			Nationality:     e.Nationality.String,
			Parents:         e.Parents.String,
			MaritalStatus:   e.MaritalStatus.String,
			BorrowerType:    e.BorrowerType.String,
			CollateralOwner: e.CollateralOwner,
		})
	}
	return result
}

func toLoanDetailResponses(entities []model.LoanDetailEntity) []model.LoanDetailResponse {
	result := make([]model.LoanDetailResponse, 0, len(entities))
	for _, e := range entities {
		result = append(result, model.LoanDetailResponse{
			LoanType:          e.LoanType.String,
			LoanAmount:        e.LoanAmount.Float64,
			InterestRate:      e.InterestRate.Float64,
			LoanPeriod:        int(e.LoanPeriod.Int64),
			InstallmentAmount: e.InstallmentAmount.Float64,
		})
	}
	return result
}

func toCollateralResponses(entities []model.CollateralEntity) []model.CollateralResponse {
	result := make([]model.CollateralResponse, 0, len(entities))
	for _, e := range entities {
		result = append(result, model.CollateralResponse{
			CollateralID:    e.CollateralID,
			CollateralType:  e.CollateralType.String,
			TitleDeedNumber: e.TitleDeedNumber.String,
			LandArea:        e.LandArea.Float64,
			AppraisalPrice:  e.AppraisalPrice.Float64,
			Location:        e.Location.String,
		})
	}
	return result
}

func toContractResponses(entities []model.ContractEntity) []model.ContractResponse {
	result := make([]model.ContractResponse, 0, len(entities))
	for _, e := range entities {
		result = append(result, model.ContractResponse{
			ContractID:    e.ContractID,
			ContractType:  e.ContractType.String,
			CreditLimit:   e.CreditLimit.Float64,
			BorrowerName:  e.BorrowerName.String,
			ReviewStatus:  e.ReviewStatus,
			DocumentLinks: unmarshalStringSlice(e.DocumentLinks),
		})
	}
	return result
}

// unmarshalStringSlice decodes a JSONB byte slice into a string slice.
// Returns an empty slice on nil input or parse error.
func unmarshalStringSlice(raw []byte) []string {
	if len(raw) == 0 {
		return []string{}
	}
	var result []string
	if err := json.Unmarshal(raw, &result); err != nil {
		return []string{}
	}
	return result
}

package service_test

import (
	"context"
	"database/sql"
	"testing"
	"time"

	"oneks-job-info-bff-service/internal/model"
	"oneks-job-info-bff-service/internal/service"
	"oneks-job-info-bff-service/pkg/apperror"
)

// mockJobInfoRepo is a test double for the JobInfoRepository interface.
type mockJobInfoRepo struct {
	job           *model.JobEntity
	generalInfo   *model.GeneralInfoEntity
	cfaInfo       *model.CfaInfoEntity
	loanApps      []model.LoanApplicantEntity
	loanDetails   []model.LoanDetailEntity
	collaterals   []model.CollateralEntity
	contracts     []model.ContractEntity
	contract      *model.ContractEntity
	findJobErr    error
	findGenErr    error
	findCfaErr    error
	findContErr   error
	upsertGenErr  error
	upsertCfaErr  error
	markReviewErr error
}

func (m *mockJobInfoRepo) FindJobByJobID(_ context.Context, _ string) (*model.JobEntity, error) {
	return m.job, m.findJobErr
}
func (m *mockJobInfoRepo) FindGeneralInfoByJobID(_ context.Context, _ string) (*model.GeneralInfoEntity, error) {
	return m.generalInfo, m.findGenErr
}
func (m *mockJobInfoRepo) FindCfaInfoByJobID(_ context.Context, _ string) (*model.CfaInfoEntity, error) {
	return m.cfaInfo, m.findCfaErr
}
func (m *mockJobInfoRepo) FindLoanApplicantsByJobID(_ context.Context, _ string) ([]model.LoanApplicantEntity, error) {
	return m.loanApps, nil
}
func (m *mockJobInfoRepo) FindLoanDetailsByJobID(_ context.Context, _ string) ([]model.LoanDetailEntity, error) {
	return m.loanDetails, nil
}
func (m *mockJobInfoRepo) FindCollateralsByJobID(_ context.Context, _ string) ([]model.CollateralEntity, error) {
	return m.collaterals, nil
}
func (m *mockJobInfoRepo) FindContractsByJobID(_ context.Context, _ string) ([]model.ContractEntity, error) {
	return m.contracts, nil
}
func (m *mockJobInfoRepo) FindContractByContractID(_ context.Context, _, _ string) (*model.ContractEntity, error) {
	return m.contract, m.findContErr
}
func (m *mockJobInfoRepo) UpsertGeneralInfo(_ context.Context, _ string, _ model.GeneralInfoUpdate) error {
	return m.upsertGenErr
}
func (m *mockJobInfoRepo) UpsertCfaInfo(_ context.Context, _ string, _ model.CfaInfoUpdate) error {
	return m.upsertCfaErr
}
func (m *mockJobInfoRepo) MarkContractReviewed(_ context.Context, _, _ string) error {
	return m.markReviewErr
}
func (m *mockJobInfoRepo) FindAllJobsByTab(_ context.Context, _ string) ([]model.WorkflowJobListItem, error) {
	return []model.WorkflowJobListItem{}, nil
}

func makeJob(jobID string) *model.JobEntity {
	return &model.JobEntity{
		ID:           1,
		JobID:        jobID,
		StatusBadges: []byte(`["PENDING","REVIEW"]`),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
}

// --- GetJobInfo ---

func TestGetJobInfo_Success(t *testing.T) {
	repo := &mockJobInfoRepo{
		job:         makeJob("JOB-001"),
		generalInfo: &model.GeneralInfoEntity{JobID: "JOB-001", Branch: sql.NullString{String: "HQ", Valid: true}},
		cfaInfo:     &model.CfaInfoEntity{JobID: "JOB-001", TotalCreditOld: sql.NullFloat64{Float64: 100000, Valid: true}},
		loanApps: []model.LoanApplicantEntity{
			{JobID: "JOB-001", FullName: "John Doe"},
		},
		contracts: []model.ContractEntity{
			{JobID: "JOB-001", ContractID: "C-001", ReviewStatus: "PENDING", DocumentLinks: []byte(`[]`)},
		},
	}
	svc := service.NewJobInfoService(repo)

	resp, err := svc.GetJobInfo(context.Background(), "JOB-001")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if resp.JobID != "JOB-001" {
		t.Errorf("expected jobId 'JOB-001', got '%s'", resp.JobID)
	}
	if len(resp.StatusBadges) != 2 {
		t.Errorf("expected 2 status badges, got %d", len(resp.StatusBadges))
	}
	if resp.GeneralInfo.Branch != "HQ" {
		t.Errorf("expected branch 'HQ', got '%s'", resp.GeneralInfo.Branch)
	}
	if resp.CfaInfo.TotalCreditOld != 100000 {
		t.Errorf("expected totalCreditOld 100000, got %f", resp.CfaInfo.TotalCreditOld)
	}
	if len(resp.LoanApplicants) != 1 {
		t.Errorf("expected 1 loan applicant, got %d", len(resp.LoanApplicants))
	}
	if len(resp.Contracts) != 1 {
		t.Errorf("expected 1 contract, got %d", len(resp.Contracts))
	}
}

func TestGetJobInfo_JobNotFound(t *testing.T) {
	repo := &mockJobInfoRepo{findJobErr: sql.ErrNoRows}
	svc := service.NewJobInfoService(repo)

	_, err := svc.GetJobInfo(context.Background(), "MISSING")
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	appErr, ok := err.(*apperror.AppError)
	if !ok {
		t.Fatalf("expected *apperror.AppError, got %T", err)
	}
	if appErr.StatusCode != 404 {
		t.Errorf("expected status 404, got %d", appErr.StatusCode)
	}
}

func TestGetJobInfo_MissingGeneralInfo(t *testing.T) {
	// generalInfo not found should return a zero-value GeneralInfoResponse, not an error
	repo := &mockJobInfoRepo{
		job:        makeJob("JOB-002"),
		findGenErr: sql.ErrNoRows,
		findCfaErr: sql.ErrNoRows,
	}
	svc := service.NewJobInfoService(repo)

	resp, err := svc.GetJobInfo(context.Background(), "JOB-002")
	if err != nil {
		t.Fatalf("expected no error when generalInfo is absent, got %v", err)
	}
	if resp.GeneralInfo.Branch != "" {
		t.Errorf("expected empty branch, got '%s'", resp.GeneralInfo.Branch)
	}
}

// --- GetJobContracts ---

func TestGetJobContracts_Success(t *testing.T) {
	repo := &mockJobInfoRepo{
		job: makeJob("JOB-001"),
		contracts: []model.ContractEntity{
			{ContractID: "C-001", ReviewStatus: "PENDING", DocumentLinks: []byte(`["http://example.com/doc1"]`)},
			{ContractID: "C-002", ReviewStatus: "REVIEWED", DocumentLinks: []byte(`[]`)},
		},
	}
	svc := service.NewJobInfoService(repo)

	contracts, err := svc.GetJobContracts(context.Background(), "JOB-001")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if len(contracts) != 2 {
		t.Errorf("expected 2 contracts, got %d", len(contracts))
	}
	if contracts[0].ContractID != "C-001" {
		t.Errorf("expected C-001, got %s", contracts[0].ContractID)
	}
	if len(contracts[0].DocumentLinks) != 1 {
		t.Errorf("expected 1 document link, got %d", len(contracts[0].DocumentLinks))
	}
}

func TestGetJobContracts_JobNotFound(t *testing.T) {
	repo := &mockJobInfoRepo{findJobErr: sql.ErrNoRows}
	svc := service.NewJobInfoService(repo)

	_, err := svc.GetJobContracts(context.Background(), "MISSING")
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	appErr, ok := err.(*apperror.AppError)
	if !ok {
		t.Fatalf("expected *apperror.AppError, got %T", err)
	}
	if appErr.StatusCode != 404 {
		t.Errorf("expected status 404, got %d", appErr.StatusCode)
	}
}

// --- UpdateJobInfo ---

func TestUpdateJobInfo_Success(t *testing.T) {
	repo := &mockJobInfoRepo{job: makeJob("JOB-001")}
	svc := service.NewJobInfoService(repo)

	req := model.UpdateJobInfoRequest{
		GeneralInfo: &model.GeneralInfoUpdate{
			Branch:         "BranchA",
			AppraisalPrice: 500000,
		},
		CfaInfo: &model.CfaInfoUpdate{
			TotalCreditNew: 1000000,
		},
	}

	if err := svc.UpdateJobInfo(context.Background(), "JOB-001", req); err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestUpdateJobInfo_JobNotFound(t *testing.T) {
	repo := &mockJobInfoRepo{findJobErr: sql.ErrNoRows}
	svc := service.NewJobInfoService(repo)

	err := svc.UpdateJobInfo(context.Background(), "MISSING", model.UpdateJobInfoRequest{})
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	appErr, ok := err.(*apperror.AppError)
	if !ok {
		t.Fatalf("expected *apperror.AppError, got %T", err)
	}
	if appErr.StatusCode != 404 {
		t.Errorf("expected status 404, got %d", appErr.StatusCode)
	}
}

// --- ReviewContract ---

func TestReviewContract_Success(t *testing.T) {
	repo := &mockJobInfoRepo{
		contract: &model.ContractEntity{
			ContractID:   "C-001",
			ReviewStatus: "PENDING",
		},
	}
	svc := service.NewJobInfoService(repo)

	if err := svc.ReviewContract(context.Background(), "JOB-001", "C-001"); err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
}

func TestReviewContract_ContractNotFound(t *testing.T) {
	repo := &mockJobInfoRepo{findContErr: sql.ErrNoRows}
	svc := service.NewJobInfoService(repo)

	err := svc.ReviewContract(context.Background(), "JOB-001", "C-MISSING")
	if err == nil {
		t.Fatal("expected error, got nil")
	}
	appErr, ok := err.(*apperror.AppError)
	if !ok {
		t.Fatalf("expected *apperror.AppError, got %T", err)
	}
	if appErr.StatusCode != 404 {
		t.Errorf("expected status 404, got %d", appErr.StatusCode)
	}
}

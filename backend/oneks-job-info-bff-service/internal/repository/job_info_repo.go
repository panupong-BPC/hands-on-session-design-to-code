package repository

import (
	"context"
	"database/sql"
	"encoding/json"

	"oneks-job-info-bff-service/internal/model"
)

// JobInfoRepository defines all data access operations for the job-info feature.
type JobInfoRepository interface {
	FindJobByJobID(ctx context.Context, jobID string) (*model.JobEntity, error)
	FindAllJobsByTab(ctx context.Context, tabType string) ([]model.WorkflowJobListItem, error)
	FindGeneralInfoByJobID(ctx context.Context, jobID string) (*model.GeneralInfoEntity, error)
	FindCfaInfoByJobID(ctx context.Context, jobID string) (*model.CfaInfoEntity, error)
	FindLoanApplicantsByJobID(ctx context.Context, jobID string) ([]model.LoanApplicantEntity, error)
	FindLoanDetailsByJobID(ctx context.Context, jobID string) ([]model.LoanDetailEntity, error)
	FindCollateralsByJobID(ctx context.Context, jobID string) ([]model.CollateralEntity, error)
	FindContractsByJobID(ctx context.Context, jobID string) ([]model.ContractEntity, error)
	FindContractByContractID(ctx context.Context, jobID, contractID string) (*model.ContractEntity, error)
	UpsertGeneralInfo(ctx context.Context, jobID string, info model.GeneralInfoUpdate) error
	UpsertCfaInfo(ctx context.Context, jobID string, info model.CfaInfoUpdate) error
	MarkContractReviewed(ctx context.Context, jobID, contractID string) error
}

type jobInfoRepo struct {
	db *sql.DB
}

// NewJobInfoRepository creates a new JobInfoRepository backed by the given *sql.DB.
func NewJobInfoRepository(db *sql.DB) JobInfoRepository {
	return &jobInfoRepo{db: db}
}

func (r *jobInfoRepo) FindJobByJobID(ctx context.Context, jobID string) (*model.JobEntity, error) {
	var e model.JobEntity
	err := r.db.QueryRowContext(ctx,
		`SELECT "ID", "JOB_ID", "STATUS_BADGES", "CA_NO", "SEGMENT", "JOB_OWNER", "TOTAL", "TAB_TYPE", "CREATED_AT", "UPDATED_AT"
		 FROM "JOBS"
		 WHERE "JOB_ID" = $1`, jobID).
		Scan(&e.ID, &e.JobID, &e.StatusBadges, &e.CaNo, &e.Segment, &e.JobOwner, &e.Total, &e.TabType, &e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *jobInfoRepo) FindAllJobsByTab(ctx context.Context, tabType string) ([]model.WorkflowJobListItem, error) {
	query := `
		SELECT j."JOB_ID", j."STATUS_BADGES", j."CA_NO", j."SEGMENT", j."JOB_OWNER", j."TOTAL",
		       COALESCE(la."FULL_NAME", '') AS applicant_name,
		       COALESCE(la."NATIONAL_ID", '') AS cif_no
		FROM "JOBS" j
		LEFT JOIN "LOAN_APPLICANTS" la
		       ON la."JOB_ID" = j."JOB_ID" AND la."BORROWER_TYPE" = 'Primary Borrower'
		WHERE ($1 = '' OR j."TAB_TYPE" = $1)
		ORDER BY j."CREATED_AT" DESC`

	rows, err := r.db.QueryContext(ctx, query, tabType)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []model.WorkflowJobListItem
	for rows.Next() {
		var (
			statusJSON    []byte
			caNo          sql.NullString
			segment       sql.NullString
			jobOwner      sql.NullString
			total         float64
			applicantName string
			cifNo         string
			jobID         string
		)
		if err := rows.Scan(&jobID, &statusJSON, &caNo, &segment, &jobOwner, &total, &applicantName, &cifNo); err != nil {
			return nil, err
		}

		var badges []string
		_ = json.Unmarshal(statusJSON, &badges)

		status := ""
		if len(badges) > 0 {
			status = badges[0]
		}

		items = append(items, model.WorkflowJobListItem{
			JobNo:         jobID,
			Status:        status,
			StatusBadges:  badges,
			ApplicantName: applicantName,
			CifNo:         cifNo,
			CaNo:          caNo.String,
			Segment:       segment.String,
			JobOwner:      jobOwner.String,
			Total:         total,
		})
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	if items == nil {
		items = []model.WorkflowJobListItem{}
	}
	return items, nil
}

func (r *jobInfoRepo) FindGeneralInfoByJobID(ctx context.Context, jobID string) (*model.GeneralInfoEntity, error) {
	var e model.GeneralInfoEntity
	err := r.db.QueryRowContext(ctx,
		`SELECT "ID", "JOB_ID", "BRANCH", "LOAN_CONTRACT_DATE", "SPOUSE_CONSENT_DATE",
		        "GUARANTEE_CONTRACT_DATE", "MORTGAGE_DATE", "APPRAISAL_PRICE", "SALE_PRICE",
		        "CREATED_AT", "UPDATED_AT"
		 FROM "GENERAL_INFO"
		 WHERE "JOB_ID" = $1`, jobID).
		Scan(&e.ID, &e.JobID, &e.Branch, &e.LoanContractDate, &e.SpouseConsentDate,
			&e.GuaranteeContractDate, &e.MortgageDate, &e.AppraisalPrice, &e.SalePrice,
			&e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *jobInfoRepo) FindCfaInfoByJobID(ctx context.Context, jobID string) (*model.CfaInfoEntity, error) {
	var e model.CfaInfoEntity
	err := r.db.QueryRowContext(ctx,
		`SELECT "ID", "JOB_ID", "TOTAL_CREDIT_OLD", "TOTAL_CREDIT_NEW", "CREDIT_CHANGE",
		        "CFA_OLD_DATE", "CFA_CURRENT_ROUND", "DEBT_PERIOD_OLD", "DEBT_PERIOD_NEW",
		        "CREATED_AT", "UPDATED_AT"
		 FROM "CFA_INFO"
		 WHERE "JOB_ID" = $1`, jobID).
		Scan(&e.ID, &e.JobID, &e.TotalCreditOld, &e.TotalCreditNew, &e.CreditChange,
			&e.CfaOldDate, &e.CfaCurrentRound, &e.DebtPeriodOld, &e.DebtPeriodNew,
			&e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *jobInfoRepo) FindLoanApplicantsByJobID(ctx context.Context, jobID string) ([]model.LoanApplicantEntity, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT "ID", "JOB_ID", "FULL_NAME", "NATIONAL_ID", "AGE", "NATIONALITY",
		        "PARENTS", "MARITAL_STATUS", "BORROWER_TYPE", "COLLATERAL_OWNER",
		        "CREATED_AT", "UPDATED_AT"
		 FROM "LOAN_APPLICANTS"
		 WHERE "JOB_ID" = $1
		 ORDER BY "ID"`, jobID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []model.LoanApplicantEntity
	for rows.Next() {
		var e model.LoanApplicantEntity
		if err := rows.Scan(&e.ID, &e.JobID, &e.FullName, &e.NationalID, &e.Age, &e.Nationality,
			&e.Parents, &e.MaritalStatus, &e.BorrowerType, &e.CollateralOwner,
			&e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		result = append(result, e)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *jobInfoRepo) FindLoanDetailsByJobID(ctx context.Context, jobID string) ([]model.LoanDetailEntity, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT "ID", "JOB_ID", "LOAN_TYPE", "LOAN_AMOUNT", "INTEREST_RATE",
		        "LOAN_PERIOD", "INSTALLMENT_AMOUNT", "CREATED_AT", "UPDATED_AT"
		 FROM "LOAN_DETAILS"
		 WHERE "JOB_ID" = $1
		 ORDER BY "ID"`, jobID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []model.LoanDetailEntity
	for rows.Next() {
		var e model.LoanDetailEntity
		if err := rows.Scan(&e.ID, &e.JobID, &e.LoanType, &e.LoanAmount, &e.InterestRate,
			&e.LoanPeriod, &e.InstallmentAmount, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		result = append(result, e)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *jobInfoRepo) FindCollateralsByJobID(ctx context.Context, jobID string) ([]model.CollateralEntity, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT "ID", "JOB_ID", "COLLATERAL_ID", "COLLATERAL_TYPE", "TITLE_DEED_NUMBER",
		        "LAND_AREA", "APPRAISAL_PRICE", "LOCATION", "CREATED_AT", "UPDATED_AT"
		 FROM "COLLATERALS"
		 WHERE "JOB_ID" = $1
		 ORDER BY "ID"`, jobID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []model.CollateralEntity
	for rows.Next() {
		var e model.CollateralEntity
		if err := rows.Scan(&e.ID, &e.JobID, &e.CollateralID, &e.CollateralType, &e.TitleDeedNumber,
			&e.LandArea, &e.AppraisalPrice, &e.Location, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		result = append(result, e)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *jobInfoRepo) FindContractsByJobID(ctx context.Context, jobID string) ([]model.ContractEntity, error) {
	rows, err := r.db.QueryContext(ctx,
		`SELECT "ID", "JOB_ID", "CONTRACT_ID", "CONTRACT_TYPE", "CREDIT_LIMIT",
		        "BORROWER_NAME", "REVIEW_STATUS", "DOCUMENT_LINKS", "CREATED_AT", "UPDATED_AT"
		 FROM "CONTRACTS"
		 WHERE "JOB_ID" = $1
		 ORDER BY "ID"`, jobID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []model.ContractEntity
	for rows.Next() {
		var e model.ContractEntity
		if err := rows.Scan(&e.ID, &e.JobID, &e.ContractID, &e.ContractType, &e.CreditLimit,
			&e.BorrowerName, &e.ReviewStatus, &e.DocumentLinks, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		result = append(result, e)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (r *jobInfoRepo) FindContractByContractID(ctx context.Context, jobID, contractID string) (*model.ContractEntity, error) {
	var e model.ContractEntity
	err := r.db.QueryRowContext(ctx,
		`SELECT "ID", "JOB_ID", "CONTRACT_ID", "CONTRACT_TYPE", "CREDIT_LIMIT",
		        "BORROWER_NAME", "REVIEW_STATUS", "DOCUMENT_LINKS", "CREATED_AT", "UPDATED_AT"
		 FROM "CONTRACTS"
		 WHERE "JOB_ID" = $1 AND "CONTRACT_ID" = $2`, jobID, contractID).
		Scan(&e.ID, &e.JobID, &e.ContractID, &e.ContractType, &e.CreditLimit,
			&e.BorrowerName, &e.ReviewStatus, &e.DocumentLinks, &e.CreatedAt, &e.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &e, nil
}

func (r *jobInfoRepo) UpsertGeneralInfo(ctx context.Context, jobID string, info model.GeneralInfoUpdate) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO "GENERAL_INFO"
		   ("JOB_ID", "BRANCH", "LOAN_CONTRACT_DATE", "SPOUSE_CONSENT_DATE",
		    "GUARANTEE_CONTRACT_DATE", "MORTGAGE_DATE", "APPRAISAL_PRICE", "SALE_PRICE",
		    "UPDATED_AT")
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
		 ON CONFLICT ("JOB_ID") DO UPDATE SET
		   "BRANCH"                   = EXCLUDED."BRANCH",
		   "LOAN_CONTRACT_DATE"       = EXCLUDED."LOAN_CONTRACT_DATE",
		   "SPOUSE_CONSENT_DATE"      = EXCLUDED."SPOUSE_CONSENT_DATE",
		   "GUARANTEE_CONTRACT_DATE"  = EXCLUDED."GUARANTEE_CONTRACT_DATE",
		   "MORTGAGE_DATE"            = EXCLUDED."MORTGAGE_DATE",
		   "APPRAISAL_PRICE"          = EXCLUDED."APPRAISAL_PRICE",
		   "SALE_PRICE"               = EXCLUDED."SALE_PRICE",
		   "UPDATED_AT"               = NOW()`,
		jobID,
		nullableString(info.Branch),
		nullableString(info.LoanContractDate),
		nullableString(info.SpouseConsentDate),
		nullableString(info.GuaranteeContractDate),
		nullableString(info.MortgageDate),
		nullableFloat64(info.AppraisalPrice),
		nullableFloat64(info.SalePrice),
	)
	return err
}

func (r *jobInfoRepo) UpsertCfaInfo(ctx context.Context, jobID string, info model.CfaInfoUpdate) error {
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO "CFA_INFO"
		   ("JOB_ID", "TOTAL_CREDIT_OLD", "TOTAL_CREDIT_NEW", "CREDIT_CHANGE",
		    "CFA_OLD_DATE", "CFA_CURRENT_ROUND", "DEBT_PERIOD_OLD", "DEBT_PERIOD_NEW",
		    "UPDATED_AT")
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
		 ON CONFLICT ("JOB_ID") DO UPDATE SET
		   "TOTAL_CREDIT_OLD"  = EXCLUDED."TOTAL_CREDIT_OLD",
		   "TOTAL_CREDIT_NEW"  = EXCLUDED."TOTAL_CREDIT_NEW",
		   "CREDIT_CHANGE"     = EXCLUDED."CREDIT_CHANGE",
		   "CFA_OLD_DATE"      = EXCLUDED."CFA_OLD_DATE",
		   "CFA_CURRENT_ROUND" = EXCLUDED."CFA_CURRENT_ROUND",
		   "DEBT_PERIOD_OLD"   = EXCLUDED."DEBT_PERIOD_OLD",
		   "DEBT_PERIOD_NEW"   = EXCLUDED."DEBT_PERIOD_NEW",
		   "UPDATED_AT"        = NOW()`,
		jobID,
		nullableFloat64(info.TotalCreditOld),
		nullableFloat64(info.TotalCreditNew),
		nullableFloat64(info.CreditChange),
		nullableString(info.CfaOldDate),
		nullableInt64(int64(info.CfaCurrentRound)),
		nullableInt64(int64(info.DebtPeriodOld)),
		nullableInt64(int64(info.DebtPeriodNew)),
	)
	return err
}

func (r *jobInfoRepo) MarkContractReviewed(ctx context.Context, jobID, contractID string) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE "CONTRACTS"
		 SET "REVIEW_STATUS" = 'REVIEWED', "UPDATED_AT" = NOW()
		 WHERE "JOB_ID" = $1 AND "CONTRACT_ID" = $2`,
		jobID, contractID)
	return err
}

// nullableString converts an empty string to sql.NullString{Valid: false}.
func nullableString(s string) sql.NullString {
	if s == "" {
		return sql.NullString{}
	}
	return sql.NullString{String: s, Valid: true}
}

// nullableFloat64 converts zero to sql.NullFloat64{Valid: false}.
func nullableFloat64(f float64) sql.NullFloat64 {
	if f == 0 {
		return sql.NullFloat64{}
	}
	return sql.NullFloat64{Float64: f, Valid: true}
}

// nullableInt64 converts zero to sql.NullInt64{Valid: false}.
func nullableInt64(i int64) sql.NullInt64 {
	if i == 0 {
		return sql.NullInt64{}
	}
	return sql.NullInt64{Int64: i, Valid: true}
}

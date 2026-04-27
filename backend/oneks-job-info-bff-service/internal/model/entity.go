package model

import (
	"database/sql"
	"time"
)

// JobEntity maps to the JOBS table.
type JobEntity struct {
	ID           int64
	JobID        string
	StatusBadges []byte // JSONB — scanned as raw bytes, unmarshalled to []string
	CaNo         sql.NullString
	Segment      sql.NullString
	JobOwner     sql.NullString
	Total        float64
	TabType      string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}

// GeneralInfoEntity maps to the GENERAL_INFO table.
type GeneralInfoEntity struct {
	ID                    int64
	JobID                 string
	Branch                sql.NullString
	LoanContractDate      sql.NullString
	SpouseConsentDate     sql.NullString
	GuaranteeContractDate sql.NullString
	MortgageDate          sql.NullString
	AppraisalPrice        sql.NullFloat64
	SalePrice             sql.NullFloat64
	CreatedAt             time.Time
	UpdatedAt             time.Time
}

// CfaInfoEntity maps to the CFA_INFO table.
type CfaInfoEntity struct {
	ID              int64
	JobID           string
	TotalCreditOld  sql.NullFloat64
	TotalCreditNew  sql.NullFloat64
	CreditChange    sql.NullFloat64
	CfaOldDate      sql.NullString
	CfaCurrentRound sql.NullInt64
	DebtPeriodOld   sql.NullInt64
	DebtPeriodNew   sql.NullInt64
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// LoanApplicantEntity maps to the LOAN_APPLICANTS table.
type LoanApplicantEntity struct {
	ID              int64
	JobID           string
	FullName        string
	NationalID      sql.NullString
	Age             sql.NullInt64
	Nationality     sql.NullString
	Parents         sql.NullString
	MaritalStatus   sql.NullString
	BorrowerType    sql.NullString
	CollateralOwner bool
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// LoanDetailEntity maps to the LOAN_DETAILS table.
type LoanDetailEntity struct {
	ID                int64
	JobID             string
	LoanType          sql.NullString
	LoanAmount        sql.NullFloat64
	InterestRate      sql.NullFloat64
	LoanPeriod        sql.NullInt64
	InstallmentAmount sql.NullFloat64
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

// CollateralEntity maps to the COLLATERALS table.
type CollateralEntity struct {
	ID              int64
	JobID           string
	CollateralID    string
	CollateralType  sql.NullString
	TitleDeedNumber sql.NullString
	LandArea        sql.NullFloat64
	AppraisalPrice  sql.NullFloat64
	Location        sql.NullString
	CreatedAt       time.Time
	UpdatedAt       time.Time
}

// ContractEntity maps to the CONTRACTS table.
type ContractEntity struct {
	ID            int64
	JobID         string
	ContractID    string
	ContractType  sql.NullString
	CreditLimit   sql.NullFloat64
	BorrowerName  sql.NullString
	ReviewStatus  string
	DocumentLinks []byte // JSONB — scanned as raw bytes, unmarshalled to []string
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

package model

// UpdateJobInfoRequest is the request body for PUT /{jobId}.
// Both sections are optional; only provided sections are updated.
type UpdateJobInfoRequest struct {
	GeneralInfo *GeneralInfoUpdate `json:"generalInfo,omitempty"`
	CfaInfo     *CfaInfoUpdate     `json:"cfaInfo,omitempty"`
}

// GeneralInfoUpdate carries the updatable fields for general job information.
type GeneralInfoUpdate struct {
	Branch                string  `json:"branch"`
	LoanContractDate      string  `json:"loanContractDate"`
	SpouseConsentDate     string  `json:"spouseConsentDate"`
	GuaranteeContractDate string  `json:"guaranteeContractDate"`
	MortgageDate          string  `json:"mortgageDate"`
	AppraisalPrice        float64 `json:"appraisalPrice"`
	SalePrice             float64 `json:"salePrice"`
}

// CfaInfoUpdate carries the updatable fields for CFA information.
type CfaInfoUpdate struct {
	TotalCreditOld  float64 `json:"totalCreditOld"`
	TotalCreditNew  float64 `json:"totalCreditNew"`
	CreditChange    float64 `json:"creditChange"`
	CfaOldDate      string  `json:"cfaOldDate"`
	CfaCurrentRound int     `json:"cfaCurrentRound"`
	DebtPeriodOld   int     `json:"debtPeriodOld"`
	DebtPeriodNew   int     `json:"debtPeriodNew"`
}

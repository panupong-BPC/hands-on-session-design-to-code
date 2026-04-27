package model

// APIResponse is the standard response envelope used by all endpoints.
type APIResponse struct {
	Status  string `json:"status"`
	Data    any    `json:"data,omitempty"`
	Message string `json:"message"`
}

// JobInfoResponse is the full job information payload for GET /{jobId}.
type JobInfoResponse struct {
	JobID          string                  `json:"jobId"`
	StatusBadges   []string                `json:"statusBadges"`
	GeneralInfo    GeneralInfoResponse     `json:"generalInfo"`
	CfaInfo        CfaInfoResponse         `json:"cfaInfo"`
	LoanApplicants []LoanApplicantResponse `json:"loanApplicants"`
	LoanDetails    []LoanDetailResponse    `json:"loanDetails"`
	CollateralInfo CollateralInfo          `json:"collateralInfo"`
	Contracts      []ContractResponse      `json:"contracts"`
}

// GeneralInfoResponse holds general job information fields.
type GeneralInfoResponse struct {
	Branch                string  `json:"branch"`
	LoanContractDate      string  `json:"loanContractDate"`
	SpouseConsentDate     string  `json:"spouseConsentDate"`
	GuaranteeContractDate string  `json:"guaranteeContractDate"`
	MortgageDate          string  `json:"mortgageDate"`
	AppraisalPrice        float64 `json:"appraisalPrice"`
	SalePrice             float64 `json:"salePrice"`
}

// CfaInfoResponse holds CFA (Credit Facility Amendment) information fields.
type CfaInfoResponse struct {
	TotalCreditOld  float64 `json:"totalCreditOld"`
	TotalCreditNew  float64 `json:"totalCreditNew"`
	CreditChange    float64 `json:"creditChange"`
	CfaOldDate      string  `json:"cfaOldDate"`
	CfaCurrentRound int     `json:"cfaCurrentRound"`
	DebtPeriodOld   int     `json:"debtPeriodOld"`
	DebtPeriodNew   int     `json:"debtPeriodNew"`
}

// LoanApplicantResponse holds borrower/applicant information.
type LoanApplicantResponse struct {
	FullName        string `json:"fullName"`
	NationalID      string `json:"nationalId"`
	Age             int    `json:"age"`
	Nationality     string `json:"nationality"`
	Parents         string `json:"parents"`
	MaritalStatus   string `json:"maritalStatus"`
	BorrowerType    string `json:"borrowerType"`
	CollateralOwner bool   `json:"collateralOwner"`
}

// LoanDetailResponse holds loan product details.
type LoanDetailResponse struct {
	LoanType          string  `json:"loanType"`
	LoanAmount        float64 `json:"loanAmount"`
	InterestRate      float64 `json:"interestRate"`
	LoanPeriod        int     `json:"loanPeriod"`
	InstallmentAmount float64 `json:"installmentAmount"`
}

// CollateralInfo wraps the list of collateral items.
type CollateralInfo struct {
	Items []CollateralResponse `json:"items"`
}

// CollateralResponse holds information about a single collateral asset.
type CollateralResponse struct {
	CollateralID    string  `json:"collateralId"`
	CollateralType  string  `json:"collateralType"`
	TitleDeedNumber string  `json:"titleDeedNumber"`
	LandArea        float64 `json:"landArea"`
	AppraisalPrice  float64 `json:"appraisalPrice"`
	Location        string  `json:"location"`
}

// ContractResponse holds contract details with review status.
type ContractResponse struct {
	ContractID    string   `json:"contractId"`
	ContractType  string   `json:"contractType"`
	CreditLimit   float64  `json:"creditLimit"`
	BorrowerName  string   `json:"borrowerName"`
	ReviewStatus  string   `json:"reviewStatus"`
	DocumentLinks []string `json:"documentLinks"`
}

// WorkflowJobListItem is a single row in the Workflow Management jobs table.
type WorkflowJobListItem struct {
	JobNo         string   `json:"jobNo"`
	Status        string   `json:"status"`
	StatusBadges  []string `json:"statusBadges"`
	ApplicantName string   `json:"applicantName"`
	CifNo         string   `json:"cifNo"`
	CaNo          string   `json:"caNo"`
	Segment       string   `json:"segment"`
	JobOwner      string   `json:"jobOwner"`
	Total         float64  `json:"total"`
}

import type { JobInfoGetResponse, ContractDocument } from "../../../api/client/models/index";

export type { JobInfoGetResponse, ContractDocument };

/**
 * Frontend contract group type. The `documents` array uses the generated
 * ContractDocument shape (documentId / documentName / reviewed / documentUrl).
 * `cfaType` is an optional UI-only field for displaying a badge.
 */
export interface ContractGroup {
  contractId: string;
  contractType?: string | null;
  cfaType?: string | null;
  creditLimit?: number | null;
  documents?: ContractDocument[];
}

export interface JobInfoUIState {
  isEditingGeneral: boolean;
  isEditingCfa: boolean;
  activeContractTab: "contracts" | "documents" | "comments";
}

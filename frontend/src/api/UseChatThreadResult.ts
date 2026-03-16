import { CaseDto } from "models/CaseDto";

export interface UseChatThreadResult {

  caseData?: CaseDto

  loading: boolean
  error?: string

  fetchCase: (caseId: string) => Promise<void>
  sendMessage: (content: string) => Promise<void>
}
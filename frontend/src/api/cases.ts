import api from "axios"
import { CaseDto } from "../types/case"

export async function fetchCase(caseId: string): Promise<CaseDto> {
  const response = await api.get(`/cases/${caseId}`)
  return response.data
}

export async function sendMessage(caseId: string, content: string) {
  await api.post(`/cases/${caseId}/messages`, { content })
}

export async function markAsRead(caseId: string) {
  await api.post(`/cases/${caseId}/read`)
}
import { httpClient } from "./httpClient"
import { CaseDto } from "../types/case"

export async function fetchCase(caseId: string): Promise<CaseDto> {
  const response = await httpClient.get(`/cases/${caseId}`)
  return response.data
}

export async function sendMessage(caseId: string, content: string) {
  await httpClient.post(`/cases/${caseId}/messages`, { content })
}

export async function markAsRead(caseId: string, token: string) {
  await httpClient.post(
    `/cases/${caseId}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
}

export interface MessageDto {
  id: string
  caseId: string
  senderRole: string
  content: string
  createdAt: string
  isRead?: boolean
  isReadByAdmin?: boolean
  isReadByPatient?: boolean
  senderId: string
}

export interface CaseDto {
  id: string
  status: string
  messages: MessageDto[]
}

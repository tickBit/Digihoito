export interface MessageDto {
  id: string
  senderRole: string
  content: string
  createdAt: string
  isRead: boolean
  senderId: string
}

export interface CaseDto {
  id: string
  status: string
  messages: MessageDto[]
}
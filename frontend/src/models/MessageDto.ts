export interface MessageDto {
  id: string;
  senderId: string;
  senderRole: string;
  content: string;
  createdAt: string;
  isReadByAdmin: boolean;
  isReadByPatient: boolean;
}
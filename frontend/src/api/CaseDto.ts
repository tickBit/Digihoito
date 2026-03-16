import { MessageDto } from "models/MessageDto";

export interface CaseDto {
  id: string;
  isLocked: boolean;
  unreadCount: number;
  messages: MessageDto[];
}
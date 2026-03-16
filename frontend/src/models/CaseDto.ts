import { MessageDto } from "./MessageDto";

export interface CaseDto {
  id: string;
  isLocked: boolean;
  unreadCount: number;
  messages: MessageDto[];
}


import { httpClient } from "./httpClient";
import { CaseDto } from "../models/CaseDto";

export const caseApi = {
  async getCase(caseId: string): Promise<CaseDto> {
    const response = await httpClient.get(`/cases/${caseId}`);
    return response.data;
  },

  async sendMessage(caseId: string, content: string): Promise<void> {
    await httpClient.post(`/cases/message`, {
      caseId,
      content
    });
  }
};
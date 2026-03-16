import { useState } from "react";
import { caseApi } from "../api/caseApi";
import { CaseDto } from "../models/CaseDto";
import { UseChatThreadResult } from "../api/UseChatThreadResult";

export function useChatThread(caseId: string): UseChatThreadResult {
  const [caseData, setCaseData] = useState<CaseDto>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  async function fetchCase() {
    try {
      setLoading(true);

      const response = await caseApi.getCase(caseId);
      setCaseData(response);

    } catch (e) {
      setError("Failed to fetch case: " + e);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage(content: string) {
    try {
      await caseApi.sendMessage(caseId, content);

      // Refresh thread after sending
      await fetchCase();

    } catch (e) {
      setError("Failed to send message: " + e);
    }
  }

  return {
    caseData,
    loading,
    error,
    fetchCase,
    sendMessage
  };
}
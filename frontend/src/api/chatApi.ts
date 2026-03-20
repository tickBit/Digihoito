import axios from "axios";

const API = "http://localhost:5199";

export const createCase = async (message: string, token: string) => {
  const res = await axios.post(
    `${API}/cases`,
    { initialMessage: message },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

export const getCases = async (token: string) => {
  const res = await axios.get(
    `${API}/cases`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

export const getCase = async (id: string, token: string) => {
  const res = await axios.get(
    `${API}/cases/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};

export const sendMessage = async (
  caseId: string,
  content: string,
  token: string
) => {
  await axios.post(
    `${API}/cases/${caseId}/messages`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
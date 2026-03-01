export interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  token: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
}
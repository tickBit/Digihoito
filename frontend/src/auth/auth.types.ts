export interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  token: string | null;
  userRole: number | null;
  login: (email: string, token: string, role: number) => void;
  logout: () => void;
}
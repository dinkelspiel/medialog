export interface LoginResponse {
  user?: {
    username: string;
    email: string;
  };
  sessionToken?: string;
  error?: string;
}

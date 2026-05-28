export type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

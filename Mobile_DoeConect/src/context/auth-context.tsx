import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type PropsWithChildren,
} from 'react';
import { authService } from '@/features/auth/services/auth-service';
import type { Usuario, LoginPayload, ApiError } from '@/types';

type AuthState = {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type AuthContextValue = AuthState & {
  signIn: (payload: LoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Restaura sessão ao abrir o app
  useEffect(() => {
    authService.restoreSession().then((session) => {
      if (session) {
        setState({
          usuario: session.usuario,
          token: session.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    });
  }, []);

  const signIn = useCallback(async (payload: LoginPayload) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const session = await authService.login(payload);
      setState({
        usuario: session.usuario,
        token: session.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const apiError = err as ApiError;
      setState((s) => ({
        ...s,
        isLoading: false,
        error: apiError.message ?? 'Erro ao fazer login.',
      }));
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setState({
      usuario: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

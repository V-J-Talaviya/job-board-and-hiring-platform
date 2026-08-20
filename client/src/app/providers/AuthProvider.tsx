import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/types";
import { authApi } from "@/services/authApi";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "RECRUITER" | "CANDIDATE",
  ) => Promise<User>;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jobboard_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then((fetchedUser) => setUserState(fetchedUser))
      .catch(() => {
        localStorage.removeItem("jobboard_token");
      })
      .finally(() => setIsLoading(false));
  }, []);

  function persistSession(nextUser: User, token: string) {
    localStorage.setItem("jobboard_token", token);
    setUserState(nextUser);
  }

  async function login(email: string, password: string) {
    const { user: loggedInUser, token } = await authApi.login({
      email,
      password,
    });
    persistSession(loggedInUser, token);
    return loggedInUser;
  }

  async function register(
    name: string,
    email: string,
    password: string,
    role: "RECRUITER" | "CANDIDATE",
  ) {
    const { user: registeredUser, token } = await authApi.register({
      name,
      email,
      password,
      role,
    });
    persistSession(registeredUser, token);
    return registeredUser;
  }

  async function logout() {
    await authApi.logout().catch(() => {});
    localStorage.removeItem("jobboard_token");
    setUserState(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        setUser: setUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

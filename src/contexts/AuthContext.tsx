import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextData = {
  user: string | null;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  function signIn() {
    setUser("user-logado");
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

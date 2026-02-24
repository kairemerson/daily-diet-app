import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getUser, removeUser, saveUser, StoredUser } from "../storage/userStorage";
import { api, registerSignOut } from "../services/api";


type AuthContextData = {
  user: StoredUser | null;
  token: string | null
  loading: boolean
  signIn: (user: StoredUser, token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null);

  async function signIn(userData: StoredUser, userToken: string) {
    setUser(userData);
    setToken(userToken)

    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${userToken}`;

    await saveUser(userData, userToken)
  }  

  async function signOut() {
    setUser(null);
    setToken(null)

    delete api.defaults.headers.common["Authorization"];


    await removeUser()
  }

  async function loadUser() {
      try {
        const storedData = await getUser()

        if(storedData) {
          setUser(storedData.user)
          setToken(storedData.token)

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedData.token}`;
        }
      } catch (error) {
        console.log("Erro ao restaurar sessão", error);
        await signOut()
      } finally {
        setLoading(false)
      }
      
    }

  useEffect(() => {
    loadUser()
  }, [])

  useEffect(() => {
    registerSignOut(signOut);
  }, [signOut]);


  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

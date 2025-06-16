// client/src/context/LoginContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  avatarUrl?: string;
}

interface LoginContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User, stayLoggedIn?: boolean) => void;
  logout: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate();

  // Chargement initial des données de connexion depuis le localStorage.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Fonction de connexion.
  const login = (newToken: string, newUser: User, stayLoggedIn = true) => {
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);

    // Sauvegarde dans local storage si l'utilisateur veux rester connecté.
    if (stayLoggedIn) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  // Fonction de déconnexion.
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <LoginContext.Provider
      value={{ isAuthenticated, token, user, login, logout }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = (): LoginContextType => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

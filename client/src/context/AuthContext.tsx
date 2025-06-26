// client/src/context/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  service_id: number;
  picture: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean; // 🔸 Ajouté
  login: (mail: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  // Chargement initial des données de connexion depuis le localStorage.
  // Ajoute un état de chargement pour éviter les rendus prématurés.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setIsLoading(false); //  Fin du chargement
  }, []);

  // Fonction de connexion
  const login = async (mail: string, password: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mail, password }),
        },
      );

      if (!response.ok) {
        throw new Error("Identifiants invalides");
      }

      const user = await response.json();

      const newToken = "fake-token"; // A remplacer par la logique de génération de token réelle

      setToken(newToken);
      setUser(user);
      setIsAuthenticated(true);

      // Sauvegarde dans local storage si l'utilisateur veux rester connecté.
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      // Gère l'erreur (affiche un message, etc.)
      console.error(error);
      throw error;
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
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, logout, isLoading }} // 🔸 Ajouté ici aussi
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useLogin = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

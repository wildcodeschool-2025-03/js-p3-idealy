// client/src/context/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  service_id: number;
  picture: string;
  isAdmin: boolean;
  service?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  login: (mail: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

    setIsLoading(false);
  }, []);

  const updateUser = (updatedUserData: User) => {
    setUser(updatedUserData); // Met à jour le state
    localStorage.setItem("user", JSON.stringify(updatedUserData)); // Sauvegarde dans le navigateur
  };

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

      const userFromApi = await response.json(); // recupere les données utilisateurs depuis l'API

      // recupere le nom du service depuis l'id utilisateur
      const serviceResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userFromApi.id}/service`,
      );
      const serviceData = await serviceResponse.json(); // extrait le nom du service

      // Combine les données utilisateur + le nom du service
      const completeUser = {
        ...userFromApi, // garde toutes les données : firstname, lastname etc...
        service: serviceData.service_name, // ajoute le nom du service
      };

      const newToken = "fake-token"; // A remplacer par la logique de génération de token réelle

      setToken(newToken);
      setUser(completeUser);
      setIsAuthenticated(true);

      // Sauvegarde dans local storage si l'utilisateur veux rester connecté.
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(completeUser));
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

  // Recupère les nouvelles données depuis handleSaveProfile + met à jour le contexte
  const refreshUser = async () => {
    if (user?.id) {
      try {
        // requete 1 : recupere toutes les données dont l'id du service
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}?t=${Date.now()}`,
        ); // Date.now = évite le cache du navigateur
        const userData = await response.json();

        // requete 2 : recupere le nom du service depuis l'id
        const serviceResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}/service`,
        );
        const serviceData = await serviceResponse.json();

        const completeUserData = {
          ...userData, // récupère firstname, lastname etc...
          service: serviceData.service_name, // remplace ou ajoute la propriété service
        };

        updateUser(completeUserData); // met à jour le contexte et sauvegarde dans le localStorage (ligne 52)
      } catch (error) {
        console.error("Erreur lors du refresh user:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        user,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
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

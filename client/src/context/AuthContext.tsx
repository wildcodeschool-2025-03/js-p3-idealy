// client/src/context/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { authFetch } from "../utils/authFetch";
import { isTokenExpired } from "../utils/isTokenExpired";
import "react-toastify/dist/ReactToastify.css";

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
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const navigate = useNavigate();

  // Chargement initial des données de connexion depuis le localStorage.
  // Ajoute un état de chargement pour éviter les rendus prématurés.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedUserId && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);

      // Récupérer les données utilisateur depuis l'API
      fetchUserData(storedUserId);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fonction pour récupérer les données utilisateur
  const fetchUserData = async (userId: string) => {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
      );
      const userData = await response.json();

      const serviceResponse = await authFetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/service`,
      );
      const serviceData = await serviceResponse.json();

      const completeUserData = {
        ...userData,
        service: serviceData.service_name,
      };

      setUser(completeUserData);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error,
      );
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Vérifie régulièrement si le token a été supprimé manuellement ou s'il est expiré
  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");

      if (!storedToken || isTokenExpired(storedToken) || !storedUserId) {
        if (isAuthenticated) {
          console.warn("Token manquant ou expiré, affichage d'une alerte");
          setIsSessionExpired(true);
          setTimeout(() => {
            logout();
          }, 3000);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const updateUser = (updatedUserData: User) => {
    setUser(updatedUserData);
    // Ne plus sauvegarder les données complètes en localStorage
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

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id.toString()); // Stocker uniquement l'ID
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Fonction de déconnexion.
  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsSessionExpired(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Supprimer l'ID au lieu des données complètes
    navigate("/");
  };

  // Recupère les nouvelles données depuis handleSaveProfile + met à jour le contexte
  const refreshUser = async () => {
    if (user?.id) {
      try {
        // requete 1 : recupere toutes les données dont l'id du service
        const response = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}?t=${Date.now()}`,
        ); // Date.now = évite le cache du navigateur
        const userData = await response.json();

        // requete 2 : recupere le nom du service depuis l'id
        const serviceResponse = await authFetch(
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

  const deleteAccount = async () => {
    if (user?.id) {
      try {
        // Transfer ideas to user_id=2
        await authFetch(
          `${import.meta.env.VITE_API_URL}/api/ideas/transfer-to-user-2`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          },
        );

        // Transfer comments to user_id=2
        await authFetch(
          `${import.meta.env.VITE_API_URL}/api/comments/transfer-to-user-2`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          },
        );

        // Delete user votes
        await authFetch(
          `${import.meta.env.VITE_API_URL}/api/votes/delete-user-votes`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          },
        );

        // Finally, delete the user
        const response = await authFetch(
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}`,
          {
            method: "DELETE",
          },
        );

        if (response.ok) {
          logout();
        } else {
          throw new Error("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Erreur suppression compte:", error);
        throw error;
      }
    }
  };

  useEffect(() => {
    if (isSessionExpired) {
      toast.error(
        "Votre session a expiré, redirection vers la page de connexion...",
      );
    }
  }, [isSessionExpired]);

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
        deleteAccount,
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

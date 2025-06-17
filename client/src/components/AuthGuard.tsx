// client/src/components/AuthGuard.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Rediriger si l'utilisateur n'est pas connecté
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <>{children}</> : null;
};

export default AuthGuard;

// Exemple d'utilisation dans une route protégée
// import AuthGuard from "../components/AuthGuard";
//
// const Dashboard = () => {
//  return (
//    <AuthGuard>
//      <div className="p-4">
//        <h1>Bienvenue dans le tableau de bord</h1>
//        {/* Le contenu réservé aux utilisateurs connectés */}
//      </div>
//    </AuthGuard>
//  );
//};
//
//export default Dashboard;

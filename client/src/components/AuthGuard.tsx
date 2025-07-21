// client/src/components/AuthGuard.tsx

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useLogin } from "../context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, user, isLoading } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  // Rediriger vers "/" si non connecté, sauf sur la page "/"
  useEffect(() => {
    if (isLoading) return;

    const isPublic = location.pathname === "/";
    if (!isAuthenticated && !isPublic) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, location.pathname, navigate]);

  // Rediriger vers "/forbidden" si un non-admin tente d'accéder à "/admin"
  useEffect(() => {
    if (isLoading) return;

    if (location.pathname === "/admin" && (!user || !user.isAdmin)) {
      navigate("/forbidden", { replace: true });
    }
  }, [location.pathname, user, isLoading, navigate]);

  if (isLoading) return null;

  return isAuthenticated || location.pathname === "/" ? <>{children}</> : null;
};

export default AuthGuard;

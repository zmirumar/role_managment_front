import { useAuthStore } from "../../../store/useAuthStore";
import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface IPublicRoute {
  children: ReactNode;
}

const PublicRoute: FC<IPublicRoute> = ({ children }) => {
  const { isLogged } = useAuthStore();

  if (isLogged) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

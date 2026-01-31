import { useAuthStore } from "../../../store/useAuthStore";
import type { FC } from "react";
import { Navigate } from "react-router-dom";
import type { IPublicRoute } from "../../../interfaces/interfaces";

const PublicRoute: FC<IPublicRoute> = ({ children }) => {
  const { isLogged } = useAuthStore();

  if (isLogged) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;

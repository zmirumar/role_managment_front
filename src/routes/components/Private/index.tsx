import { Navigate } from "react-router-dom";
import type { FC, ReactNode } from "react";
import { routes } from "../../../constants/routes";
import { useAuthStore } from "../../../store/useAuthStore";

interface IPrivateRoute {
  children: ReactNode;
}

const PrivateRoute: FC<IPrivateRoute> = ({ children }) => {
  const { isLogged } = useAuthStore();

  if (!isLogged) {
    return <Navigate to={routes.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

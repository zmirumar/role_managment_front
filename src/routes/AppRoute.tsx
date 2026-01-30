import React from "react";
import { privateRoutes, publicRoutes } from "./routes";
import NotFound from "./components/NotFound";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./components/Public";
import Private from "./components/Private";
import { useAuthStore } from "../store/useAuthStore";
import { routes } from "../constants/routes";

const AppRoute = () => {
  const { user } = useAuthStore();

  return (
    <Routes>
      {publicRoutes.map((el) => (
        <React.Fragment key={el.path}>
          <Route
            path={el.path}
            element={
              <PublicRoute>
                <el.element />
              </PublicRoute>
            }
          />
        </React.Fragment>
      ))}
      {privateRoutes.map((el) => {
        const isOwnerRoute = el.path === routes.ADMIN_DASHBOARD;

        return (
          <React.Fragment key={el.path}>
            <Route
              path={el.path}
              element={
                <Private>
                  {isOwnerRoute ? (
                    user?.role === "OWNER" ? (
                      <el.element />
                    ) : (
                      <NotFound />
                    )
                  ) : (
                    <el.element />
                  )}
                </Private>
              }
            />
          </React.Fragment>
        );
      })}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoute;

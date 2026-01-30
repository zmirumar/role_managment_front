import { routes } from "../constants/routes";
import Register from "../features/Auth/Register";
import AdminDashboard from "../pages/Admin";
import Auth from "../pages/Auth";
import CreatePost from "../pages/CreatePost";
import Home from "../pages/Home";


export const publicRoutes = [
  {
    path: routes.LOGIN,
    element: Auth,
  },
  {
    path: routes.REGISTER,
    element: Register,
  },
];

export const privateRoutes = [
  {
    path: routes.HOME,
    element: Home,
  },
  {
    path: routes.CREATE_POST,
    element: CreatePost,
    permission: "post.create",
  },
  {
    path: routes.ADMIN_DASHBOARD,
    element: AdminDashboard,
    permission: "admin.access",
  }
];

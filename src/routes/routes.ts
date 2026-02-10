import { routes } from "../constants/routes";
import Register from "../features/Auth/Register";
import AdminDashboard from "../features/Admin"; // Changed from pages/Admin as we refactored
import Users from "../features/Admin/Users";
import Permissions from "../features/Admin/Permissions";
import Counters from "../features/Counters";
import Fruits from "../features/Fruits";
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
  },
  {
    path: routes.ADMIN_USERS,
    element: Users,
  },
  {
    path: routes.ADMIN_PERMISSIONS,
    element: Permissions,
  },
  {
    path: routes.COUNTERS,
    element: Counters,
    permission: "page.counters",
  },
  {
    path: routes.FRUITS,
    element: Fruits,
    permission: "page.fruits",
  },
];






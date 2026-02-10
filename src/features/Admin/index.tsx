import { Navigate } from 'react-router-dom';

export default function AdminDash() {
  // Redirect to Users by default
  return <Navigate to="/admin/users" replace />;
}

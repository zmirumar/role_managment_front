import { Navigate } from 'react-router-dom';

export default function AdminDash() {
  return <Navigate to="/admin/users" replace />;
}

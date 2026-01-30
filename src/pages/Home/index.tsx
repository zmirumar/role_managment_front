import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import Posts from '../../features/Posts'
import { routes } from '../../constants/routes';

function Home() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      {user?.role === 'OWNER' && (
        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={() => navigate(routes.ADMIN_DASHBOARD)}
            size="large"
          >
            Admin Dashboard
          </Button>
        </div>
      )}
      <Posts />
    </div>
  )
}

export default Home

import CreatePosts from '../../features/CreatePost'
import { useNavigate } from 'react-router-dom'
import { routes } from '../../constants/routes'

function CreatePost() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(routes.HOME);
  };

  return (
    <div>
      <CreatePosts onSuccess={handleSuccess} />
    </div>
  )
}

export default CreatePost

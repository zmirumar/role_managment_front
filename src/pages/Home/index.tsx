import Posts from '../../features/Posts'
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { useEffect } from 'react';
import { HomeContainer } from './styles';

function Home() {
  const { data, isLoading, error, refetch } = useCustomQuery<any[]>({
    method: "GET",
    url: "/posts",
  });

  useEffect(() => {
    const handleUpdate = () => refetch();
    window.addEventListener('posts-updated', handleUpdate);
    return () => window.removeEventListener('posts-updated', handleUpdate);
  }, [refetch]);

  return (
    <HomeContainer>
      <Posts data={data as any} isLoading={isLoading} error={error} />
    </HomeContainer>
  )
}

export default Home

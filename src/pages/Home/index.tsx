import Posts from '../../features/Posts'
import { useCustomQuery } from '../../hooks/useCustomQuery';
import { useEffect } from 'react';

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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Posts data={data as any} isLoading={isLoading} error={error} />
    </div>
  )
}

export default Home

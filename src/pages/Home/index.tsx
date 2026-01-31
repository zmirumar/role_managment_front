import Posts from '../../features/Posts'
import { useCustomQuery } from '../../hooks/CustomQuery/useCustomQuery';
import { HomeContainer } from './styles';

function Home() {
  const { data, isLoading, error } = useCustomQuery<any[]>({
    method: "GET",
    url: "/posts",
  });

  return (
    <HomeContainer>
      <Posts data={data as any} isLoading={isLoading} error={error} />
    </HomeContainer>
  )
}

export default Home

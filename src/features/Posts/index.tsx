import { useCustomQuery } from "../../hooks/useCustomQuery";

function Posts() {
  const {data, isLoading, error} = useCustomQuery({
    method: "GET",
    url: "/posts",
  });

  if(isLoading){
    return <div>Loading...</div>
  }
  if(error){
    return <div>Error: {error.message}</div>
  }
  return (
    <div>
      <h1>Posts</h1>
{data?.map((post: any) => (
  <div
    key={post.id}
    style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
  >
    <h2>{post.title}</h2>
    <p>{post.content}</p>
  </div>
))}

    </div>
  )
}

export default Posts

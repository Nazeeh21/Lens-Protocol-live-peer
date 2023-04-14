import { useExplorePublications } from "@lens-protocol/react-web";
import { useEffect } from "react";
import Post from "../Post";

const ExploreFeed = () => {
  const { data, loading, hasMore, next } = useExplorePublications();

  useEffect(() => {
    console.log("data : ", data);
  }, [data]);

  if (loading) return <>Loading...</>;
  return (
    <>
      {typeof data !== undefined && data?.map((post, index) => (
        <Post key={index} postData={post} />
      ))}
    </>
  );
};

export default ExploreFeed;

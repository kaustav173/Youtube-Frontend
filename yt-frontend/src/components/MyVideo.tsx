import { useMyVideo } from "../hooks/useMyVideo";

function MyVideo() {
  const { data, isFetching, error } = useMyVideo();
  if (isFetching) {
    return <div>is Fetching ....</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  console.log("my video", data);
  return <div>MyVideo</div>;
}

export default MyVideo;

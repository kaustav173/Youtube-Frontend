import { Link, useParams } from "react-router";
import { useAVideo } from "../hooks/useAVideo";
import AllVideo from "../components/AllVideo";
// import Comments from "../components/Comments";
import { useRef } from "react";

function VideoPlay() {
  const id = useParams();
  const video = useRef(null);
  console.log(id);
  const { data, isFetching } = useAVideo(id);

  if (isFetching) {
    return <div>is Fetching...</div>;
  }

  const handlePip = () => {};

  return (
    <>
      <div className="flex flex-row gap-350 mb-10 mt-5 text-2xl font-bold px-3">
        <Link to="/home">
          <span>Welcome to Youtube</span>
        </Link>
        <Link to="/profile">My Profile</Link>
      </div>
      <div className="grid grid-cols-2 px-3">
        <div className="">
          <video controls width="1200" className="flex flex-col-1">
            <source src="/shared-assets/videos/flower.webm" type="video/webm" />
            <source
              src={
                `https://test-dev-sena.s3.ap-south-1.amazonaws.com/` +
                data.videoKey
              }
              type="video/mp4"
            />
          </video>
          <button onChange={handlePip}>Toogle Piip</button>
          <div className="flex flex-col gap-4">
            <span className="border rounded-md px-3 py-2 font-bold text-3xl">
              {data.title}
            </span>
            <span className="font-thin">{data.description}</span>
          </div>
          {/* <Comments /> */}
        </div>
        <div>
          <AllVideo />
        </div>
      </div>
    </>
  );
}

export default VideoPlay;

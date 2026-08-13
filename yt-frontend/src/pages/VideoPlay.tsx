import { Link, useParams } from "react-router";
import { useAVideo } from "../hooks/useAVideo";
import AllVideo from "../components/AllVideo";
import { useEffect, useRef, useState } from "react";

function VideoPlay() {
  const id = useParams();

  const { data, isFetching } = useAVideo(id);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [pipMode, setPipMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "i") {
        return;
      }

      const video = videoRef.current;

      if (!video) {
        return;
      }

      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          return;
        }

        if (document.pictureInPictureEnabled) {
          await video.requestPictureInPicture();
        }
      } catch (error) {
        console.error("PiP error:", error);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleEnterPiP = () => {
      setPipMode(true);
    };

    const handleLeavePiP = () => {
      setPipMode(false);
    };

    document.addEventListener("enterpictureinpicture", handleEnterPiP);

    document.addEventListener("leavepictureinpicture", handleLeavePiP);

    return () => {
      document.removeEventListener("enterpictureinpicture", handleEnterPiP);

      document.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, []);

  if (isFetching) {
    return <div>is Fetching...</div>;
  }

  if (!data) {
    return <div>Video not found</div>;
  }

  return (
    <>
      <div className="flex flex-row justify-between mb-10 mt-5 text-2xl font-bold px-3">
        <Link to="/home">
          <span>Welcome to Youtube</span>
        </Link>

        <Link to="/profile">My Profile</Link>
      </div>

      <div className="grid grid-cols-2 px-3 gap-5">
        <div>
          <video
            ref={videoRef}
            controls
            width="100%"
            className="rounded-2xl"
            src={`https://test-dev-sena.s3.ap-south-1.amazonaws.com/${data.videoKey}`}
          />

          <div className="flex flex-col gap-4 mt-4">
            <span className="border rounded-md px-3 py-2 font-bold text-3xl">
              {data.title}
            </span>

            <span className="font-thin">{data.description}</span>
          </div>
        </div>

        <div>
          <AllVideo />
        </div>
      </div>
    </>
  );
}

export default VideoPlay;

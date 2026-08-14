import { Link, useParams } from "react-router";
import { useAVideo } from "../hooks/useAVideo";
import AllVideo from "../components/AllVideo";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";

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
      <div className="px-3 py-3">
        <Header />
      </div>

      <div className="grid grid-cols-2 px-3 gap-5 mt-6 justify-center">
        <div className="overflow-hidden h-scrren">
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

        <div className="overflow-y-auto h-screen [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AllVideo />
        </div>
      </div>
    </>
  );
}

export default VideoPlay;

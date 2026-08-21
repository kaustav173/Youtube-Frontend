import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../store/store";

const MiniCard = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const {
    pipMode,
    setPipMode,
    pipVideoId,
    pipVideoUrl,
    pipVideoTitle,
    pipCurrentTime,
    setPipCurrentTime,
    pipVideoChannelName,
  } = useStore();

  useEffect(() => {
    if (!pipMode) {
      return;
    }

    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;

    video.currentTime = pipCurrentTime;

    video.play();
  }, [pipMode, pipVideoUrl, pipCurrentTime]);

  useEffect(() => {
    if (!pipMode) {
      return;
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "i") {
        return;
      }
      if (!videoRef.current) {
        return;
      }
      setPipCurrentTime(videoRef.current.currentTime);
      setPipMode(false);
      navigate(`/video/${pipVideoId}`);
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [pipMode, pipVideoId, navigate, setPipCurrentTime, setPipMode]);

  if (!pipMode) {
    return null;
  }

  return (
    <div className="fixed bottom-[30px] right-[30px] z-9999 w-[400px] h-[300px] rounded-2xl shadow-[0_8px_6px_-6px_rgba(0,0,0,1)] bg-white">
      <div className="flex flex-col">
        <video
          ref={videoRef}
          className="w-[400px] h-[230px] rounded-t-2xl"
          controls
          src={pipVideoUrl}
        />

        <div className="px-[15px]">
          <p className="mt-[10px] h-[25px] overflow-hidden font-bold">
            {pipVideoTitle}
          </p>

          <p className="text-gray-500">{pipVideoChannelName}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniCard;
 
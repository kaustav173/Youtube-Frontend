import { useParams } from "react-router";
import { useAVideo } from "../hooks/useAVideo";
import AllVideo from "../components/AllVideo";
import { useEffect, useRef } from "react";
import Header from "../components/Header";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { useReaction } from "../hooks/useReaction";
import Comments from "../components/Comments";

function VideoPlay() {
  const { id } = useParams<{ id: string }>();
  const { data, isFetching } = useAVideo(id);
  const mutation = useReaction();

  const videoRef = useRef<HTMLVideoElement>(null);
  // const [pipMode, setPipMode] = useState(false);

  const handleReaction = (type: "LIKE" | "DISLIKE") => {
    if (!id) return;
    mutation.mutate({ id, type });
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "i") return;
      const video = videoRef.current;
      if (!video) return;

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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // useEffect(() => {
  //   // const handleEnterPiP = () => setPipMode(true);
  //   // const handleLeavePiP = () => setPipMode(false);

  //   // document.addEventListener("enterpictureinpicture", handleEnterPiP);
  //   // document.addEventListener("leavepictureinpicture", handleLeavePiP);

  //   // return () => {
  //   //   document.removeEventListener("enterpictureinpicture", handleEnterPiP);
  //   //   document.removeEventListener("leavepictureinpicture", handleLeavePiP);
  //   };
  // }, []);

  if (isFetching) return <div>is Fetching...</div>;
  if (!data) return <div>Video not found</div>;

  return (
    <>
      <div className="px-3 py-3">
        <Header />
      </div>

      <div className="grid grid-cols-2 px-3 gap-5 mt-6 justify-center">
        <div className="overflow-hidden h-screen">
          <video
            ref={videoRef}
            controls
            width="100%"
            className="rounded-2xl"
            src={`https://test-dev-sena.s3.ap-south-1.amazonaws.com/${data.videoKey}`}
          />

          <div className="flex flex-col gap-4 mt-4">
            <span className="border rounded-md px-3 py-2">
              <div className="flex flex-row gap-60 items-center">
                <span className="font-bold text-3xl">{data.title}</span>

                <div className="flex items-center gap-4">
                  <AiFillLike
                    className={`mt-3 text-2xl cursor-pointer transition-colors ${
                      mutation.isPending ? "opacity-60" : "hover:text-blue-500"
                    }`}
                    onClick={() => handleReaction("LIKE")}
                  />
                  <AiFillDislike
                    className={`mt-3 text-2xl cursor-pointer transition-colors ${
                      mutation.isPending ? "opacity-60" : "hover:text-red-500"
                    }`}
                    onClick={() => handleReaction("DISLIKE")}
                  />
                </div>
              </div>
            </span>

            <span className="font-thin">{data.description}</span>
          </div>

          <span>Like Count : {data.likeCount}</span>
          <br />
          <span>Dislike Count : {data.dislikeCount}</span>
          <Comments id={id} />
        </div>

        <div className="overflow-y-auto h-screen [scrollbar:none] [&::-webkit-scrollbar]:hidden">
          <AllVideo />
        </div>
      </div>
    </>
  );
}

export default VideoPlay;

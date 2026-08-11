import React from "react";
import { useParams } from "react-router";

function VideoPlay() {
  const id = useParams();
  console.log(id);
  return (
    <div>
      <h1 className="text-3xl">Youtube</h1>
    </div>
  );
}

export default VideoPlay;

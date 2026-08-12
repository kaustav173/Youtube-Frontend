import { useState } from "react";
import { useNavigate } from "react-router";
import { Button, message, Upload } from "antd";
import { initiateVideo } from "../api/uploadVideo";

function UploadFile() {
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [data, setData] = useState(false);
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(image);
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://yt-assesment.onrender.com/api/v1/uploads/thumbnails/presign",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: image,
          contentType: "image/jpeg",
        }),
      },
    );
    console.log("res");
    const data = await res.json();
    if (data.success) {
      let result = initiateVideo(video);
      if (result) {
        setData(true);
      }
    } else {
      console.log("err");
    }
  };
  return (
    <div>
      <span className="text-xl font-thin mb-2">Upload Your New Video</span>

      <div className="flex flex-col">
        <div className="">
          <form onSubmit={handleUpload}>
            <label className="text-sm mb-2 mt-2 flex">Image</label>
            <input
              type="file"
              id="file-input"
              name="ImageStyle"
              className="border rounded-full px-2 w-35"
              onChange={(e) => setImage(e.target.value)}
            />
            <label className="flex flex-col mt-2 mb-3">Upload Video</label>
            <Upload
              className="mt-3 mb-3"
              accept=".mp4"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              maxCount={1}
              onChange={(e) => setVideo(e.target.value)}
            >
              <Button>Upload</Button>
            </Upload>
            <br></br>
            <button
              type="submit"
              className="border 
             mt-2 px-3 bg-emerald-300"
            >
              Upload
            </button>
            {data && <p className="mt-2  font-bold">Successfully Uploaded..</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;

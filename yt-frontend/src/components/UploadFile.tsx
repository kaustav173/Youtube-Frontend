import React, { useState } from "react";
import { useNavigate } from "react-router";
// import { Button, message, Upload } from "antd";
import { initiateVideo } from "../api/uploadVideo";

function UploadFile() {
  // const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const handleImageUpload = async (e: React.FormEvent<HTMLFormElement>) => {
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
      setData(true);
    } else {
      console.log("err");
    }
  };

  const handleFileChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  };
  const handleFileUpload = () => {
    const url = initiateVideo(file);
    setFileUrl(url);
  };
  return (
    <div>
      <span className="text-xl font-thin mb-2">Upload Your New Video</span>

      <div className="flex flex-col">
        <div className="">
          <form onSubmit={handleImageUpload}>
            <label className="text-sm mb-2 mt-2 flex">Image</label>
            <input
              type="file"
              id="file-input"
              name="ImageStyle"
              className="border rounded-full px-2 w-50"
              onChange={(e) => setImage(e.target.value)}
            />
            <br></br>
            <button
              type="submit"
              className="border rounded
             mt-2 px-3 bg-emerald-300"
            >
              Upload Thumbnail Image
            </button>
            {data && <p className="mt-2  font-bold">Successfully Uploaded..</p>}
          </form>
          <form onSubmit={handleFileUpload}>
            <label className="flex flex-col mt-2 mb-3">Upload Video</label>
            <input type="file" onChange={handleFileChange} />
            <button
              disabled={!file}
              type="submit"
              className="border rounded
             mt-2 px-3 bg-emerald-300"
            >
              Upload
            </button>
            <hr />
            <br />
            <br />
            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                View Uploaded File
              </a>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;

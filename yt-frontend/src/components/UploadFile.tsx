import { useState } from "react";

function UploadFile() {
  const [image, setImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailKey, setThumbnailkey] = useState("");
  const [videoKey, setVideoKey] = useState("");
  const [category, setCategory] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    if (imageFile) {
      console.log(imageFile);
      setImage(imageFile);
    }
  };

  const handleImageUpload = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    if (!image) return;
    try {
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
            fileName: image.name,
            contentType: image.type,
          }),
        },
      );
      const data = await res.json();
      if (data.success) {
        const res = await fetch(data.data.url, {
          method: "PUT",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });
        const imagekey = res.url;
        console.log(imagekey);
        setThumbnailkey(imagekey);
      } else {
        console.log("err");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const videoFile = e.target.files?.[0];
    if (videoFile) setFile(videoFile);
  };

  const handleFileUpload = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();

    if (!file) {
      return;
    }
    const token = localStorage.getItem("token");
    const CHUNK_SIZE = 5 * 1024 * 1024;

    const initiateVideo = async (file: File) => {
      const fileName = file.name;
      const fileType = file.type;
      const fileSize = file.size;
      let uploadId = "";
      const parts: {
        url: string;
        PartNumber: number;
        etag: string;
      }[] = [];
      try {
        const startUploadResponse = await fetch(
          "https://yt-assesment.onrender.com/api/v1/uploads/videos/initiate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              fileName,
              fileSize,
              contentType: fileType,
            }),
          },
        );
        const val = await startUploadResponse.json();
        console.log("Initail api response : ", val);
        uploadId = val.data.uploadId;
        const totalParts = val.data.totalParts;

        console.log("total parts ", totalParts);

        for (let partNumbers = 1; partNumbers <= totalParts; partNumbers++) {
          const start = (partNumbers - 1) * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const fileChunk = file.slice(start, end);

          console.log("Part number : ", { partNumbers });

          const res = await fetch(
            `https://yt-assesment.onrender.com/api/v1/uploads/videos/${uploadId}/parts/presign`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                partNumbers: [partNumbers],
              }),
            },
          );
          const uploadPartResponse = await res.json();

          console.log(uploadPartResponse);

          const presignedUrl = uploadPartResponse?.data?.[0]?.url;
          console.log(presignedUrl);

          if (!presignedUrl) {
            throw new Error(`No presigned URL for part ${partNumbers}`);
          }

          const uploadResponse = await fetch(presignedUrl, {
            method: "PUT",
            body: fileChunk,
          });

          console.log(uploadResponse);
          console.log(uploadResponse.headers.get("etag"));
          parts.push({
            partNumber: partNumbers,
            eTag: uploadResponse.headers.get("etag").replace(/['"]+/g, ""),
          });
        }
        console.log(parts);

        console.log("all parts done ");

        const completeUploadResponse = await fetch(
          `https://yt-assesment.onrender.com/api/v1/uploads/videos/${uploadId}/complete`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              parts,
            }),
          },
        );
        const Completedata = await completeUploadResponse.json();
        console.log("complete response ", Completedata);
        console.log(Completedata.data.videoKey);
        setVideoKey(Completedata.data.videoKey);
        alert("File uploaded successfully");
        setFileUrl(Completedata.url);
      } catch (error) {
        console.log("error is : ", error);
      }
    };

    await initiateVideo(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("https://yt-assesment.onrender.com/api/v1/videos", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        category: category,
        videoKey: videoKey,
        thumbnailKey: thumbnailKey,
      }),
    });
    const video = await res.json();
    console.log(video);
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
              accept="image/jpeg,image/jpg,image/png"
              className="border rounded-full px-2 w-60"
              onChange={handleImageChange}
            />
            <br></br>
            <button
              type="submit"
              className="border rounded
             mt-5 px-3 bg-emerald-300"
            >
              Upload Thumbnail Image
            </button>
            {data && <p className="mt-2  font-bold">Successfully Uploaded..</p>}
          </form>
          <form onSubmit={handleFileUpload}>
            <label className="flex flex-col mt-2 mb-3 mt-5">Upload Video</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="border rounded w-60 mt-5"
            />
            <br></br>
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
          <form onSubmit={handleUpload}>
            <label className="font-medium">Enter Title:</label>

            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="enter title"
              className="border rounded-md px-3 py-2"
            />
            <br></br>
            <br></br>
            <label className="font-medium">Enter Description : </label>

            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="enter description"
              className="border rounded-md px-3 py-2"
            />
            <br></br>
            <br></br>
            <label>Category is : </label>
            <select
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option id="0">MUSIC</option>
              <option id="1">OTHER</option>
            </select>
            <br></br>
            <button type="submit" className="mt-2 border border-1 bg-green-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;

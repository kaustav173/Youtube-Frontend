import { useState } from "react";
import { useNavigate } from "react-router";

function UploadFile() {
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [Loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailKey, setThumbnailkey] = useState("");
  const [videoKey, setVideoKey] = useState("");
  const [category, setCategory] = useState("");
  const [ImageUploaded, setImageUploaded] = useState(false);
  const [VideoUploaded, setVideoUploaded] = useState(false);

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
    setLoading(true);
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
        setThumbnailkey(data.data.key);
        setImageUploaded(true);
        setLoading(false);
      } else {
        console.log("err");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const videoFile = e.target.files?.[0];
    if (videoFile) setFile(videoFile);
  };

  const handleFileUpload = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();

    if (!ImageUploaded) {
      alert("Upload Image First...");
      return;
    }
    if (!file) {
      return;
    }
    const token = localStorage.getItem("token");
    const CHUNK_SIZE = 5 * 1024 * 1024;

    setLoading(true);

    const initiateVideo = async (file: File) => {
      const fileName = file.name;
      const fileType = file.type;
      const fileSize = file.size;
      const parts: {
        // url: string;
        partNumber: number;
        eTag: string;
      }[] = [];
      try {
        let uploadId = "";
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
            eTag: uploadResponse!.headers!.get("etag")!.replace(/['"]+/g, ""),
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
        setFileUrl(Completedata.url);
        setVideoUploaded(true);
        setLoading(false);
      } catch (error) {
        console.log("error is : ", error);
        setLoading(false);
      }
    };

    await initiateVideo(file);
  };

  const handleUpload = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    if (!ImageUploaded) {
      alert("Pls Upload Thumnail Image First...");
      return;
    }
    if (!VideoUploaded) {
      alert("Pls Upload Video First...");
      return;
    }
    setLoading(true);
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
    alert("Your Youtube Video Uploaded successfully....");
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold mb-8">Upload Your New Video</h1>

        <div className="grid grid-cols-2 gap-6 ">
          <div className="rounded-xl p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              Thumbnail Image
            </h2>
            <form onSubmit={handleImageUpload}>
              <label className="text-sm mb-2  block font-semibold">
                Select Image
              </label>
              <input
                type="file"
                id="file-input"
                name="ImageStyle"
                accept="image/jpeg,image/jpg,image/png"
                className="border rounded-lg px-2 w-50 cursor-pointer py-2 text-sm"
                onChange={handleImageChange}
              />
              <br></br>
              {Loading ? (
                <div className="items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                  >
                    <path d="M 25 5 C 13.964844 5 5 13.964844 5 25 C 4.996094 25.359375 5.183594 25.695313 5.496094 25.878906 C 5.808594 26.058594 6.191406 26.058594 6.503906 25.878906 C 6.816406 25.695313 7.003906 25.359375 7 25 C 7 15.046875 15.046875 7 25 7 C 31.246094 7 36.726563 10.179688 39.957031 15 L 33 15 C 32.640625 14.996094 32.304688 15.183594 32.121094 15.496094 C 31.941406 15.808594 31.941406 16.191406 32.121094 16.503906 C 32.304688 16.816406 32.640625 17.003906 33 17 L 43 17 L 43 7 C 43.003906 6.730469 42.898438 6.46875 42.707031 6.277344 C 42.515625 6.085938 42.253906 5.980469 41.984375 5.984375 C 41.433594 5.996094 40.992188 6.449219 41 7 L 41 13.011719 C 37.347656 8.148438 31.539063 5 25 5 Z M 43.984375 23.984375 C 43.433594 23.996094 42.992188 24.449219 43 25 C 43 34.953125 34.953125 43 25 43 C 18.753906 43 13.269531 39.820313 10.042969 35 L 17 35 C 17.359375 35.007813 17.695313 34.816406 17.878906 34.507813 C 18.058594 34.195313 18.058594 33.808594 17.878906 33.496094 C 17.695313 33.1875 17.359375 32.996094 17 33 L 8.445313 33 C 8.316406 32.976563 8.1875 32.976563 8.058594 33 L 7 33 L 7 43 C 6.996094 43.359375 7.183594 43.695313 7.496094 43.878906 C 7.808594 44.058594 8.191406 44.058594 8.503906 43.878906 C 8.816406 43.695313 9.003906 43.359375 9 43 L 9 36.984375 C 12.648438 41.847656 18.460938 45 25 45 C 36.035156 45 45 36.035156 45 25 C 45.003906 24.730469 44.898438 24.46875 44.707031 24.277344 C 44.515625 24.085938 44.253906 23.980469 43.984375 23.984375 Z"></path>
                  </svg>
                </div>
              ) : (
                <button
                  type="submit"
                  className="border rounded-lg
             mt-5 px-4 py-2 text-sm font-medium bg-emerald-300 cursor-pointer"
                >
                  Upload Thumbnail
                </button>
              )}
              {ImageUploaded && (
                <p className="mt-2 font-bold text-green-800">
                  Thumbnail Successfully Uploaded..
                </p>
              )}
            </form>
          </div>
          <div className="rounded-xl p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              Upload Video
            </h2>
            <form onSubmit={handleFileUpload}>
              <label className="mb-2 block text-sm font-medium">
                Select Video
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="border rounded-lg px-2 w-50 cursor-pointer py-2 text-sm"
              />
              <br></br>
              {Loading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                >
                  <path d="M 25 5 C 13.964844 5 5 13.964844 5 25 C 4.996094 25.359375 5.183594 25.695313 5.496094 25.878906 C 5.808594 26.058594 6.191406 26.058594 6.503906 25.878906 C 6.816406 25.695313 7.003906 25.359375 7 25 C 7 15.046875 15.046875 7 25 7 C 31.246094 7 36.726563 10.179688 39.957031 15 L 33 15 C 32.640625 14.996094 32.304688 15.183594 32.121094 15.496094 C 31.941406 15.808594 31.941406 16.191406 32.121094 16.503906 C 32.304688 16.816406 32.640625 17.003906 33 17 L 43 17 L 43 7 C 43.003906 6.730469 42.898438 6.46875 42.707031 6.277344 C 42.515625 6.085938 42.253906 5.980469 41.984375 5.984375 C 41.433594 5.996094 40.992188 6.449219 41 7 L 41 13.011719 C 37.347656 8.148438 31.539063 5 25 5 Z M 43.984375 23.984375 C 43.433594 23.996094 42.992188 24.449219 43 25 C 43 34.953125 34.953125 43 25 43 C 18.753906 43 13.269531 39.820313 10.042969 35 L 17 35 C 17.359375 35.007813 17.695313 34.816406 17.878906 34.507813 C 18.058594 34.195313 18.058594 33.808594 17.878906 33.496094 C 17.695313 33.1875 17.359375 32.996094 17 33 L 8.445313 33 C 8.316406 32.976563 8.1875 32.976563 8.058594 33 L 7 33 L 7 43 C 6.996094 43.359375 7.183594 43.695313 7.496094 43.878906 C 7.808594 44.058594 8.191406 44.058594 8.503906 43.878906 C 8.816406 43.695313 9.003906 43.359375 9 43 L 9 36.984375 C 12.648438 41.847656 18.460938 45 25 45 C 36.035156 45 45 36.035156 45 25 C 45.003906 24.730469 44.898438 24.46875 44.707031 24.277344 C 44.515625 24.085938 44.253906 23.980469 43.984375 23.984375 Z"></path>
                </svg>
              ) : (
                <button
                  disabled={!file}
                  type="submit"
                  className="border rounded-lg
             mt-5 px-4 py-2 text-sm font-medium bg-emerald-300 cursor-pointer"
                >
                  Upload Video
                </button>
              )}

              {VideoUploaded && (
                <p className="mt-2 font-bold text-green-800">
                  Video Successfully Uploaded..
                </p>
              )}
              <br />
              <br />
              {fileUrl && (
                <a href={fileUrl} target="_blank">
                  View Uploaded File
                </a>
              )}
            </form>
          </div>
          <div className="p-6">
            <h2 className="mb-5 text-lg font-semibold text-gray-800">
              Video Details
            </h2>
            <form onSubmit={handleUpload}>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="font-medium mb-2 block text-sm">
                    Enter Title:
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="enter title"
                    className="border rounded-lg w-full px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Category
                  </label>

                  <select
                    name="category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-lg border  px-3 py-2 "
                  >
                    <option value="MUSIC">MUSIC</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium ">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter video description"
                    rows={4}
                    className="w-full resize-none rounded-lg border px-3 py-2"
                  />
                </div>
              </div>
              {Loading ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="20"
                  height="20"
                  viewBox="0 0 50 50"
                >
                  <path d="M 25 5 C 13.964844 5 5 13.964844 5 25 C 4.996094 25.359375 5.183594 25.695313 5.496094 25.878906 C 5.808594 26.058594 6.191406 26.058594 6.503906 25.878906 C 6.816406 25.695313 7.003906 25.359375 7 25 C 7 15.046875 15.046875 7 25 7 C 31.246094 7 36.726563 10.179688 39.957031 15 L 33 15 C 32.640625 14.996094 32.304688 15.183594 32.121094 15.496094 C 31.941406 15.808594 31.941406 16.191406 32.121094 16.503906 C 32.304688 16.816406 32.640625 17.003906 33 17 L 43 17 L 43 7 C 43.003906 6.730469 42.898438 6.46875 42.707031 6.277344 C 42.515625 6.085938 42.253906 5.980469 41.984375 5.984375 C 41.433594 5.996094 40.992188 6.449219 41 7 L 41 13.011719 C 37.347656 8.148438 31.539063 5 25 5 Z M 43.984375 23.984375 C 43.433594 23.996094 42.992188 24.449219 43 25 C 43 34.953125 34.953125 43 25 43 C 18.753906 43 13.269531 39.820313 10.042969 35 L 17 35 C 17.359375 35.007813 17.695313 34.816406 17.878906 34.507813 C 18.058594 34.195313 18.058594 33.808594 17.878906 33.496094 C 17.695313 33.1875 17.359375 32.996094 17 33 L 8.445313 33 C 8.316406 32.976563 8.1875 32.976563 8.058594 33 L 7 33 L 7 43 C 6.996094 43.359375 7.183594 43.695313 7.496094 43.878906 C 7.808594 44.058594 8.191406 44.058594 8.503906 43.878906 C 8.816406 43.695313 9.003906 43.359375 9 43 L 9 36.984375 C 12.648438 41.847656 18.460938 45 25 45 C 36.035156 45 45 36.035156 45 25 C 45.003906 24.730469 44.898438 24.46875 44.707031 24.277344 C 44.515625 24.085938 44.253906 23.980469 43.984375 23.984375 Z"></path>
                </svg>
              ) : (
                <button
                  type="submit"
                  className="mt-6 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white cursor-pointer"
                >
                  Submit
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;

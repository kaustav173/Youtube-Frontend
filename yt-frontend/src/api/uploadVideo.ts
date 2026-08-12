const token = localStorage.getItem("token");

let uploadId: string;
let totalParts: number;

export const initiateVideo = async (videoPath: string) => {
  try {
    const res = await fetch(
      "https://yt-assesment.onrender.com/api/v1/uploads/videos/initiate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: videoPath,
          fileSize: 1,
          contentType: "video/mp4",
        }),
      },
    );
    const val = await res.json();

    uploadId = val.data.uploadId as string;
    totalParts = val.data.totalParts as number;
    for (let i = 1; i <= totalParts; i++) {
      const final = await MultiVideo(uploadId, i);
      if (final) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const VideoComplete = async (id: string, n: number) => {
  try {
    const res = await fetch(
      `https://yt-assesment.onrender.com/api/v1/uploads/videos/${id}/complete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parts: [
            {
              partNumber: n,
              eTag: "",
            },
          ],
        }),
      },
    );
    const data = await res.json();
    if (data.success) {
      return true;
    }
  } catch (error) {
    console.log(error);
  }
};

export const MultiVideo = async (id: string, n: number) => {
  try {
    const res = await fetch(
      `https://yt-assesment.onrender.com/api/v1/uploads/videos/${id}/parts/presign`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          partNumbers: [n],
        }),
      },
    );
    if (!res.ok) {
      return Error;
    }
    const data = await res.json();
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

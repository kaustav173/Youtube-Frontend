interface IID {
  id: string;
}
export const Allvideo = async (id: IID) => {
  const token = localStorage.getItem("token");
  try {
    console.log(id.id);
    const res: Response = await fetch(
      `https://yt-assesment.onrender.com/api/v1/videos/${id}/recommended`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    console.log("recomm : ", data);
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const GetAvideo = async (id: IID) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `https://yt-assesment.onrender.com/api/v1/videos/${id.id}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

import axios from "axios";

export const GetMyVideo = async () => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.get(
      "https://yt-assesment.onrender.com/api/v1/videos/mine",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("my video", data.data.data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const SearchVideo = async (text: string) => {
  const token = localStorage.getItem("token");
  try {
    console.log(token);
    const { data } = await axios.get(
      "https://yt-assesment.onrender.com/api/v1/videos",
      {
        params: {
          search: text,
        },
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token} `,
        },
      },
    );
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const DeleteVideo = async (id: IID) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `https://yt-assesment.onrender.com/api/v1/videos/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      throw new Error("Issuee");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

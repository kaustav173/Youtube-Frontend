export const Allvideo = async () => {
  const token = localStorage.getItem("token");
  try {
    const res: Response = await fetch(
      "https://yt-assesment.onrender.com/api/v1/videos",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await res.json();
    console.log(data);
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

interface IID {
  id: string;
}

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

const token = localStorage.getItem("token");

export const GetMyVideo = async () => {
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
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

interface IText {
  text: string;
}

export const SearchVideo = async (text: IText) => {
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

import axios from "axios";

export const commentsApi = async (id: string) => {
  const token = localStorage.getItem("token");

  try {
    const { data } = await axios.get(
      `https://yt-assesment.onrender.com/api/v1/videos/${id}/comments`,
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

export const postComment = async ({
  id,
  text,
}: {
  id: string;
  text: string;
}) => {
  const token = localStorage.getItem("token");

  try {
    const { data } = await axios.post(
      `https://yt-assesment.onrender.com/api/v1/videos/${id}/comments`,
      { text },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

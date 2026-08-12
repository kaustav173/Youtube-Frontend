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

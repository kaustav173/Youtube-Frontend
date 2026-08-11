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

export const GetAvideo = async () => {
  // const
};

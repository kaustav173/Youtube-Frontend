export const likeCount = async (id: string, type: string) => {
  const token = localStorage.getItem("token");
  console.log(id, type);
  try {
    const res = await fetch(
      `https://yt-assesment.onrender.com/api/v1/videos/${id}/reaction`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token} `,
        },
        body: JSON.stringify({
          type,
        }),
      },
    );
    console.log(res);
    if (!res.ok) {
      throw new Error("Issuee");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

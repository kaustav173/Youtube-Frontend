export const login = async (info) => {
  try {
    const res: Response = await fetch(
      "https://yt-assesment.onrender.com/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: info.email,
          password: info.password,
        }),
      },
    );
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const profile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(
      "https://yt-assesment.onrender.com/api/v1/users/me",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(res);
    const data = await res.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.log(error);
    // return null;
  }
};

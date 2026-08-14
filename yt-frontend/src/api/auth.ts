export const refreshToken = async () => {
  localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const res = await fetch(
    "https://yt-assesment.onrender.com/api/v1/auth/refresh",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
    },
  );
  console.log(res);

  if (!res.ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    throw new Error("Refresh token expired or revoked");
  }

  const { data } = await res.json();

  localStorage.setItem("token", data.accessToken);

  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
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
    console.log(res.status);
    if (res.status === 401) {
      await refreshToken();
    }
    const data = await res.json();
    console.log(data.data);
    return data.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function logout() {
  localStorage.removeItem("token");
}

import { useState } from "react";
import { useNavigate } from "react-router";
import * as Yup from "yup";

function Login() {
  const navigate = useNavigate();

  const [Loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setEmailError("");
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await validationSchema.validate(formData, {
        abortEarly: false,
      });

      setEmailError("");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const emailValidationError = error.inner.find(
          (err) => err.path === "email",
        );

        if (emailValidationError) {
          setEmailError(emailValidationError.message);
        }
      }

      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://yt-assesment.onrender.com/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const { data } = await res.json();

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      navigate("/home");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem("refreshToken");

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

    return data.accessToken;
  };

  const apiFetch = async (url, options = {}) => {
    let accessToken = localStorage.getItem("token");

    const makeRequest = async (token: string | null) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    };

    let res = await makeRequest(accessToken);

    if (res.status === 401) {
      try {
        accessToken = await refreshAccessToken();
        res = await makeRequest(accessToken);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        navigate("/login");
        throw error;
      }
    }

    return res;
  };

  return (
    <div className="ml-5 flex items-center justify-center p-4">
      <div className="w-full border rounded-lg p-6">
        <h2 className="text-3xl text-center font-bold">Welcome to Youtube</h2>

        <h3 className="text-2xl m-2 mb-6 text-center">User Login</h3>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="font-medium">Enter your Email Id:</label>

          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="enter your email"
            className="border rounded-md px-3 py-2"
          />

          {emailError && <p className="text-sm text-red-500">{emailError}</p>}

          <label className="font-medium">Enter your password:</label>

          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="enter your password"
              required
            />
          </div>

          {Loading ? (
            <p className="text-center">is Loading ....</p>
          ) : (
            <button type="submit" className="mt-2 border rounded-md px-3 py-2">
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;

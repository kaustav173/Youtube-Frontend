import { useState } from "react";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import YouTubeIcon from "@mui/icons-material/YouTube";

function Login() {
  const navigate = useNavigate();

  const [Loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("password");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleToggle = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

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
    console.log("handle login start");

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
    console.log("Validation compleetd");
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
        const data1 = await res.json();
        console.log(data1.error.message);
        setError(data1.error.message);

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

  // const refreshAccessToken = async (): Promise<string> => {
  //   const refreshToken = localStorage.getItem("refreshToken");

  //   if (!refreshToken) {
  //     throw new Error("Refresh token not found");
  //   }

  //   const res = await fetch(
  //     "https://yt-assesment.onrender.com/api/v1/auth/refresh",
  //     {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         refreshToken,
  //       }),
  //     },
  //   );

  //   if (!res.ok) {
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("refreshToken");
  //     throw new Error("Refresh token expired or revoked");
  //   }

  //   const { data } = await res.json();

  //   localStorage.setItem("token", data.accessToken);

  //   if (data.refreshToken) {
  //     localStorage.setItem("refreshToken", data.refreshToken);
  //   }

  //   return data.accessToken;
  // };

  // const apiFetch = async (url, options = {}) => {
  //   let accessToken = localStorage.getItem("token");

  //   const makeRequest = async (token: string | null) => {
  //     return fetch(url, {
  //       ...options,
  //       headers: {
  //         ...options.headers,
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   };

  //   let res = await makeRequest(accessToken);

  //   if (res.status === 401) {
  //     try {
  //       accessToken = await refreshAccessToken();
  //       res = await makeRequest(accessToken);
  //     } catch (error) {
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("refreshToken");
  //       navigate("/login");
  //       throw error;
  //     }
  //   }

  //   return res;
  // };

  return (
    <div className="ml-5 flex items-center justify-center p-4 pt-30">
      <div className="w-[500px] border rounded-lg p-6">
        <h2 className="text-3xl text-center font-bold">
          <YouTubeIcon
            sx={{
              color: "#ff0000",
              fontSize: 36,
            }}
          />
          Welcome to Youtube
        </h2>

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

          {/* <div className="relative flex">
            <input
              type={passwordV ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="enter your password"
              required
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-eye flex justify-around items-center"
              viewBox="0 0 16 16"
            >
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
            </svg>
          </div> */}
          <div className="mb-4 flex border rounded-md px-2">
            <input
              type={type}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="px-3 py-2 w-full"
            />
            <button
              className="flex justify-around items-center"
              onClick={handleToggle}
            >
              {type === "password" ? "👁️" : "🙈"}
            </button>
          </div>
          {error.length === 0 ? (
            <p></p>
          ) : (
            <p className=" text-red-500">{error}</p>
          )}
          {Loading ? (
            <div className="flex items-center justify-center animate-spin">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="50"
                height="30"
                viewBox="0 0 50 50"
              >
                <path d="M 25 5 C 13.964844 5 5 13.964844 5 25 C 4.996094 25.359375 5.183594 25.695313 5.496094 25.878906 C 5.808594 26.058594 6.191406 26.058594 6.503906 25.878906 C 6.816406 25.695313 7.003906 25.359375 7 25 C 7 15.046875 15.046875 7 25 7 C 31.246094 7 36.726563 10.179688 39.957031 15 L 33 15 C 32.640625 14.996094 32.304688 15.183594 32.121094 15.496094 C 31.941406 15.808594 31.941406 16.191406 32.121094 16.503906 C 32.304688 16.816406 32.640625 17.003906 33 17 L 43 17 L 43 7 C 43.003906 6.730469 42.898438 6.46875 42.707031 6.277344 C 42.515625 6.085938 42.253906 5.980469 41.984375 5.984375 C 41.433594 5.996094 40.992188 6.449219 41 7 L 41 13.011719 C 37.347656 8.148438 31.539063 5 25 5 Z M 43.984375 23.984375 C 43.433594 23.996094 42.992188 24.449219 43 25 C 43 34.953125 34.953125 43 25 43 C 18.753906 43 13.269531 39.820313 10.042969 35 L 17 35 C 17.359375 35.007813 17.695313 34.816406 17.878906 34.507813 C 18.058594 34.195313 18.058594 33.808594 17.878906 33.496094 C 17.695313 33.1875 17.359375 32.996094 17 33 L 8.445313 33 C 8.316406 32.976563 8.1875 32.976563 8.058594 33 L 7 33 L 7 43 C 6.996094 43.359375 7.183594 43.695313 7.496094 43.878906 C 7.808594 44.058594 8.191406 44.058594 8.503906 43.878906 C 8.816406 43.695313 9.003906 43.359375 9 43 L 9 36.984375 C 12.648438 41.847656 18.460938 45 25 45 C 36.035156 45 45 36.035156 45 25 C 45.003906 24.730469 44.898438 24.46875 44.707031 24.277344 C 44.515625 24.085938 44.253906 23.980469 43.984375 23.984375 Z"></path>
              </svg>
            </div>
          ) : (
            <button
              type="submit"
              className="mt-2 border rounded-md px-3 py-2
            bg-emerald-300"
            >
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;

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
      await validationSchema.validate(
        { email: formData.email },
        { abortEarly: false },
      );

      setEmailError("");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setEmailError(error.errors[0]);
      }

      return;
    }

    setLoading(true);

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
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      console.log(res);
      if (!res.ok) {
        // console.log(res);
        throw new Error("Invalid credentials");
      }

      const { data } = await res.json();

      console.log(data);

      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      console.log("Login successful");

      setLoading(false);
      navigate("/home");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
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

          {emailError && <p className="text-sm">{emailError}</p>}

          <br />

          <label className="font-medium">Enter your password:</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border rounded-md px-3 py-2"
            placeholder="enter your password"
            required
          />

          <br />

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

import { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router";

// const validationSchema = Yup.object().shape({
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters")
//     .required("Password is required"),
// });

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // let valid = useState(false);
  // validationSchema
  //   .validate(formData)
  //   .then((valid) => {
  //     console.log("Validation passed:", valid);
  //     // valid = tr;
  //   }
  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target);
    console.log(formData);
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
      if (!res.ok) {
        throw new Error("Invalid credentials");
      }
      const { data } = await res.json();
      console.log(data.accessToken);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      console.log("Login successfull");
      console.log(data);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ml-5 flex items-center justify-center p-4">
      <div className="w-full border rounded-lg  p-6">
        <h2 className="text-3xl text-center font-bold">Welcome to Youtube</h2>
        <h3 className="text-2xl m-2 mb-6 text-center">User Login</h3>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <label className="font-medium">Enter your Email Id: </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="enter your email"
            className="border rounded-md px-3 py-2 "
          />
          <br></br>
          <label className="font-medium">Enter your password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 "
            placeholder="enter your password"
            required
          />
          <br></br>
          <button type="submit" className="mt-2 border rounded-md px-3 py-2 ">
            Submit
          </button>
          {/* {valid} */}
        </form>
      </div>
    </div>
  );
}

export default Login;

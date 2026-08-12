import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Routes, Route } from "react-router";
import VideoPlay from "./pages/VideoPlay";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/video/:id" element={<VideoPlay />} />
      </Route>
    </Routes>
  );
}

export default App;

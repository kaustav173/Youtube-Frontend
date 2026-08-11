import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Routes, Route } from "react-router";
import VideoPlay from "./pages/VideoPlay";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/video/:id" element={<VideoPlay />} />
    </Routes>
  );
}

export default App;

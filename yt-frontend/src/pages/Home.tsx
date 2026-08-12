import { useAllVideo } from "../hooks/useAllVideo";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router";
import Typography from "@mui/material/Typography";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import { useState } from "react";
import YouTubeIcon from "@mui/icons-material/YouTube";
import type { Video } from "../types";

function Home() {
  const { data, error, isPending } = useAllVideo();
  const [search, setSearch] = useState("");
  console.log("home", data);

  if (error) {
    return <div>{error.message || "An error occurred"}</div>;
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center">is Fetching...</div>
    );
  }

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex shrink-0 items-center">
          <YouTubeIcon />
          <span className="text-2xl font-bold ml-2">YouTube</span>
        </div>

        <div className="flex w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-l-full border px-5 text-base "
          />

          <Link
            to={`/home/${search}`}
            className="flex h-11 w-16  items-center justify-center rounded-r-full border border-1"
          >
            <SavedSearchIcon />
          </Link>
        </div>

        <div className="hidden h-10 w-10  items-center justify-center rounded-full border md:flex">
          <Link to="/profile">P</Link>
        </div>
      </div>
      <ul className="grid grid-cols-4 py-10">
        {data.map((video: Video) => (
          <Link to={`/video/${video.id}`}>
            <Card sx={{ maxWidth: 345 }} key={video.id}>
              <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={
                  `https://test-dev-sena.s3.ap-south-1.amazonaws.com/` +
                  video.thumbnailKey
                }
                className="border rounded-2xl"
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {video.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {video.description}
                </Typography>
              </CardContent>
              <div className="flex flex-row gap-30 px-4 font-thin text-sm">
                <span>{video.owner?.name}</span>
                <span>Category: {video.category}</span>
              </div>
              <CardActions></CardActions>
            </Card>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default Home;

// import { useState } from "react";
import { useParams } from "react-router";
import { useSearchVideo } from "../hooks/useSearchVideo";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";
import YouTubeIcon from "@mui/icons-material/YouTube";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailKey: string;
  videoKey?: string;
  category?: string;
  owner?: {
    name: string;
  };
}

function SearchPage() {
  const { text } = useParams();
  const { data } = useSearchVideo(text);
  console.log(data);

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex shrink-0 items-center">
          <YouTubeIcon />
          <span className="text-2xl font-bold ml-2">YouTube</span>
        </div>

        <div className="flex w-full max-w-2xl text-2xl">
          Search Results :- {text}
        </div>

        <div className="hidden h-10 w-10  items-center justify-center rounded-full border md:flex">
          <Link to="/profile">P</Link>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-4 ">
        {data?.data.map((video: Video) => (
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

export default SearchPage;

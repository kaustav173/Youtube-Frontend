import { useMyVideo } from "../hooks/useMyVideo";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router";
import Typography from "@mui/material/Typography";

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

function MyVideo() {
  const { data, isFetching, error } = useMyVideo();
  if (isFetching) {
    return <div>is Fetching ....</div>;
  }

  console.log(data.data);

  if (error) {
    return <div>{error.message}</div>;
  }
  console.log("my video", data);
  return (
    <div>
      <span className="text-2xl font-bold mb-4">My Video</span>
      <div className="mt-10">
        {data.data.map((video: Video) => (
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
      </div>
    </div>
  );
}

export default MyVideo;

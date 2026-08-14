import { useMyVideo } from "../hooks/useMyVideo";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router";
import Typography from "@mui/material/Typography";
import { useDeleteVideo } from "../hooks/useDeleteVideos";

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
  const mutation = useDeleteVideo(id);
  if (isFetching) {
    return <div>is Fetching ....</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const handleDelete = async (id: string) => {
    mutation.mutate(id);
  };

  return (
    <div>
      <span className="text-2xl font-bold mb-4">My Video</span>
      <div className="mt-10 grid grid-cols-2 gap-6">
        {data.data.map((video: Video) => (
          <Card sx={{ maxWidth: 345 }} key={video.id}>
            <Link to={`/video/${video.id}`}>
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
            </Link>
            <CardActions>
              <button
                onClick={() => handleDelete(video.id)}
                className="text-white border bg-red-500 px-2 rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MyVideo;

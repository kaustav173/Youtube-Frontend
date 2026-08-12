import { useAllVideo } from "../hooks/useAllVideo";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router";
import Typography from "@mui/material/Typography";

function AllVideo() {
  const { data, error, isPending } = useAllVideo();
  console.log("home", data);

  if (error) {
    return <div>{error}</div>;
  }

  if (isPending) {
    return <div>is Fetching</div>;
  }

  return (
    <div className="px-2">
      <ul className="grid grid-cols-2">
        {data.map((video) => (
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
                className="border rounded-2xl mb-2"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {video.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {video.description}
                </Typography>
              </CardContent>
              <CardActions></CardActions>
            </Card>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default AllVideo;

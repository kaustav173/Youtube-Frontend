import { useAllVideo } from "../hooks/useAllVideo";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { Link } from "react-router";
import Typography from "@mui/material/Typography";

function Home() {
  const { data, error, isPending } = useAllVideo();
  console.log("home", data);

  if (error) {
    return <div>{error}</div>;
  }

  if (isPending) {
    return <div>is Fetching</div>;
  }

  return (
    <>
      All Videos
      <ul className="grid grid-cols-4">
        {data.map((video) => (
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image={
                `https://test-dev-sena.s3.ap-south-1.amazonaws.com/` +
                video.thumbnailKey
              }
            />
            <video controls width="250">
              <source
                src="/shared-assets/videos/flower.webm"
                type="video/webm"
              />
              <source
                src={
                  `https://test-dev-sena.s3.ap-south-1.amazonaws.com/` +
                  video.videoKey
                }
                type="video/mp4"
              />
              Download the
              <a href="/shared-assets/videos/flower.webm">WEBM</a>
              or
              <a href="/shared-assets/videos/flower.mp4">MP4</a>
              video.
            </video>

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {video.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {video.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Link to={`/video/${video.id}`}>Play the Video</Link>
              <Button size="small"></Button>
            </CardActions>
          </Card>
        ))}
      </ul>
    </>
  );
}

export default Home;

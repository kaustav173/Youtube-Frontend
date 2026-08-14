// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";

// interface IVideo {
//   video: {
//     category: string;
//     commentCount: number;
//     description: string;
//     id: string;
//     title: string;
//     videoKey: string;
//     thumbnailKey: string;
//   };
// }

// export function VideoCard(video: IVideo) {
//   console.log(video.video.thumbnailKey);
//   return (
//     <Card sx={{ maxWidth: 345 }}>
//       <CardMedia
//         sx={{ height: 140 }}
//         image={
//           `https://test-dev-sena.s3.ap-south-1.amazonaws.com/` +
//           video.video.thumbnailKey
//         }
//         title="green iguana"
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//           {video}
//         </Typography>
//         <Typography variant="body2" sx={{ color: "text.secondary" }}>
//           {video}
//         </Typography>
//       </CardContent>
//       <CardActions>
//         <Button size="small">Share</Button>
//         <Button size="small">Learn More</Button>
//       </CardActions>
//     </Card>
//   );
// }

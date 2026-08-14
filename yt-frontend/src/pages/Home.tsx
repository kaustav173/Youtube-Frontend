import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router";
import { useEffect, useState } from "react";

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

function Home() {
  const [data, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `https://yt-assesment.onrender.com/api/v1/videos?page=${currentPage}&limit=20`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const response = await res.json();

        setVideos(response.data);

        if (response.meta) {
          setCurrentPage(response.meta.page);
          setTotalPage(response.meta.totalPages || 1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchVideos();
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white px-3 py-3 sm:px-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex shrink-0 items-center">
          <YouTubeIcon
            sx={{
              color: "#ff0000",
              fontSize: 36,
            }}
          />
          <span className="ml-2 text-2xl font-bold tracking-tight">
            YouTube
          </span>
        </div>

        <div className="flex w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-l-full border  px-5"
          />

          <Link
            to={`/search/${search}`}
            className="flex h-11 w-16  items-center justify-center rounded-r-full border border-l-0"
          >
            <SavedSearchIcon />
          </Link>
        </div>

        <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold md:flex">
          <Link to="/profile">P</Link>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="rounded-full border px-5 py-2 text-sm font-medium"
        >
          Back
        </button>

        <button
          onClick={handleNext}
          className={`rounded-full border px-5 py-2 text-sm font-medium transition `}
        >
          Next
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((video) => (
          <Link
            to={`/video/${video.id}`}
            key={video.id}
            className="group block"
          >
            <Card
              sx={{
                maxWidth: "100%",
                height: "100%",
                boxShadow: "none",
                borderRadius: "12px",
                overflow: "hidden",
              }}
            >
              <div className="overflow-hidden rounded-xl">
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://test-dev-sena.s3.ap-south-1.amazonaws.com/${video.thumbnailKey}`}
                  alt={video.title}
                  className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <CardContent sx={{ padding: "12px 4px" }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {video.title}
                </Typography>

                <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    {video.owner?.name}
                  </span>

                  <span>{video.category}</span>
                </div>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    marginTop: "6px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {video.description}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;

import SavedSearchIcon from "@mui/icons-material/SavedSearch";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router";
import { useState } from "react";

function Header() {
  const [search, setSearch] = useState("");
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex shrink-0 items-center">
        <Link to={`/home`}>
          <YouTubeIcon
            sx={{
              color: "#ff0000",
              fontSize: 36,
            }}
          />

          <span className="ml-2 text-2xl font-bold tracking-tight">
            YouTube
          </span>
        </Link>
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
  );
}

export default Header;

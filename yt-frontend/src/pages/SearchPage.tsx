import { useParams } from "react-router";
import { useAllVideo } from "../hooks/useAllVideo";

function SearchPage() {
  const { text } = useParams();
  const { data } = useAllVideo();
  console.log(data);

  console.log(text);
  return <div>SearchPage</div>;
}

export default SearchPage;

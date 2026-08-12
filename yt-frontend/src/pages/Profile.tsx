import { useProfile } from "../hooks/useProfile";

function Profile() {
  const { data } = useProfile();
  console.log(data);
  return (
    <div className="lex items-center justify-center p-4 w-full border rounded-lg">
      <span>My Profile</span>
      <div className="flex flex-col gap-4 md-10">
        <span>{data.name}</span>
        <span>{data.email}</span>
      </div>
    </div>
  );
}

export default Profile;

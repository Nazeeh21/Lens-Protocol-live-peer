import {
  useActiveProfile,
  useActiveProfileSwitch,
  useActiveWallet,
  useProfilesOwnedByMe,
} from "@lens-protocol/react-web";
import { useEffect } from "react";

const UserFeed = () => {
  const { data: activeProfile, error, loading } = useActiveProfile();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (activeProfile === null) return <p>No active profile</p>;

  console.log("activeProfile : ", activeProfile);
  return (
    <div>
      <p>Active profile: {activeProfile?.handle}</p>
      <ul></ul>
    </div>
  );
};

export default UserFeed;

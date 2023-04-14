import { useActiveProfile, useActiveProfileSwitch, useActiveWallet, useProfilesOwnedByMe } from "@lens-protocol/react-web";
import { useEffect } from "react";

const UserFeed = () => {
  const { data: activeProfile } = useActiveProfile();
  // const { execute: switchActiveProfile, isPending } = useActiveProfileSwitch();
  // const { data: profiles, error, loading } = useProfilesOwnedByMe();

  console.log("activeProfile : ", activeProfile);
  return (
    <div>
      <p>Active profile: {activeProfile?.handle}</p>
      <ul>
        
      </ul>
    </div>
  );
};

export default UserFeed;

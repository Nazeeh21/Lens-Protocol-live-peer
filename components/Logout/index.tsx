import { Button } from "@chakra-ui/react";
import { useWalletLogout } from "@lens-protocol/react-web";
import { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";

function LogoutButton() {
  const { execute: logout, isPending, error } = useWalletLogout();
  const { disconnectAsync } = useDisconnect()

  useEffect(() => {
    if (error) {
      console.error('Error while logging out', error);
      alert(error);
    }
  }, [error])

  const logoutClicked = async () => {
    await logout();
    await disconnectAsync();
  }

  return (
    <Button disabled={isPending} onClick={logoutClicked }>
      Log out
    </Button>
  );
}

export default LogoutButton;

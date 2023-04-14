import { Box, Button } from "@chakra-ui/react";
import { useWalletLogin } from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function LoginButton() {
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();

  const { isConnected, address } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
    }
  };

  return (
    <div>
      {loginError && <p>{loginError as unknown as string}</p>}

      <Button disabled={isLoginPending} onClick={onLoginClick}>
        Log in
      </Button>
    </div>
  );
}

export default LoginButton;

import { Box, Button } from "@chakra-ui/react";
import { useWalletLogin } from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function LoginButton() {
  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin();

  const { isConnected } = useAccount();
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
      console.log("Injected connector");
      const signer = await connector.getSigner();
      try {
        await login(signer);
      } catch (error) {
        console.log("Error while logging in", error);
        alert('Error while logging in');
      }
    }
  };
 
  return (
    <div>
      {loginError && <p>{loginError as unknown as string}</p>}
      <button disabled={isLoginPending} onClick={onLoginClick}>Log in</button>
    </div>
  );
}


export default LoginButton;

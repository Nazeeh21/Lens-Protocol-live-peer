import "../styles/globals.css";

import { Box, Button, ChakraProvider, Flex, Text } from "@chakra-ui/react";
import { css } from "@emotion/css";
import { ethers, providers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  authenticate as authenticateMutation,
  createClient,
  getChallenge,
  STORAGE_KEY,
} from "../api";
import { GET_DEFAULT_PROFILES } from "../api/queries";
import { AppContext } from "../context";
import { theme } from "../theme";
import { parseJwt, refreshAuthToken } from "../utils";

function MyApp({ Component, pageProps }) {
  const [connected, setConnected] = useState(false);
  const [userAddress, setUserAddress] = useState();
  const router = useRouter();
  const [lensProfile, setLensProfile] = useState(null);
  const [currentChainId, setCurrentChainId] = useState(null);

  useEffect(() => {
    refreshAuthToken();
    async function checkConnection() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const addresses = await provider.listAccounts();
      if (addresses.length && localStorage.getItem(STORAGE_KEY)) {
        getProfiles();
        getChainId();
        setUserAddress(addresses[0]);
        setConnected(true);
      } else {
        setConnected(false);
      }
    }
    checkConnection();
    listenForRouteChangeEvents();
  }, []);

  async function listenForRouteChangeEvents() {
    router.events.on("routeChangeStart", () => {
      refreshAuthToken();
    });
  }

  const getProfiles = async () => {
    try {
      const accounts = await window.ethereum.send("eth_requestAccounts");
      const account = accounts.result[0];
      const urqlClient = await createClient();
      const response = await urqlClient
        .query(GET_DEFAULT_PROFILES, {
          request: {
            ethereumAddress: account,
          },
        })
        .toPromise();
      console.log("Default profiles: ", response);
      if (response.data.defaultProfile.id) {
        localStorage.setItem(
          "defaultProfileId",
          response.data.defaultProfile.id
        );
      }
      if (response.data.defaultProfile.handle) {
        setLensProfile(response.data.defaultProfile.handle);
      }
    } catch (error) {
      console.log("Error while fetching default Profile: ", { error });
    }
  };

  async function disconnectUser() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("defaultProfileId");
      setUserAddress(null);
      setLensProfile(null);
      setConnected(false);
    } catch (error) {
      console.log("Error while disconnecting user: ", { error });
    }
  }

  async function signIn() {
    try {
      const accounts = await window.ethereum.send("eth_requestAccounts");
      const account = accounts.result[0];
      setUserAddress(account);
      const urqlClient = await createClient();
      const response = await urqlClient
        .query(getChallenge, {
          address: account,
        })
        .toPromise();
      const provider = new providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(response.data.challenge.text);
      const authData = await urqlClient
        .mutation(authenticateMutation, {
          address: account,
          signature,
        })
        .toPromise();
      const { accessToken, refreshToken } = authData.data.authenticate;
      const accessTokenData = parseJwt(accessToken);
      getChainId();
      getProfiles();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accessToken,
          refreshToken,
          exp: accessTokenData.exp,
        })
      );
      setConnected(true);
    } catch (err) {
      console.log("error: ", err);
      alert("Error while signing in");
      setConnected(false);
    }
  }

  async function switchNetwork() {
    const chainId = 137; // Polygon Mainnet

    try {
      if (currentChainId !== chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexlify(chainId) }],
          });
          await getChainId()
        } catch (err) {
          console.log("error: ", err);
          // This error code indicates that the chain has not been added to MetaMask
          if (err.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainName: "Polygon Mainnet",
                  chainId: ethers.utils.hexlify(chainId),
                  nativeCurrency: {
                    name: "MATIC",
                    decimals: 18,
                    symbol: "MATIC",
                  },
                  rpcUrls: ["https://polygon-rpc.com/"],
                },
              ],
            });
          }
        }
      }
    } catch (err) {
      console.log("Error while switching network: ", { error });
    }
  }

  async function getChainId() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();
    setCurrentChainId(chainId);
  }

  return (
    <AppContext.Provider
      value={{
        userAddress,
      }}
    >
      <ChakraProvider theme={theme}>
        <div>
          <nav className={navStyle}>
            <div className={navContainerStyle}>
              <div className={linkContainerStyle}>
                <Link href="/">
                  <a>
                    <img src="/icon.svg" className={iconStyle} />
                  </a>
                </Link>
                <Link href="/">
                  <a>
                    <p className={linkTextStyle}>Home</p>
                  </a>
                </Link>
                <Link href="/profiles">
                  <a>
                    <p className={linkTextStyle}>Explore Profiles</p>
                  </a>
                </Link>
              </div>
              <div className={buttonContainerStyle}>
                {connected && currentChainId !== 137 && (
                  <Flex w="160px" flexDir="column">
                    <Button
                      _hover={{ background: "pink.700", color: "white" }}
                      color={"black"}
                      bg="pink.400"
                      onClick={switchNetwork}
                      px={4}
                      py={3}
                      rounded={"3xl"}
                    >
                      Switch network
                    </Button>
                    {/* <Text align='center' color="red" fontSize="sm">
                      You are on wronng network.
                       Switch to Polygon.
                    </Text> */}
                  </Flex>
                )}
                {connected ? (
                  <Box
                    ml="15px"
                    cursor={"pointer"}
                    _hover={{ background: "green.700" }}
                    onClick={disconnectUser}
                    color={"white"}
                    bg="green"
                    px={4}
                    py={3}
                    rounded={"3xl"}
                  >
                    {lensProfile}
                  </Box>
                ) : (
                  <button className={buttonStyle} onClick={signIn}>
                    Sign in
                  </button>
                )}
              </div>
            </div>
          </nav>
          <Component {...pageProps} />
        </div>
      </ChakraProvider>
    </AppContext.Provider>
  );
}

const linkTextStyle = css`
  margin-right: 40px;
  font-weight: 600;
  font-size: 15px;
`;

const iconStyle = css`
  height: 35px;
  margin-right: 40px;
`;

const navStyle = css`
  background-color: white;
  padding: 15px 30px;
  display: flex;
`;

const navContainerStyle = css`
  width: 900px;
  margin: 0 auto;
  display: flex;
`;

const linkContainerStyle = css`
  display: flex;
  align-items: center;
`;

const buttonContainerStyle = css`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
`;

const buttonStyle = css`
  border: none;
  outline: none;
  margin-left: 15px;
  background-color: black;
  color: #340036;
  padding: 13px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: rgb(249, 92, 255);
  transition: all 0.35s;
  width: 160px;
  letter-spacing: 0.75px;
  &:hover {
    background-color: rgba(249, 92, 255, 0.75);
  }
`;

export default MyApp;

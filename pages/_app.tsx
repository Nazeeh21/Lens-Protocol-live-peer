import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
const { provider, webSocketProvider } = configureChains(
  [polygon, mainnet],
  [publicProvider()]
);
import { LensProvider } from "@lens-protocol/react-web";
import { lensConfig } from "@/utils/lensConfig";
import Layout from "@/components/Layout";

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps }: AppProps) {
  const livepeerClient = createReactClient({
    provider: studioProvider({
      apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY as string,
    }),
  });

  return (
    <WagmiConfig client={client}>
      <LensProvider config={lensConfig}>
        <ChakraProvider>
          <LivepeerConfig client={livepeerClient}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </LivepeerConfig>
        </ChakraProvider>
      </LensProvider>
    </WagmiConfig>
  );
}

import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const client = createReactClient({
    provider: studioProvider({
      apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY as string,
    }),
  });

  return (
    <ChakraProvider>
      <LivepeerConfig client={client}>
        <Component {...pageProps} />
      </LivepeerConfig>
    </ChakraProvider>
  );
}

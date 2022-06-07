import { Box, Button } from "@chakra-ui/react";
import React from "react";
import { Client, isSupported } from "@livepeer/webrtmp-sdk";
import { createStream } from "../api/livepeer";

const Stream = () => {
  const client = new Client();
  const startStream = async () => {
    if (!isSupported()) {
      alert("webrtmp-sdk is not currently supported on this browser");
      return;
    }
    const getStreamKey = await createStream();
    const streamKey = getStreamKey.streamKey;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const session = client.cast(stream, streamKey);
    session.on("open", () => {
      console.log("Stream started.");
    });

    session.on("close", () => {
      console.log("Stream stopped.");
    });

    session.on("error", (err) => {
      console.log("Stream error.", err.message);
    });
  };
  return <Box>STream
    <Button onClick={startStream}>Start stream</Button>
  </Box>;
};

export default Stream;

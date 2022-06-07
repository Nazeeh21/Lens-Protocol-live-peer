import { Box, Button } from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { Client, isSupported } from "@livepeer/webrtmp-sdk";
import { createStream } from "../api/livepeer";

const Stream = () => {
  const [playbackId, setPlaybackId] = useState(null);
  const videoEl = useRef(null);

  const client = new Client();
  const startStream = async () => {
    if (!isSupported()) {
      alert("webrtmp-sdk is not currently supported on this browser");
      return;
    }
    const getStreamKey = await createStream();
    const streamKey = getStreamKey.streamKey;
    setPlaybackId(getStreamKey.playbackId);

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
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      videoEl.current.volume = 0;
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      window.stream = stream.current;
      videoEl.current.srcObject = stream.current;
      videoEl.current.play();
    }
  };
  return (
    <Box>
      STream
      <Button onClick={startStream}>Start stream</Button>
      <video ref={videoEl} />
      {/* {playbackId && <iframe
        src={`https://lvpr.tv?v=${playbackId}`}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture"
        sandbox="allow-scripts"
      ></iframe>} */}
    </Box>
  );
};

export default Stream;

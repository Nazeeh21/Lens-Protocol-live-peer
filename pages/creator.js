import { Box, Button, Container } from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { Client, isSupported } from "@livepeer/webrtmp-sdk";
import { createStream, exportToIpfs, uploadAsset } from "../api/livepeer";
import { StartButton, StopButton } from '../components/SearchButton'

const Stream = () => {
  const [playbackId, setPlaybackId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
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
      setLocalStream(stream);
    }
  };

  const stopStream = () => {
    if (localStream) {
      videoEl.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const saveVideo = async () => {
    const { asset } = await uploadAsset();
    const res = await exportToIpfs(asset.id);

    console.log("export to IPFS res: ", res);
  };

  return (
    <Container m='auto' h='full'>
      <StartButton onClick={startStream}>Start stream</StartButton>
      <StopButton onClick={stopStream}>Stop Stream</StopButton>
      <video ref={videoEl} />
    </Container>
  );
};

export default Stream;

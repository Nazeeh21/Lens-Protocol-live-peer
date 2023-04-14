import { Box, Button, Flex, Text, useClipboard } from "@chakra-ui/react";
import { useCreateStream } from "@livepeer/react";
import { Client, isSupported } from "@livepeer/webrtmp-sdk";
import React, { useEffect, useRef, useState } from "react";

const Creator = (): React.ReactNode => {
  const [streamName, setStreamName] = useState<string>("testStream");
  const [isLive, setIsLive] = useState<boolean>(false);
  const video = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

  const { mutate: createStream, data: stream } = useCreateStream({
    name: streamName,
  });

  useEffect(() => {
    (async () => {
      if (stream) {
        if (video.current) {
          video.current.volume = 0;

          streamRef.current = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          video.current.srcObject = streamRef.current;
          video.current.play();
          goLive();
        }
      }
    })();
  }, [stream]);

  const goLive = () => {
    const streamKey = stream?.streamKey;
    console.log("asd");
    if (!streamRef.current) {
      alert("Video stream was not started.");
    }

    if (!streamKey) {
      alert("Invalid streamKey.");
      return;
    }

    const client = new Client();

    // @ts-ignore
    const session = client.cast(streamRef.current, streamKey);
    setIsLive(true);
    setValue(stream?.playbackId);
    session.on("open", () => {
      console.log("Stream started.");
      alert("Stream started; visit Livepeer Dashboard.");
    });

    session.on("close", () => {
      console.log("Stream stopped.");
    });

    session.on("error", (err) => {
      console.log("Stream error.", err.message);
    });
  };
  return (
    <>
      <Flex marginX={2} justify="center" flexDir="column" alignItems="center">
        <Box w="40%" mt={"4rem"}>
          {!isLive ? (
            <>
              <input
                style={{
                  marginTop: "3rem",
                  borderRadius: "0.5rem",
                  margin: "auto",
                  padding: "0.5rem",
                }}
                type="text"
                // label="Stream Name"
                placeholder="My first stream"
                onChange={(e) => setStreamName(e.target.value)}
              />
              <Box mt={3}>
                <Button
                  px={"4rem"}
                  py={"1rem"}
                  onClick={() => createStream?.()}
                >
                  Create Stream
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box
                fontSize={"3rem"}
                textColor="white"
                textAlign="center"
                className="text-3xl text-white text-center"
              >
                You are live!
              </Box>
              <Flex alignItems='center' mt={"1rem"}>
                <Text w="fit-content" mr={2}>
                  Playback Id:{" "}
                </Text>
                <Text textColor={"white"}>{stream?.playbackId}</Text>
                <Button ml={3} onClick={onCopy}>
                  {hasCopied ? "Copied" : "Copy StreamLink"}
                </Button>
              </Flex>
            </>
          )}
          <video
            style={{ marginTop: "3rem", borderRadius: "0.5rem" }}
            ref={video}
          />
        </Box>
      </Flex>
    </>
  );
};

export default Creator;

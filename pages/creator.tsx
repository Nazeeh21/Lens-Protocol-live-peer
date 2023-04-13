import { Button } from "@chakra-ui/react";
import { useCreateStream } from "@livepeer/react";
import { Client, isSupported } from "@livepeer/webrtmp-sdk";
import React, { useEffect, useRef, useState } from "react";

const Creator = (): React.ReactNode => {
  const [streamName, setStreamName] = useState<string>("testStream");
  const [isLive, setIsLive] = useState<boolean>(false);
  const video = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
  return <>
  <div className="mx-12 flex justify-center flex-col items-center">
        <div className="w-1/3 mt-20">
          {!isLive ? (
            <>
              <input
                // label="Stream Name"
                placeholder="My first stream"
                onChange={(e) => setStreamName(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  className="bg-primary border-primary text-background px-4 py-2.5 text-sm"
                  onClick={() => createStream?.()}
                >
                  Create Stream
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-3xl text-white text-center">You are live!</p>
              <div className="flex mt-5">
                <p className="font-regular text-zinc-500 w-32">Playback Id: </p>
                <p className="text-white ml-2 hover:text-primary hover:cursor-pointer">
                  {stream?.playbackId}
                </p>
              </div>
            </>
          )}
          <video className="mt-9 rounded-md" ref={video} />
        </div>
      </div>
  </>;
};

export default Creator;
